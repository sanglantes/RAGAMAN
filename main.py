from flask import Flask, render_template, request
import anagram
import json

app = Flask(__name__, template_folder='templates/')
game = anagram.Anagram("popular")
occupied = []

@app.route('/')
def main():
    scrambled_word, original_word, word_index = game.create_anagram()
    return render_template("index.html", scrambled_word=scrambled_word)

@app.route("/check_solution", methods=['POST'])
def check_solution():
    data = request.get_json()
    got_word = data["word"]
    valid, solution = game.check_solution(game.shuffled_word, got_word)
    if got_word in occupied:
        return json.dumps({"valid": 1, "solution": "Already taken"})
    if not valid:
        occupied.append(got_word)
    return json.dumps({"valid": valid, "solution": solution})

@app.route("/new_word", methods=['GET'])
def new_word():
    scrambled_word, original_word, word_index = game.create_anagram()
    print(original_word)
    global occupied
    occupied = []
    return json.dumps({"scrambled_word": scrambled_word})

@app.route("/swedish")
def swedish():
    global game  # Access the globally defined 'game' object
    game = anagram.Anagram("swedish")
    scrambled_word, original_word, word_index = game.create_anagram()
    return render_template("index.html", scrambled_word=scrambled_word)

@app.route("/english")
def english():
    global game  # Access the globally defined 'game' object
    game = anagram.Anagram("popular")
    scrambled_word, original_word, word_index = game.create_anagram()
    return render_template("index.html", scrambled_word=scrambled_word)

@app.route("/french")
def french():
    global game  # Access the globally defined 'game' object
    game = anagram.Anagram("french")
    scrambled_word, original_word, word_index = game.create_anagram()
    return render_template("index.html", scrambled_word=scrambled_word)

if __name__ == "__main__":
    app.run(debug=True)
