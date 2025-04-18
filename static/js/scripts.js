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

var selections = {
    "method":"",
    "test":"",
    "independence":"",
    "balance":"",
    "tails":""
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

    query_params = new URLSearchParams(queryString);
    powerMetrics["effect-size"] = query_params.get('effect_input');
    powerMetrics["alpha"] = query_params.get('alpha_input');
    powerMetrics["power"] = query_params.get('power_input');
    powerMetrics["num-participants"] = document.getElementById("participant-num").innerHTML;

    powerSlider.setValue(powerMetrics["power"]);
    document.getElementById("power").innerHTML = "Power: "+powerMetrics["power"];
    effectSlider.setValue(powerMetrics["effect-size"]);
    document.getElementById("effect-size").innerHTML = "Effect size: "+powerMetrics["effect-size"];
    document.getElementById("alpha_entry").value = powerMetrics["alpha"];
    document.getElementById("tails_value").value = query_params.get('tails_input');




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


function effectUpdate(sliderValue){
    powerMetrics["effect-size"] = sliderValue.newValue;
    document.getElementById("effect-size").innerHTML = "Effect size: "+sliderValue.newValue;

}

function powerUpdate(sliderValue){
    console.log(sliderValue.newValue);
    powerMetrics["power"] = sliderValue.newValue;
    document.getElementById("power").innerHTML = "Power: "+sliderValue.newValue;

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
    console.log("hi");
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


    console.log(containingList);
    console.log(event.target.id);
    // this is where we're setting the values for the "selections" list, but probably should move this
    // OK, trying to move over to just using the form fields for data management. This might be a terrible idea but not sure why yet.
    // Well, the query string is hideous but that's not unusual and at least it's readable
    if (event.target.id != "start-button"){
        var currentFormEntry = document.getElementById(containingList+"_value");
        currentFormEntry.value = event.target.id;
        selections[containingList] = event.target.id;
    }
   
    

    // need to customize the wrapper ID so that I can have a separate one for the ANOVA test later on
    // this will only work for T-test at the moment
    if(event.target.id == "T-test"){
        document.getElementsByClassName("wrapper")[0].classList.add("is-open");
    }
    // if(containingList == "tails"){
    //     // so here, we'll update our hidden form field because no AJAX yet
    //     document.getElementById("tails_value").value = event.target.id;
    // }

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

    // since we don't have default selections, it kind of makes sense to keep this vestigial piece
    // but I should think of something better soon....
    if((selections["method"] == "survey" ||  selections["method"] == "experiment") && selections["test"] == "T-test" &&
        (selections["independence"] == "independent" || selections["independence"] == "dependent") && selections["balance"] == "balance-yes"
        && (selections["tails"] == "two-sided" || selections["tails"] == "larger")){
            testButton.disabled = false;
            console.log("can click now!");
        }

}


