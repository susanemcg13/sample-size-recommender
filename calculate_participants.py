from dotenv import load_dotenv
from pprint import pprint
import math
import statsmodels.stats.power as smp

from scipy.stats import f
import pingouin as pg

import requests
import os




# these are for T-tests

def calculateParticipantCount(alpha="0.05", power="0.8", effect_size="0.5", numTails="two-sided"):

    analysis_obj = smp.TTestIndPower()

    participants_needed = analysis_obj.solve_power(effect_size=effect_size, power=power, alpha=alpha, alternative=numTails)
    
    return math.ceil(participants_needed)


def calculateDependentParticipantCount(alpha="0.05", power="0.8", effect_size="0.5", numTails="two-sided"):

    analysis_obj = smp.TTestPower()

    participants_needed = analysis_obj.solve_power(effect_size=effect_size, power=power, alpha=alpha, alternative=numTails)
    
    return math.ceil(participants_needed)


# these are for ANOVAs

# for independent (between subjects) ANOVAs
def calculateIndependentANOVA(alpha="0.05", power="0.8", effect_size="0.25", num_levels="2"):

    eta_from_ef = (effect_size*effect_size)/(1+effect_size*effect_size)

    rough_per_level = pg.power_anova(eta_squared=eta_from_ef, power=power, k=num_levels)
    
    return math.ceil(rough_per_level)

# for independent (between subjects) ANOVAs
def calculateDependentANOVA(alpha="0.05", power="0.8", effect_size="0.25", num_levels="2", m_per_group="2"):

    cohens_calc = (effect_size*effect_size)/(2*m_per_group)
    cohens_eta = (cohens_calc)/(1+cohens_calc)

    rough_per_level = pg.power_rm_anova(eta_squared=cohens_eta, power=power, alpha=alpha, m=m_per_group, corr=0.5, epsilon=1)
    
    return math.ceil(rough_per_level)



def formatSelectionString(paramsDict):

    # method is not getting updated how come?

    default_frags = ["You are conducting"," and you want to find the sample size you need to conduct", ". Your ideal sample size depends on your chosen p-value, statistical power, and effect size. Use the standard parameters below or enter your own!"]
    method_frag = ""

    desc_frags = ["To detect down to an effect size of <b>d = "," at <b>","% power</b> (alpha = <b>","</b>) for your <b>","</b>, you will need at least:"]

    if(paramsDict["methodType"] == "experiment"):
        method_frag =  " an <b>experiment</b>;"
    elif(paramsDict["methodType"] == "survey"):
        method_frag = " a <b>survey study</b> "

    if(paramsDict["Tindependece"] == "independent"):
        dependence_frag =  " an <b>independent"
    elif(paramsDict["Tindependece"] == "dependent"):
        dependence_frag = " a <b>dependent"

    if(paramsDict["testType"] == "T-test"):
        test_frag =  " t-test ("
    elif(paramsDict["testType"] == "ANOVA"):
        test_frag = " ANOVA ("
    
    if(paramsDict["Tbalance"] == "balance-yes"):
        balance_frag =  "balanced groups,"
    elif(paramsDict["Tbalance"] == "balance-no"):
        balance_frag = "unbalanced groups,"  
    
    if(paramsDict["numTails"] == "two-sided"):
        tails_frag =  " two-tailed)</b>"
    elif(paramsDict["numTails"] == "larger"):
        tails_frag = " one-tailed)</b>"  

    selection_string = default_frags[0] + method_frag + default_frags[1] + dependence_frag + test_frag + balance_frag + tails_frag+default_frags[2] 
    
    description_string = desc_frags[0] + paramsDict["user_effect"] +"</b>"+ desc_frags[1] + str(float(paramsDict["user_power"])*100) + desc_frags[2] + paramsDict["user_alpha"] + desc_frags[3]+ paramsDict["Tindependece"]+ test_frag + balance_frag + tails_frag+desc_frags[4]

    display_text = {"selection_string":selection_string, "description_string":description_string}

    return display_text


# # Ignore the below variables for the purposes of the webapp. This is just a way to test that our 
# # functions are working/returning what we expect via the terminal

if __name__ == "__main__":
    print ("\nGood news, it worked!")

    count_results = calculateParticipantCount(0.05, 0.8, 0.5)

    print("\nThis is for an independent T test with standard power, effect size, and alpha values:")
    pprint(count_results)
