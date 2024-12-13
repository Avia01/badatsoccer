# models.py
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class TeamSelection(db.Model):
    __tablename__ = 'team_selection'

    player_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    player_name = db.Column(db.String(255), nullable=False)
    team = db.Column(db.String(255))
    stamina = db.Column(db.Integer, nullable=False)
    technique = db.Column(db.Integer, nullable=False)
    ball_leader = db.Column(db.Integer, nullable=False)
    aggression = db.Column(db.Integer, nullable=False)
    tournament = db.Column(db.String(255))
    version = db.Column(db.String(50))
    tournament_to_pick = db.Column(db.String(255))
    team_to_pick = db.Column(db.String(255))
    field_auto = db.Column(db.String(50))
    date = db.Column(db.Date)

    def to_dict(self):
        return {
            "player_id": self.player_id,
            "player_name": self.player_name,
            "team": self.team,
            "stamina": self.stamina,
            "technique": self.technique,
            "ball_leader": self.ball_leader,
            "aggression": self.aggression,
            "tournament": self.tournament,
            "version": self.version,
            "tournament_to_pick": self.tournament_to_pick,
            "team_to_pick": self.team_to_pick,
            "field_auto": self.field_auto,
            "date": self.date
        }


# Model for Score
class Score(db.Model):
    __tablename__ = 'scores'

    score_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team_a = db.Column(db.String(255))
    score_a = db.Column(db.Integer, nullable=False)
    team_b = db.Column(db.String(255))
    score_b = db.Column(db.Integer, nullable=False)
    entered_by = db.Column(db.String(255))
    entered_date = db.Column(db.String(50))
    entered_time = db.Column(db.String(50))
    field = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "score_id": self.score_id,
            "team_a": self.team_a,
            "score_a": self.score_a,
            "team_b": self.team_b,
            "score_b": self.score_b,
            "entered_by": self.entered_by,
            "entered_date": self.entered_date,
            "entered_time": self.entered_time,
            "field": self.field
        }


# Model for Player
class Player(db.Model):
    __tablename__ = 'players'

    player_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    phone_number = db.Column(db.String(255))
    heb = db.Column(db.String(255))
    player_name = db.Column(db.String(50), nullable=False)
    tournament = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Numeric(5, 1))
    type = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(255))
    payment_type = db.Column(db.String(50))
    id = db.Column(db.String(50))
    aa = db.Column(db.String(50))
    last_game_date = db.Column(db.String(255))
    join_date = db.Column(db.String(255))
    birthday = db.Column(db.String(50))
    gmail = db.Column(db.String(50))
    football_team = db.Column(db.String(50))

    def to_dict(self):
        return {
            "player_id": self.player_id,
            "phone_number": self.phone_number,
            "heb": self.heb,
            "player_name": self.player_name,
            "tournament": self.tournament,
            "rating": self.rating,
            "type": self.type,
            "password": self.password,
            "payment_type": self.payment_type,
            "id": self.id,
            "aa": self.aa,
            "last_game_date": self.last_game_date,
            "join_date": self.join_date,
            "birthday": self.birthday,
            "gmail": self.gmail,
            "football_team": self.football_team
        }


class User(UserMixin):
    def __init__(self, id, email, password):
        self.id = id
        self.email = email
        self.password = password

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "password": self.password
        }
