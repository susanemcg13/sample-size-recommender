const queryString = window.location.search;
const current_url = window.location.pathname;


//var js_object = {{ parameters }}
// console.log(current_url); 
// console.log(queryString); // Output: "?param1=value1&param2=value2"


function myFunc(vars){
    console.log("did this error?");
    console.log(vars);
}

var powerMetrics = {
    "effect-size":"",
    "alpha":"",
    "power":"",
    "num-participants":""
}

var effectSlider = new Slider('#effect_entry', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}

});

effectSlider.on("change", effectUpdate);

var powerSlider = new Slider('#power_entry', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});
powerSlider.on("change", powerUpdate);



var alphaSlider = new Slider('#alpha_entry', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});
alphaSlider.on("change", alphaUpdate);


if (current_url == "/select"){

    // if we're back at the "select" stage, that means we just want to hide the homepage
    // and the output page, right?
    document.getElementById("landing-page").classList.add("hide-content");
    document.getElementById("selection-page").classList.remove("hide-content");
    document.getElementById("selection-crumb").classList.remove("hide-content");
    document.getElementById("calculation-crumb").classList.add("hide-content");
    document.getElementById("calculation-page").classList.add("hide-content");

}



if (current_url == "/calculate_participants"){

    // this is hideous, but we'll worry about that once we know whether it works ;)

    // BAD BAD BAD!!!
    document.getElementById("landing-page").classList.add("hide-content");
    document.getElementById("selection-page").classList.add("hide-content");
    document.getElementById("selection-crumb").classList.remove("hide-content");
    document.getElementById("calculation-crumb").classList.remove("hide-content");
    document.getElementById("calculation-page").classList.remove("hide-content");

    // make sure to update the values of the metrics from the query string here

//tails_input=&test_input=&method_input=&independence_input=&balance_input=&ANOVA_independence_input=&ANOVA_groups_input=
// &ANOVA_m_input=


    query_params = new URLSearchParams(queryString);
   // console.log(query_params)
    powerMetrics["effect-size"] = query_params.get('effect_input');
    powerMetrics["alpha"] = query_params.get('alpha_input');
    powerMetrics["power"] = query_params.get('power_input');
    powerMetrics["num-participants"] = document.getElementById("participant-num").innerHTML;

    // setting visible power values
    powerSlider.setValue(powerMetrics["power"]);
    document.getElementById("power-size").value = powerMetrics["power"];
  
    //setting visible effect size values
    effectSlider.setValue(powerMetrics["effect-size"]);
    document.getElementById("effect-size").value = powerMetrics["effect-size"];
    
    //setting visible alpha values
    alphaSlider.setValue(powerMetrics["alpha"]);
    document.getElementById("alpha-size").value = powerMetrics["alpha"];



    // THE BELOW IS ALL SETTING FORM VALUES TO HOLD ON TO THIS INFORMATION

    document.getElementById("tails_value").value = query_params.get('tails_input');
    document.getElementById("method_value").value = query_params.get('method_input');

    // these are for T-tests
    document.getElementById("test_value").value = query_params.get('test_input');
    document.getElementById("independence_value").value = query_params.get('independence_input');
    document.getElementById("balance_value").value = query_params.get('balance_input');

    // these are for ANOVAs
    document.getElementById("ANOVA_groups_value").value = query_params.get('ANOVA_groups_input');
    document.getElementById("ANOVA_independence_value").value = query_params.get('ANOVA_independence_input');
    document.getElementById("ANOVA_m_value").value = query_params.get('ANOVA_m_input');

    // console.log("in render")
    // console.log(selections)

    // here's where we very awkwardly show/hide things based on the test type
    if(query_params.get('test_input') != "ANOVA"){
        document.getElementById("count-per-level").classList.add('hide-content');
        document.getElementById("count-per-group").classList.add('hide-content');
    }else{
        document.getElementById("count-per-level").classList.remove('hide-content');
        document.getElementById("count-per-group").classList.remove('hide-content');        
    }

}


function resetResultsDisplay(){
document.getElementById("calc_description").innerHTML = "";
document.getElementById("total-count").innerHTML = "???"

}

function effectUpdate(sliderValue){
    powerMetrics["effect-size"] = sliderValue.newValue;
    document.getElementById("effect-size").value = sliderValue.newValue;
    resetResultsDisplay();
}

function effectInputUpdate(event){
    updateValue = event.target.value;
    if(isNaN(updateValue)){
        updateValue = 0.5;
    }
    if(updateValue<0.2){
        updateValue = 0.2
    }
    if(updateValue>0.8){
        updateValue = 0.8
    }
    event.target.value = updateValue;
    powerMetrics["effect-size"] = updateValue;
    effectSlider.setValue(powerMetrics["effect-size"]);
    resetResultsDisplay();
    
}

document.getElementById("effect-size").addEventListener('input', effectInputUpdate);



function alphaUpdate(sliderValue){
    powerMetrics["alpha"] = sliderValue.newValue;
    document.getElementById("alpha-size").value = sliderValue.newValue;
    resetResultsDisplay();

}

function alphaInputUpdate(event){
    updateValue = event.target.value;
    if(isNaN(updateValue)){
        updateValue = 0.05;
    }
    if(updateValue<0.001){
        updateValue = 0.001
    }
    if(updateValue>0.1){
        updateValue = 0.1
    }
    event.target.value = updateValue;
    powerMetrics["alpha"] = updateValue;
    alphaSlider.setValue(powerMetrics["alpha"]);
    resetResultsDisplay();
}

document.getElementById("alpha-size").addEventListener('input', alphaInputUpdate);





function powerUpdate(sliderValue){
    powerMetrics["power"] = sliderValue.newValue;
    document.getElementById("power-size").value = sliderValue.newValue;
    resetResultsDisplay();
}

function powerInputUpdate(event){
    updateValue = event.target.value;
    if(isNaN(updateValue)){
        updateValue = 0.80;
    }
    if(updateValue<0.50){
        updateValue = 0.50
    }
    if(updateValue>0.99){
        updateValue = 0.99
    }
    event.target.value = updateValue;
    powerMetrics["power"] = updateValue;
    powerSlider.setValue(powerMetrics["power"]);
    resetResultsDisplay();
}

document.getElementById("power-size").addEventListener('input', powerInputUpdate);




var calculationsLog = {
    "observations":[]
}

/*
Grab all our buttons, if they're not disabled then add event handlers to them.
*/

var buttonsList = document.getElementsByTagName("button");

for (var i = 0; i < buttonsList.length; i++) {
    // Iterate over numeric indexes from 0 to 5, as everyone expects.
    var aButton = buttonsList[i];
    buttonID = aButton.id;
    // if the button isn't disabled, add functionality (handlers use id attribute to filter behavior, see handlers)
    if (!aButton.disabled){
        aButton.addEventListener("mouseover", optionOver);
        aButton.addEventListener("mouseout", optionOut);
        aButton.addEventListener("click", optionClick);
    }
}



function showOptions(buttonClick){
    document.getElementById("landing-page").classList.add("hide-content");
    document.getElementById("selection-page").classList.remove("hide-content");
    document.getElementById("selection-crumb").classList.remove("hide-content");
}

document.getElementById("start-button").addEventListener("click", showOptions);


// LEAVING THIS HERE SO I CAN ADD BACK IN THE EXPORT FUNCTION AT SOME POINT

//     var participantField = document.getElementById("participant-num");

//     powerMetrics["num-participants"] = participantCount;

//     participantField.innerHTML = participantCount;

//     var timestamp = new Date().toUTCString();

//     var logObject = {
//         "effect-size":powerMetrics["effect-size"],
//         "alpha":powerMetrics["alpha"],
//         "power":powerMetrics["power"],
//         "participantCount":participantCount,
//         "generatedAt":timestamp
//     }

//     calculationsLog["observations"].unshift(logObject);

//     showLog();

// }

function showLog(){

   var logDiv = document.getElementById("logList");
   logDiv.innerHTML = "";
    // doing this backwards so I can append each entry and have it stay reverse chron
    for(var entryNum = 0; entryNum < calculationsLog["observations"].length; entryNum ++){
       var logEntryDiv = document.createElement("div");
       var logEntry = calculationsLog["observations"][entryNum];
       logEntryDiv.innerHTML = "<b>Effect size:</b> "+logEntry["effect-size"]+" <b>Alpha:</b> "+logEntry["alpha"]+" <b>Power:</b> "+logEntry["power"]+
        " <b>Number of participants:</b> "+logEntry["participantCount"]+" <b>Timestamp:</b> "+logEntry["generatedAt"]+"<br/>";
        logDiv.append(logEntryDiv);
    }

}


function exportLog(clickEvent){
    //solution pulled from here: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    //OK for now; output is ugly (well, it all is ;)

    line1 = "Results from PowerUp! calculation on: " + new Date().toUTCString()+"\n\n";
    line2 = "Method/IRB write-up template:\n\nAn a priori power analysis was conducted using PowerUp! to determine the required sample size for a(n) "
    varsA = document.getElementById("independence_value").value+ " samples "+document.getElementById("test_value").value;
    tails_text = document.getElementById("tails_value").value;
    if (tails_text == "larger"){
        varsA+= " (one-tailed)";
    }else{
        varsA+= " (two-tailed)";
    }
    balance_text = document.getElementById("balance_value").value;
    varsA += ", assuming"
    if (balance_text == "balance-yes"){
        varsA += " equal"
    }else{
        varsA += " unequal"
    }
    varsA += " groups.\n"

    boiler_text = "We specified a minimum detectable effect size of [Cohen's d] = "+powerMetrics["effect-size"]+" [PROVIDE JUSTIFICATION]."
    boiler_text2 = "\nTo detect an effect size of [Cohen’s d] = "+powerMetrics["effect-size"]+" or higher with alpha = "+powerMetrics["alpha"]+" and power = "+powerMetrics["power"]
    boiler_text3 = ",  the minimum required sample size was estimated to be N = "+powerMetrics["num-participants"]+" per group."

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(line1+line2+varsA+boiler_text+boiler_text2+boiler_text3);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "CICIexport.txt");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

}

document.getElementById("export-log").addEventListener("click",exportLog);


function optionOver(event){
    event.target.classList.add("option-over");
}
function optionOut(event){
    isSelected = event.target.getAttribute("data-selected");
    if(event.target.getAttribute("data-selected")=="false"){
        event.target.classList.remove("option-over");
    }

}

function optionClick(event){
    // the names of the data parameters in "selections" variable are intentionally the same as
    // the names of each list's "id" attribute, which lets following be very concise
    // the line below records or overwrites each value as it's added.
    // This means we can offload the work of determining when all the necessary selections have been made
    // to a separate function that will check every time something is clicked whether a button has been missed


    containingList = event.target.parentElement.id;
    parent_list = document.getElementById(containingList);


    console.log("Checking target name:")
    console.log(event.target.id)

    // OK, so e.g. containingList will be "method" and event.target.id will be "survey"

    if(parent_list){
        // So in this case, I'm looping through all the buttons in the parent list. 
        
        items_list = parent_list.getElementsByTagName("button");
        for (i=0; i<items_list.length; i++){
            items_list[i].classList.remove("option-over");
            items_list[i].setAttribute("data-selected", "false");
        }

        // Looping through all option-specific helper text also
        console.log(containingList)
        helper_div = document.getElementById(containingList+"-helper");
        

        //first hide all the helper-box elements
        helper_boxes = document.getElementsByClassName('helper-box');
        for (i=0; i<helper_boxes.length; i++){
            helper_boxes[i].classList.add("hide-content");
        }

        //remove the "hide-content" on the main helper div
        helper_div.classList.remove("hide-content");
        
        helper_bubbles = helper_div.getElementsByClassName("option-help");
        for (i=0; i<helper_bubbles.length; i++){
            helper_bubbles[i].classList.add("hide-content");
        }

        //...and now that we've hidden all the support text, we'll show it again because *something* was clicked
        document.getElementById(event.target.id+"-info").classList.remove("hide-content");
    }

    event.target.classList.add("option-over");
    event.target.setAttribute("data-selected", "true");

    // Well, the query string is hideous but that's not unusual and at least it's readable
    if (event.target.id != "start-button" && event.target.id != "export-log"){
        var currentFormEntry;
        // console.log(containingList);
        if(containingList == "ANOVA_independent_groups"){
            currentFormEntry = document.getElementById("ANOVA_groups_value");
            currentFormEntry.value = event.target.value;
        }else if(containingList == "ANOVA_dependent_groups"){
                currentFormEntry = document.getElementById("ANOVA_groups_value");
                currentFormEntry.value = event.target.value;
        }else if(containingList == "ANOVA_m_per_group"){
                currentFormEntry = document.getElementById("ANOVA_m_value");
                currentFormEntry.value = event.target.value;          
        }else{
            currentFormEntry = document.getElementById(containingList+"_value");
            currentFormEntry.value = event.target.id;
        }
        
    }
   
    

    // need to customize the wrapper ID so that I can have a separate one for the ANOVA test later on
    // this will only work for T-test at the moment
    if(event.target.id == "survey" || event.target.id == "experiment"){
        document.getElementsByClassName("wrapper0")[0].classList.add("is-open");
    }
    if(event.target.id == "T-test"){
        document.getElementsByClassName("wrapper1")[0].classList.add("is-open");
        document.getElementsByClassName("wrapper2")[0].classList.remove("is-open");
        document.getElementById("ANOVA_independent_groups").classList.add("hide-content");
    }
    if(event.target.id == "ANOVA"){
        document.getElementsByClassName("wrapper2")[0].classList.add("is-open");
        document.getElementsByClassName("wrapper1")[0].classList.remove("is-open");
        document.getElementById("ANOVA_independent_groups").classList.add("hide-content");
    }
    if(event.target.id == "ANOVA_independent"){
        document.getElementById("ANOVA_independent_groups").classList.remove("hide-content");
    }
    if(event.target.id == "ANOVA_dependent"){
        document.getElementById("ANOVA_dependent_groups").classList.remove("hide-content");
        document.getElementById("ANOVA_m_per_group").classList.remove("hide-content");
        document.getElementById("ANOVA_independent_groups").classList.add("hide-content");
    }



    // every time a click comes through, check whether we have enough data to move on to the
    //calculation screen.
    checkSelections();
}

function checkSelections(){

    var testButton = document.getElementById("submit-test-info");

    // we're now just storing everything in our invisible form, which seems to be working for now

    // IF WE ARE DOING A T-TEST
    if((document.getElementById('method_value').value == "survey" ||  document.getElementById('method_value').value == "experiment") && document.getElementById('test_value').value == "T-test" ){
        // we are doing a T-test, so we need *something" for independence, balance and tails
        if(document.getElementById('independence_value').value != "" && document.getElementById('balance_value').value != "" && document.getElementById('tails_value').value != ""){
            testButton.disabled = false;
            console.log("can click now!");
        }
    }

    // IF WE ARE DOING A SURVEY ANOVA
        // Here's the options we've outlined for One-way ANOVA:
        // Independent (between subjects) vs Dependent (within subjects)
        // Always balanced, always "two-tailed" (non-directional)
    if(document.getElementById('method_value').value == "survey" && document.getElementById('test_value').value == "ANOVA" ){
        // we are doing a survey ANOVA
        console.log("checking here");
        if(document.getElementById('ANOVA_independence_value').value == "ANOVA_independent" && document.getElementById("ANOVA_groups_value").value != ""){
           // in this case, we're doing an independent ANOVA and we have the number of levels/groups
            testButton.disabled = false;
            console.log("we have this many levels/groups");
            console.log(document.getElementById("ANOVA_groups_value").value);
            console.log("Now we just a server function to process these results");
        }
        if(document.getElementById('ANOVA_independence_value').value == "ANOVA_dependent" && document.getElementById("ANOVA_groups_value").value != "" && document.getElementById("ANOVA_m_value").value != ""){
            // in this case, we're doing an independent ANOVA and we have the number of levels/groups
             testButton.disabled = false;
             console.log("looks like we're doing a dependent ANOVA");
             console.log(document.getElementById("ANOVA_groups_value").value);
             console.log("Now we just a server function to process these results");
         }

    }


}


