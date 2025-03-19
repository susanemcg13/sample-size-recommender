
const queryString = window.location.search;
const current_url = window.location.pathname;
console.log(current_url); 
console.log(queryString); // Output: "?param1=value1&param2=value2"

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


if (current_url == "/calculate_participants"){
    
    // this is hideous, but we'll worry about that once we know whether it works ;)

    // BAD BAD BAD!!!
    document.getElementById("landing-page").classList.add("hide-content");
    document.getElementById("selection-page").classList.add("hide-content");
    document.getElementById("calculation-crumb").classList.remove("hide-content");
    document.getElementById("calculation-page").classList.remove("hide-content");

    // make sure to update the values of the metrics from the query string here

    query_params = new URLSearchParams(queryString);
    powerMetrics["effect-size"] = query_params.get('effect_input');
    powerMetrics["alpha"] = query_params.get('alpha_input');
    powerMetrics["power"] = query_params.get('power_input');
    powerMetrics["num-participants"] = document.getElementById("participant-num").innerHTML;

// NEED TO UPDATE/TRULY POPULATE ALPHA TEXT BOX FROM QUERY STRING
// THINK THERE"S A ROGUE SOMETHING HAPPENING BECAUSE OF MY FORM SETUP
    

    powerSlider.setValue(powerMetrics["power"]);
    document.getElementById("power").innerHTML = "Power: "+powerMetrics["power"];
    effectSlider.setValue(powerMetrics["effect-size"]);
    document.getElementById("effect-size").innerHTML = "Effect size: "+powerMetrics["effect-size"];

}

var selections = {
    "method":"",
    "test":"",
    "independence":"",
    "balance":"",
    "tails":""
}


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

// var formFieldsList = document.getElementsByTagName("input");

// for (var i = 0; i < formFieldsList.length; i++){

//     var aFormField = formFieldsList[i];
//     aFormField.addEventListener("blur", fieldBlur);

// }


// So far I have to set up the slider handlers piecemeal, which I do not love
// might bother to update at some point, but for now just relying on package functionality

// DISABLING SLIDER EFFECTS WHILE I TRY TO GET THE MAIN FLASK APP RUNNING





function effectUpdate(sliderValue){
    powerMetrics["effect-size"] = sliderValue.newValue;
    document.getElementById("effect-size").innerHTML = "Effect size: "+sliderValue.newValue;

}

function powerUpdate(sliderValue){
    console.log(sliderValue.newValue);
    powerMetrics["power"] = sliderValue.newValue;
    document.getElementById("power").innerHTML = "Power: "+sliderValue.newValue;

}

// DISABLING SLIDER EFFECTS WHILE I TRY TO GET THE MAIN FLASK APP RUNNING

// The above functions happen on page load. Some will be overridden below so don't move that code down!


function showOptions(buttonClick){
    document.getElementById("landing-page").classList.add("hide-content");
    document.getElementById("selection-page").classList.remove("hide-content");
    document.getElementById("selection-crumb").classList.remove("hide-content");
}




document.getElementById("start-button").addEventListener("click", showOptions);

// function writeSelections(){
//     var selections_div = document.getElementById("selections-status");
//     selections_div.innerHTML = "Method: "+ selections["method"] + " -> Test type: "+selections["test"]+ " -> Balance: "+selections["balance"]+ " -> Independence: "+selections["independence"]+ " -> Tails: "+selections["tails"]
// }


function showCalculator(){
    document.getElementById("landing-page").classList.add("hide-content");
    document.getElementById("selection-page").classList.add("hide-content");
    document.getElementById("calculation-crumb").classList.remove("hide-content");
    document.getElementById("calculation-page").classList.remove("hide-content");
    // document.getElementById("calculate-participants").disabled = false;

  //  writeSelections();

    

    // set default values of the power metrics here

    console.log("in show calculator");
    powerMetrics["effect-size"] = "0.5";
    powerMetrics["alpha"] = "0.05";
    powerMetrics["power"] = "0.8";
    
}

document.getElementById("submit-test-info").addEventListener("click", showCalculator);


function calculateIndependentBalancedTtest(effectSize, alpha, power, tailCount){

    var oldN = -1; // default
    var targetN = 100000; // default with a sample size of 100K
    var delta = .1; // default delta 
    var groupRatio = 1; // balance - not used yet
    var numTails = 2; // number of tails, default 2
    if(tailCount == "one-tail"){
        numTails = 1; 
    }

  // translation: while absolute difference between "oldN" and "n" is greater than delta (0.1 by default)
  // set "oldN" to current value of "n" and then run whatever that stuff on the n calculation line is and that 
  // becomes "n" FOR A SINGLE GROUP
    while (Math.abs(oldN-targetN) > delta) {
        oldN = targetN;
        targetN = ((groupRatio+1)/groupRatio)*(-jStat.studentt.inv(alpha/numTails,(oldN*(groupRatio+1))-2)-jStat.studentt.inv(1-power,(oldN*(groupRatio+1))-2))**2/effectSize**2;
    }


    return Math.ceil(targetN*2);

}


// function calculateParticipants(buttonClick){
  

//     //let's add some logic and some helper functions
    
//     // so this is the conditional for our inital test
//     // would be helpful to get some shortnames for these so I can set/test a flag value
//     // this is repeated elsewhere 

//     var participantCount = -1;

//     // HIDEOUS! But quick ;)
//     // survey or experiment, independent, balanced, two-tailed t-test
//     if((selections["method"] == "survey" || selections["method"] == "experiment")&& selections["test"] == "T-test" &&
//         selections["independence"] == "independent" && selections["balance"] == "balance-yes"
//         && (selections["tails"] == "two-tail" || selections["tails"] == "one-tail")){
//             console.log("calling function!")
//             participantCount = calculateIndependentBalancedTtest(powerMetrics["effect-size"], powerMetrics["alpha"], powerMetrics["power"], selections["tails"]);
//         }





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

// document.getElementById("calculate-participants").addEventListener("click", calculateParticipants);

function exportLog(clickEvent){
    //solution pulled from here: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    //OK for now; output is ugly (well, it all is ;)
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(calculationsLog));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "CICIexport.txt");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

}

// document.getElementById("export-log").addEventListener("click",exportLog);



// function fieldBlur(event){

//     var inputField = event.target.id;
//     var inputValue = event.target.value;
//     var invalidValue = false;
//     document.getElementById("participant-num").innerHTML = "";
//     if(isNaN(inputValue)){
//         document.getElementById(inputField+"-feedback").innerHTML = "Value must be a number."
//         invalidValue = true;
//     }
//     if(inputField == "effect-size"){
//         console.log("in effect size blur")
//         if(inputValue < 0.2 || inputValue > 0.8){
//             document.getElementById(inputField+"-feedback").innerHTML = "Value must be a number between 0.2 and 0.8"
//             invalidValue = true;
//         }
//     }
//     if(inputField == "alpha"){
//         if(inputValue < 0.001 || inputValue > 0.1){
//             document.getElementById(inputField+"-feedback").innerHTML = "Value must be a number between 0.1 and 0.001"
//             invalidValue = true;
//         }
//     }
//     if(inputField == "power"){
//         if(inputValue < 0.5 || inputValue > 0.99){
//             document.getElementById(inputField+"-feedback").innerHTML = "Value must be a number between 0.50 and 0.99"
//             invalidValue = true;
//         }
//     }

//     var calculateButton = document.getElementById("calculate-participants");
//     if(invalidValue){
//         calculateButton.disabled = true;
//     }else{
//         powerMetrics[inputField] = inputValue;
//         // calculateButton.disabled = false;
//     }

// }



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
    if(parent_list){
        items_list = parent_list.getElementsByTagName("button");
        for (i=0; i<items_list.length; i++){
            items_list[i].classList.remove("option-over");
            items_list[i].setAttribute("data-selected", "false");
        }
    }
    event.target.classList.add("option-over");
    event.target.setAttribute("data-selected", "true");


    selections[containingList] = event.target.id;
    // need to customize the wrapper ID so that I can have a separate one for the ANOVA test later on
    // this will only work for T-test at the moment
    if(event.target.id == "T-test"){
        document.getElementsByClassName("wrapper")[0].classList.add("is-open");
    }

    // every time a click comes through, check whether we have enough data to move on to the
    //calculation screen.
    checkSelections();
}

function checkSelections(){

    var testButton = document.getElementById("submit-test-info");

    // WOW, so much repeated code
    // currently allowing survey OR experiment
    // T-test
    // independent
    // balanced
    // one OR two-tailed
    if((selections["method"] == "survey" ||  selections["method"] == "experiment") && selections["test"] == "T-test" &&
        selections["independence"] == "independent" && selections["balance"] == "balance-yes"
        && (selections["tails"] == "two-tail" || selections["tails"] == "one-tail")){
            testButton.disabled = false;
        }

}


