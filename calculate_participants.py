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






# # Ignore the below variables for the purposes of the webapp. This is just a way to test that our 
# # functions are working/returning what we expect via the terminal

if __name__ == "__main__":
    print ("\nGood news, it worked!")

    count_results = calculateParticipantCount(0.05, 0.8, 0.5)

    print("\nThis is for an independent T test with standard power, effect size, and alpha values:")
    pprint(count_results)
