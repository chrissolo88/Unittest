from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abc123'

boggle_game = Boggle()

@app.route('/')
def board_page():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('index.html', board=board)

@app.route('/submit-word')
def submit_word():
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)
    return jsonify({'result': response})

@app.route("/track-score", methods=["POST"])
def track_score():
    score = request.json["score"]
    high_score = session.get("high_score", 0)
    num_plays = session.get("num_plays", 0)
    session['num_plays'] = num_plays + 1
    session['high_score'] = max(score, high_score)
    return jsonify(brokeRecord=score > high_score, num_plays=session['num_plays'], high_score=high_score)
