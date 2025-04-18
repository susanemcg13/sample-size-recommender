from flask import Flask, render_template, request
from waitress import serve


# have to import the functions we're using from our custom python files
from calculate_participants import calculateParticipantCount
from calculate_participants import calculateDependentParticipantCount


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
@app.route('/index')

def index():
    return render_template('index.html')


@app.route('/calculate_participants')
def get_participantCount():
    # This is where we're pulling values from the "index.html" form
    # Let's see if the args value matches the "name" or "id" value in the form input; I'm guessing the former
    user_alpha = request.args.get('alpha_input')
    user_power = request.args.get('power_input')
    user_effect = request.args.get('effect_input')
    numTails = request.args.get('tails_input')
    testType = request.args.get('test_input')
    methodType = request.args.get('method_input')
    independence = request.args.get('independence_input')
    balance = request.args.get('balance_input')

    # Add some error handling here before passing the values along!

    if not user_alpha:
        user_alpha = "0.05"
    
    # so far we have only implemented the T-test
    if(testType == "T-test"):

        # shocker, this is for the independent T-test. Number of tails is passed
        if(independence == "independent"):
            display_num = calculateParticipantCount(float(user_alpha), float(user_power), float(user_effect), str(numTails))
        
        # same same, for dependent
        if(independence == "dependent"):
            display_num = calculateDependentParticipantCount(float(user_alpha), float(user_power), float(user_effect), str(numTails))

    # This is actually where we're defining the variable names that will be available in "calculate.html"
    return render_template(
        "index.html",
        num_participants = round(display_num)
    )



if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=10000)