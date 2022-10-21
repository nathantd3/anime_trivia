from flask_app.config.mysqlconnection import MySQLConnection, connectToMySQL
from flask import flash, session
from flask_app import app, bcrypt
import re

class User:
    def __init__( self , data ):
        self.id = data['id']
        self.username = data['username']
        self.score = data['score']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def create(cls, data):
        query = "INSERT INTO users (username, score) VALUES (%(username)s, %(score)s);"
        user_id = MySQLConnection('trivia_db').query_db(query, data)
        return user_id

    @classmethod
    def get_all(cls):
        query = "SELECT * FROM users;"
        results = connectToMySQL('trivia_db').query_db(query)
        
        if not results:
            return []
            
        all_users = []
        
        for user in results:
            all_users.append(cls(user))
        return all_users

    @classmethod
    def get_one(cls, data):
        query = "SELECT * FROM users WHERE id = %(id)s"
        result = connectToMySQL('trivia_db').query_db(query, data)

        if not result:
            return False

        return cls( result[0] )

    @staticmethod
    def validator(data:dict):
        is_valid = True

        if len(data['username']) < 3:
            is_valid = False
            flash("Username must be at least 2 characters", "err_username")
            
        return is_valid
