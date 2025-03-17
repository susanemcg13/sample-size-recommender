from dotenv import load_dotenv
from pprint import pprint
from math import sqrt 
import statsmodels.stats.power as smp
import requests
import os






def calculateParticipantCount(alpha="0.05", power="0.8", effect_size="0.5"):

    analysis_obj = smp.TTestIndPower()

    participants_needed = analysis_obj.solve_power(effect_size=effect_size, power=power, alpha=alpha)
    
    return participants_needed







# # Ignore the below variables for the purposes of the webapp. This is just a way to test that our 
# # functions are working/returning what we expect via the terminal

if __name__ == "__main__":
    print ("\nGood news, it worked!")

    count_results = calculateParticipantCount(0.05, 0.8, 0.5)

    print("\nThis is for an independent T test with standard power, effect size, and alpha values:")
    pprint(count_results)
