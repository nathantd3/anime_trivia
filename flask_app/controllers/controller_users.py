from flask_app import app, bcrypt
from flask import render_template, redirect, request, session
from flask_app.models.model_users import User

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play/', methods=['GET'])
def play():
    return render_template('play.html')

@app.route('/save', methods=['POST'])
def save():
    if not User.validator(request.form):
        return redirect('/end')
    data = {
        **request.form
    }
    User.create(data)
    return redirect('/')

@app.route('/end', methods=['GET'])
def end():
    return render_template('end.html')

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    all_users = User.get_all()
    return render_template('leaderboard.html', all_users=all_users)