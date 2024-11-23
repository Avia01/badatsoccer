from datetime import datetime

from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from db_models.models import TeamSelection, db, Score


def format_date(d):
    return d.strftime('%Y-%m-%d')


def convert_str_to_date(date_str):
    return datetime.strptime(date_str, '%d/%m/%Y')


def get_games_dates():
    try:
        results = db.session.query(
            TeamSelection.date).distinct().order_by(
            TeamSelection.date.desc()).limit(5).all()
        result_dicts = [{'date': format_date(
            convert_str_to_date(result.date))} for
            result in results]
        return jsonify(result_dicts), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.session.close()


def get_games_statistics_by_team_and_date():
    try:
        entered_date = request.args.get("entered_date")
        field = request.args.get("field")
        results = db.session.query(Score).filter(Score.entered_date == entered_date,
                                                 Score.field == field).all()

        result_dicts = [result.to_dict() for result in results]
        return jsonify(result_dicts), 200

    except SQLAlchemyError as e:

        return jsonify({"error": str(e)}), 400
    finally:
        db.session.close()

