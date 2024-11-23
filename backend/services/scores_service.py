from datetime import datetime
import logger
from flask import jsonify, request
from sqlalchemy import desc
from sqlalchemy.exc import SQLAlchemyError

from db_models.models import db, Score


def convert_date_format(iso_str):
    date_obj = datetime.strptime(iso_str, "%Y-%m-%d")
    formatted_date = date_obj.strftime("%Y-%m-%d")
    return formatted_date


def get_score_by_id():
    try:
        value = request.args.get("score_id")
        results = db.session.query(Score).filter(Score.score_id == value).all()
        if len(results) == 0:
            return jsonify({"error": 'No Score found!'}), 400
        else:
            result_list = [result.to_dict() for result in results]
            return jsonify(result_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


def get_scores_by_field_and_date():
    try:
        count = request.args.get("count")
        field = request.args.get("field")
        entered_date = request.args.get("entered_date")

        query = db.session.query(Score).filter(
            Score.field == field,
            Score.entered_date == entered_date
        ).order_by(desc(Score.entered_time)).limit(count)

        results = query.all()
        result_list = [{column.name: getattr(row, column.name) for column in row.__table__.columns} for row in results]

        return jsonify(result_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.session.close()


def add_score(log):
    if request.method == 'POST':
        try:
            data = request.get_json()
            entered_date = convert_date_format(data['entered_date'])
            new_score = Score(
                team_a=data['team_a'],
                score_a=data['score_a'],
                team_b=data['team_b'],
                score_b=data['score_b'],
                entered_by=data['entered_by'],
                entered_date=entered_date,
                entered_time=data['entered_time'],
                field=data['field']
            )
            db.session.add(new_score)
            db.session.commit()

            response = {"message": "Data inserted successfully"}
            log.log_message(request, 200)

            return jsonify(response), 200
        except Exception as e:
            db.session.rollback()
            error_response = {"error": str(e)}
            log.log_message({e}, request, 400)
            return jsonify(error_response), 400
        finally:
            db.session.close()


def update_score():
    try:
        score_id = request.args.get('score_id')
        data = request.get_json()

        try:
            score_id = int(score_id)
        except ValueError:
            return jsonify({'error': 'Invalid score_id'}), 400

        score = db.session.query(Score).filter_by(score_id=score_id).first()
        if not score:
            return jsonify({'error': 'Score not found'}), 404

        if 'score_a' in data:
            score.score_a = data['score_a']
        if 'score_b' in data:
            score.score_b = data['score_b']
        if 'entered_date' in data:
            score.entered_date = data['entered_date']
        if 'entered_time' in data:
            score.entered_time = data['entered_time']

        if not any(field in data for field in ['score_a', 'score_b', 'entered_date', 'entered_time']):
            return jsonify({'error': 'No valid fields provided'}), 400

        db.session.commit()
        return jsonify({'message': 'Score updated successfully'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def delete_score():
    try:
        score_id = int(request.args.get("score_id"))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid score_id!'}), 400

    try:
        score = Score.query.filter(Score.score_id == score_id).first()
        if not score:
            return jsonify({'error': 'Score not found!'}), 404

        db.session.delete(score)
        db.session.commit()
        return jsonify({'message': 'Score has been deleted successfully!'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        db.session.close()