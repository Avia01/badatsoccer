import jwt
import pandas as pd
from flask_bcrypt import check_password_hash
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, or_
from db_models.models import db, TeamSelection, Player
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from services import azure_services as azs, google_services as gos
import logger as log
from services.google_services import get_google_sheet, get_data_from_sheet
from services import scores_service as scs, game_service as gs, teams_service as ts, fields_service as fs
import datetime
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
JWT_SECRET_KEY = os.getenv('SECRET_KEY')


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
            return datetime.datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Date '{date_str}' does not match any known formats")


@app.route('/insert_team_selection_sheet_data')
def insert_team_selection_sheet_data():
    try:
        sheet_id = "1BL1KkNbhp4cn8WrFByKYUId0Xm10eMqncMdtAMLqkgA"
        sheet = get_google_sheet(sheet_id)
        sheet_data = get_data_from_sheet(sheet, 'A', 'L')

        sheet_data['date'] = sheet_data['date'].apply(lambda x: datetime.strptime(x, '%d/%m/%Y').date())

        unique_pairs = sheet_data[['date', 'player_name']].drop_duplicates()

        existing_records = db.session.query(TeamSelection.date, TeamSelection.player_name).filter(
            or_(*[
                and_(TeamSelection.date == row['date'], TeamSelection.player_name == row['player_name'])
                for _, row in unique_pairs.iterrows()
            ])
        ).all()

        existing_pairs = {(record[0], record[1]) for record in existing_records}

        results = []

        for i, row in sheet_data.iterrows():
            if row.drop(['date', 'player_name']).apply(lambda x: pd.isna(x) or x == '').any():
                results.append({
                    "row": i + 2,
                    "status": "skipped",
                    "message": "Row contains empty values except for date and player_name"
                })
                continue

            date_field = row['date']
            player_name_field = row['player_name']

            if (date_field, player_name_field) in existing_pairs:
                try:
                    team_selection = db.session.query(TeamSelection).filter(
                        and_(
                            TeamSelection.date == date_field,
                            TeamSelection.player_name == player_name_field
                        )
                    ).first()

                    for key, value in row.items():
                        if key not in ['date', 'player_name']:
                            setattr(team_selection, key, value)

                    db.session.commit()
                    results.append({
                        "row": i + 2,
                        "status": "updated",
                        "message": "Row updated successfully"
                    })
                except Exception as update_error:
                    results.append({
                        "row": i + 2,
                        "status": "failed",
                        "message": f"Update error: {update_error}"
                    })
            else:
                try:
                    new_record = TeamSelection(
                        **{key: row[key] for key in row.keys()}
                    )
                    db.session.add(new_record)
                    db.session.commit()
                    results.append({
                        "row": i + 2,
                        "status": "success",
                        "message": "Row inserted successfully"
                    })
                except Exception as insert_error:
                    results.append({
                        "row": i + 2,
                        "status": "failed",
                        "message": f"Insertion error: {insert_error}"
                    })

        return jsonify({"message": "Sheet processed successfully", "results": results}), 200

    except Exception as e:
        db.session.rollback()
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
            # Create JWT payload
            payload = {
                'id': user.id,
                'gmail': user.gmail,
                'roles': [user.type],
                'player_name': user.player_name,
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)  # Token expiry
            }

            # Generate the token
            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

            return jsonify({
                'token': token,
                'data': {
                    'id': user.id,
                    'gmail': user.gmail,
                    'roles': [user.type],
                    'player_name': user.player_name
                },
                'status_code': 200,
                'message': 'Login successful!'
            }), 200
        else:
            return jsonify({"message": "Invalid credentials!"}), 401
    except SQLAlchemyError as e:
        return jsonify({"message": str(e)}), 500


if __name__ == '__main__':
    # Production mode
    # app.run()

    # Development mode
    app.run(debug=True)
