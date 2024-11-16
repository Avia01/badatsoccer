from flask import jsonify, request
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from db_models.models import TeamSelection, db


def get_teams_by_field_and_date():
    try:
        field = request.args.get('field_auto')
        entered_date = request.args.get('date')

        teams = db.session.query(
            func.replace(func.lower(TeamSelection.team_to_pick), ' team', '').label('team')
        ).filter(
            TeamSelection.field_auto == field,
            TeamSelection.date == entered_date
        ).distinct().all()

        result = [{'team': team.team} for team in teams]
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


def get_all_players():
    try:
        date = request.args.get('date')
        field = request.args.get('field')
        results = db.session.query(TeamSelection).filter_by(date=date, field_auto=field)
        result_list = [result.to_dict() for result in results]

        return jsonify(result_list), 200

    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.session.close()


def get_team():
    try:
        team_to_pick = request.args.get("team_to_pick")
        field_auto = request.args.get("field_auto")
        date = request.args.get("date")

        result = (db.session.query(TeamSelection)
                  .filter_by(team_to_pick=team_to_pick, field_auto=field_auto, date=date)
                  .all())

        result_list = [team.to_dict() for team in result]

        return jsonify(result_list), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 400
