from flask import Flask, render_template, request
from waitress import serve
import math

# have to import the functions we're using from our custom python files
from calculate_participants import calculateParticipantCount
from calculate_participants import calculateDependentParticipantCount
from calculate_participants import calculateIndependentANOVA
from calculate_participants import calculateDependentANOVA
from calculate_participants import formatSelectionString


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
@app.route('/index')

def index():
        return render_template(
        "index.html",
        num_participants = "",
        selection_values = "",
        selections = ""
    )

@app.route("/select") 
def select(): 
        return render_template(
        "index.html",
        num_participants = "",
        selection_values = "",
        selections = ""
    )

@app.route('/calculate_participants')


def get_participantCount():
    # This is where we're pulling values from the "index.html" form
    # Let's see if the args value matches the "name" or "id" value in the form input; I'm guessing the former
    # user_alpha = request.args.get('alpha_input')
    # user_power = request.args.get('power_input')
    # user_effect = request.args.get('effect_input')
    # testType = request.args.get('test_input')
    # methodType = request.args.get('method_input')
    
    # # for t-tests
    # numTails = request.args.get('tails_input')
    # independence = request.args.get('independence_input')
    # balance = request.args.get('balance_input')

    # # for ANOVAs
    # ANOVA_independence = request.args.get('ANOVA_independence_input')
    # ANOVA_groups = request.args.get('ANOVA_groups_input')
    # ANOVA_mpg = request.args.get('ANOVA_m_input')


    parameters = {
        "user_alpha": request.args.get('alpha_input'),
        "user_power": request.args.get('power_input'), 
        "user_effect": request.args.get('effect_input'),
        "testType": request.args.get('test_input'),
        "methodType": request.args.get('method_input'),
        "numTails": request.args.get('tails_input'),
        "Tindependece": request.args.get('independence_input'),
        "Tbalance":request.args.get('balance_input'),
        "ANOVA_independence": request.args.get('ANOVA_independence_input'),
        "ANOVA_groups" : request.args.get('ANOVA_groups_input'),
        "ANOVA_mpg" : request.args.get('ANOVA_m_input')
    }

    # Add some error handling here before passing the values along!

    if not parameters["user_alpha"]:
        user_alpha = "0.05"
        parameters["user_alpha"] = "0.05"

    
    
    # so far we have only implemented the T-test
    if(parameters["testType"] == "T-test"):
        # shocker, this is for the independent T-test. Number of tails is passed
        if(parameters["Tindependece"] == "independent"):
            display_num = calculateParticipantCount(float(parameters["user_alpha"]), float(parameters["user_power"]), float(parameters["user_effect"]), str(parameters["numTails"]))
        
        # same same, for dependent
        if(parameters["Tindependece"] == "dependent"):
            display_num = calculateDependentParticipantCount(float(parameters["user_alpha"]), float(parameters["user_power"]), float(parameters["user_effect"]), str(parameters["numTails"]))

        selection_string = "You did a T-test"

    # adding ANOVAs
    if(parameters["testType"] == "ANOVA"):
        # 
        if(parameters["ANOVA_independence"] == "ANOVA_independent"):

            per_group = calculateIndependentANOVA(float(parameters["user_alpha"]), float(parameters["user_power"]), float(parameters["user_effect"]), float(parameters["ANOVA_groups"]))

            display_num = per_group*float(parameters["ANOVA_groups"])
            selection_string = "You did an independent ANOVA"

        # same same, for dependent
        if(parameters["ANOVA_independence"] == "ANOVA_dependent"):
            per_group = calculateDependentANOVA(float(parameters["user_alpha"]), float(parameters["user_power"]), float(parameters["user_effect"]), float(parameters["ANOVA_groups"]), float(parameters["ANOVA_mpg"]))

            display_num = per_group
        
            selection_string = "You did a dependent ANOVA"
    

    # This is actually where we're defining the variable names that will be available in "calculate.html"
    text_messages = formatSelectionString(parameters)

    
    return render_template(
        "index.html",
        num_participants = display_num,
        selection_values = text_messages["selection_string"],
        description_message = text_messages["description_string"],
        selections = parameters
    )



if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=10000)