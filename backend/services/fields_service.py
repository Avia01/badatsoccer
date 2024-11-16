from flask import jsonify, request

from db_models.models import TeamSelection, db


def get_all_fields():
    try:
        date = request.args.get("date")
        results = db.session.query(TeamSelection.field_auto.label('field')).distinct().filter_by(date=date).all()
        result_list = [{'field': result.field} for result in results]
        return jsonify(result_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def get_field_by_date_and_team():
    try:
        field_auto = request.args.get('field_auto')
        date = request.args.get('date')
        results = db.session.query(TeamSelection.team_to_pick) \
            .filter(TeamSelection.field_auto == field_auto) \
            .filter(TeamSelection.date == date) \
            .distinct() \
            .all()
        response = [{"team_to_pick": result.team_to_pick} for result in results]

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 400
