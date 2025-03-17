from flask import Flask, render_template, request
from waitress import serve


# have to import the functions we're using from our custom python files
from calculate_participants import calculateParticipantCount


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
@app.route('/index')

def index():
    return render_template('index.html')


@app.route('/calculate_participants')
def get_participantCount():
    # This is where we're pulling values from the "index.html" form?!
    # Let's see if the args value matches the "name" or "id" value in the form input; I'm guessing the former
    user_alpha = request.args.get('alpha_input')
    user_power = request.args.get('power_input')
    user_effect = request.args.get('effect_input')

    # Add some error handling here before passing the values along!

    display_num = calculateParticipantCount(float(user_alpha), float(user_power), float(user_effect))

    # This is actually where we're defining the variable names that will be available in "calculate.html"
    return render_template(
        "index.html",
        num_participants = round(display_num)
    )



if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8000)