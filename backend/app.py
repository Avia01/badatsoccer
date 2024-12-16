import bcrypt
import pandas as pd
from flask_bcrypt import check_password_hash
from sqlalchemy.exc import SQLAlchemyError
from db_models.models import db, TeamSelection, Player
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from services import azure_services as azs, google_services as gos
import logger as log
from services.google_services import get_google_sheet, get_data_from_sheet
from services import scores_service as scs, game_service as gs, teams_service as ts, fields_service as fs
from datetime import datetime
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_size": 10,
    "max_overflow": 20,
    "pool_timeout": 30,
    "pool_recycle": 1800,
}

db.init_app(app)

with app.app_context():
    db.create_all()

CORS(app, origins=['https://badatsoccer.onrender.com', "http://localhost:3000",
                                    'https://www.bad-at-soccer.in', 'https://bad-at-soccer.in'])
CONTAINER_NAME = 'player-photo'


@app.route('/')
def home():
    message = 'Welcome to the Bad at Soccer API!'
    return jsonify(message)


@app.route('/log')
def logs():
    with open(f'{log.LOGS_DIR}/{log.LOG_NAME}', 'r') as log_file:
        log_contents = log_file.read()
    return jsonify({"log_data": log_contents, "log_name": log.LOG_NAME})


@app.route('/logs/clear', methods=['POST'])
def clear_log():
    try:
        with open(os.path.join(f'{log.LOGS_DIR}', secure_filename(log.LOG_NAME)), 'w'):
            pass
        message = {"success": True, "message": "Log file cleared"}
        log.log_message(request, message.get('message'), 200)
        log.logger.info('Log file cleared')
        return jsonify(message)
    except Exception as e:
        log.logger.error(e)
        log.log_message(request, {"error": str(e)}, 500)
        return jsonify({"error": str(e)}), 500


def parse_date(date_str):
    for fmt in ('%d/%m/%Y', '%Y-%m-%d'):  # Handle multiple date formats
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Date '{date_str}' does not match any known formats")


@app.route('/insert_team_selection_sheet_data')
def insert_team_selection_sheet_data():
    try:
        # Google Sheets details
        sheet_id = "1BL1KkNbhp4cn8WrFByKYUId0Xm10eMqncMdtAMLqkgA"
        sheet = get_google_sheet(sheet_id)
        sheet_data = get_data_from_sheet(sheet, 'A', 'L')  # Columns A to L

        results = []

        # Use session.no_autoflush to prevent premature flushing
        with db.session.no_autoflush:
            for i, row in sheet_data.iterrows():
                try:
                    # Parse and validate fields
                    date = parse_date(row['date'])
                    player_name = row['player_name']
                    team = row.get('team')
                    stamina = int(row['stamina']) if row.get('stamina') else None
                    technique = int(row['technique']) if row.get('technique') else None
                    ball_leader = int(row['ball_leader']) if row.get('ball_leader') else None
                    aggression = int(row['aggression']) if row.get('aggression') else None
                    tournament = row.get('tournament')
                    version = row.get('version')
                    tournament_to_pick = row.get('tournament_to_pick')
                    team_to_pick = row.get('team_to_pick')
                    field_auto = row.get('field_auto')

                    # Check for existing record
                    existing_record = TeamSelection.query.filter_by(date=date, player_name=player_name).first()
                    if existing_record:
                        # Update the existing record
                        existing_record.team = team
                        existing_record.stamina = stamina
                        existing_record.technique = technique
                        existing_record.ball_leader = ball_leader
                        existing_record.aggression = aggression
                        existing_record.tournament = tournament
                        existing_record.version = version
                        existing_record.tournament_to_pick = tournament_to_pick
                        existing_record.team_to_pick = team_to_pick
                        existing_record.field_auto = field_auto
                        results.append({"row": i + 2, "status": "updated", "message": "Record updated successfully"})
                    else:
                        # Insert a new record
                        new_record = TeamSelection(
                            date=date,
                            player_name=player_name,
                            team=team,
                            stamina=stamina,
                            technique=technique,
                            ball_leader=ball_leader,
                            aggression=aggression,
                            tournament=tournament,
                            version=version,
                            tournament_to_pick=tournament_to_pick,
                            team_to_pick=team_to_pick,
                            field_auto=field_auto,
                        )
                        db.session.add(new_record)
                        results.append({"row": i + 2, "status": "inserted", "message": "Record inserted successfully"})
                except ValueError as ve:
                    results.append({"row": i + 2, "status": "failed", "message": str(ve)})

        # Commit all changes
        db.session.commit()
        message = {"message": "Sheet data processed successfully", "results": results}
        log.log_message(request, message.get('message'), 200)
        return jsonify(message), 200

    except Exception as e:
        db.session.rollback()
        log.log_message(request, {'error': str(e)}, 400)
        return jsonify({"error": str(e)}), 400


# @app.route('/insert_team_selection_sheet_data')
# def insert_team_selection_sheet_data():
#     try:
#         sheet_id = "1BL1KkNbhp4cn8WrFByKYUId0Xm10eMqncMdtAMLqkgA"
#         sheet = get_google_sheet(sheet_id)
#
#         if sheet is None:
#             raise ValueError("Failed to retrieve Google Sheet")
#
#         sheet_data = get_data_from_sheet(sheet, 'A', 'L')
#
#         if sheet_data is None:
#             raise ValueError("Failed to retrieve data from Google Sheet")
#
#         sheet_data['date'] = pd.to_datetime(sheet_data['date'], dayfirst=True, errors='coerce').dt.strftime('%Y-%m-%d')
#
#         if sheet_data['date'].isna().any():
#             raise ValueError("Invalid dates detected in the data.")
#
#         # Fetch all existing player names and dates
#         existing_pairs = {
#             (record.player_name, record.date): record
#             for record in TeamSelection.query.all()
#         }
#
#         results = []
#         success_count = 0
#         failure_count = 0
#
#         for i, row in sheet_data.iterrows():
#             # Skip rows with missing player_name or date
#             if pd.isna(row['player_name']) or pd.isna(row['date']):
#                 results.append({
#                     "row": i + 2,
#                     "status": "skipped",
#                     "message": "Row skipped due to missing player_name or date."
#                 })
#                 continue
#
#             pair_key = (row['player_name'], row['date'])
#
#             if pair_key in existing_pairs:
#                 # Update the existing record
#                 try:
#                     record = existing_pairs[pair_key]
#                     for key, value in row.items():
#                         if key != 'player_id':  # Avoid changing the primary key
#                             setattr(record, key, value)
#                     db.session.commit()
#                     results.append({
#                         "row": i + 2,
#                         "status": "updated",
#                         "message": "Record updated successfully."
#                     })
#                     success_count += 1
#                 except Exception as update_error:
#                     db.session.rollback()
#                     results.append({
#                         "row": i + 2,
#                         "status": "failed",
#                         "message": f"Update error: {update_error}"
#                     })
#                     failure_count += 1
#                     app.logger.error(f"Update error for row {i + 2}: {update_error}")
#             else:
#                 # Insert a new record
#                 try:
#                     row_data = row.drop(labels=['player_id'], errors='ignore').to_dict()  # Exclude player_id
#                     new_record = TeamSelection(**row_data)
#                     db.session.add(new_record)
#                     db.session.commit()
#                     results.append({
#                         "row": i + 2,
#                         "status": "success",
#                         "message": "Record inserted successfully."
#                     })
#                     success_count += 1
#                 except Exception as insert_error:
#                     db.session.rollback()
#                     results.append({
#                         "row": i + 2,
#                         "status": "failed",
#                         "message": f"Insertion error: {insert_error}"
#                     })
#                     failure_count += 1
#                     app.logger.error(f"Insertion error for row {i + 2}: {insert_error}")
#
#         # If no data was successfully inserted or updated, return an error response
#         if success_count == 0:
#             app.logger.error("No records were successfully processed.")
#             return jsonify({
#                 "error": "No records were successfully processed.",
#                 "results": results
#             }), 400
#
#         # Return a success response with the results
#         return jsonify({
#             "message": f"Sheet processed successfully with {success_count} successful operations and {failure_count} failures.",
#             "results": results
#         }), 200
#     except Exception as e:
#         # Rollback the transaction in case of an unhandled error
#         db.session.rollback()
#         app.logger.error(f"Unexpected error: {e}")
#         return jsonify({"error": f"Unexpected error: {e}"}), 500


@app.route('/insert_players_sheet_data')
def insert_players_sheet_data():
    try:
        sheet_id = "11j5LnCerz_RhTYrVZoksFBLHyFVFq23TyItJt70x2MY"
        sheet = get_google_sheet(sheet_id)
        sheet_data = get_data_from_sheet(sheet, 'A', 'N')
        results = []
        for i, row in sheet_data.iterrows():
            try:
                password = row.get('password', '')
                if not password:
                    password = f"{row['player_name'][0]}{row['phone_number']}"
                hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

                player = db.session.query(Player).filter_by(player_name=row['player_name']).first()

                if player:
                    # ����� ���� ����
                    for key, value in row.items():
                        if key != 'player_name':
                            setattr(player, key, value)
                    player.password = hashed_password
                    results.append({"row": i + 2, "status": "updated", "message": "Player updated successfully"})
                else:
                    new_player = Player(**row.to_dict())
                    new_player.password = hashed_password
                    db.session.add(new_player)
                    results.append({"row": i + 2, "status": "success", "message": "Player inserted successfully"})

                db.session.commit()
            except Exception as insert_error:
                results.append({"row": i + 2, "status": "failed", "message": f"Insertion error: {insert_error}"})
                log.logger.error(f"Insertion error for row {i + 2}: {insert_error}")
                db.session.rollback()

        db.session.close()
        log.logger.info('Sheet data processed successfully!'), 200
        return jsonify({"message": "Sheet processed successfully", "results": results}), 200
    except Exception as e:
        log.logger.error(e)
        return jsonify({"error": str(e)}), 400


@app.route('/search_players_by_name')
def search_players_by_name():
    try:
        search_text = request.args.get('query', '')
        date = request.args.get('date')

        results = TeamSelection.query.filter(
            TeamSelection.date == date,
            TeamSelection.player_name.ilike(f'%{search_text}%')
        ).all()

        data = [player.to_dict() for player in results]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/get_images_from_azure')
def get_images_from_azure():
    blob_list = []
    container_client = azs.connect_to_azure_storage('player-photo')
    blob_items = container_client.list_blobs()
    for blob in blob_items:
        blob_item = container_client.get_blob_client(blob=blob.name)
        blob_list.append({'player_url': blob_item.url, 'player_name': blob.name})
    return jsonify(blob_list), 200


@app.route('/get_all_fields')
def get_all_fields():
    return fs.get_all_fields()


@app.route('/get_field')
def get_field():
    return fs.get_field_by_date_and_team()


@app.route('/get_teams_by_field_and_date')
def get_teams_by_field_and_date():
    return ts.get_teams_by_field_and_date()


@app.route('/get_all_players')
def get_all_players():
    return ts.get_all_players()


@app.route('/get_team')
def get_team():
    return ts.get_team()


@app.route('/add_score', methods=['POST'])
def add_score():
    return scs.add_score(log)


@app.route('/get_score_by_id')
def get_score_by_id():
    return scs.get_score_by_id()


@app.route('/get_scores_by_field_and_date')
def get_scores_by_field_and_date():
    return scs.get_scores_by_field_and_date()


@app.route('/delete_score', methods=['DELETE'])
def delete_score():
    return scs.delete_score()


@app.route('/update_score', methods=['PATCH'])
def update_score():
    return scs.update_score()


@app.route('/get_games_dates')
def get_games_dates():
    return gs.get_games_dates()


@app.route('/get_games_statistics_by_team_and_date')
def get_games_statistics_by_team_and_date():
    return gs.get_games_statistics_by_team_and_date()


@app.route('/update_players_images')
def update_players_images():
    gos.transfer_files('1VhVxbMnRgsP44sQGSrIETabD4eBhkfLV', container_name=CONTAINER_NAME)
    log.logger.info('Players images updated successfully!'), 200
    return jsonify('Players images updated successfully!'), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['gmail']
    password = data['password']

    try:
        user = Player.query.filter_by(gmail=email).first()
        if user and check_password_hash(user.password, password):
            user_data = {
                'id': user.id,
                'gmail': user.gmail,
                'roles': [user.type],
                'player_name': user.player_name
            }
            return (jsonify({
                'data': user_data,
                'status_code': 200,
                'message': 'Player retrieved successfully !'}), 200)
        else:
            return jsonify({"message": "Invalid credentials!"}), 401
    except SQLAlchemyError as e:
        return jsonify({"message": str(e)}), 500


if __name__ == '__main__':
    # Production mode
    # app.run()

    # Development mode
    app.run(debug=True)
