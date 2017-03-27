$("#header").append("<h4>" + moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + "</h4");
// connect to database (firebase)
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBgtLEBGJt8SPdFK0Z-JMu2oaIWa8Fo820",
    authDomain: "gw-train-scheduler.firebaseapp.com",
    databaseURL: "https://gw-train-scheduler.firebaseio.com",
    storageBucket: "gw-train-scheduler.appspot.com",
    messagingSenderId: "324826880869"
  };
  firebase.initializeApp(config);

// collect user inputs and store in database
// display, from the database, the user inputs (train name, destination and frequency) on the table in the html
// calculate next arrival of the train
// calculate the minutes away of the train
// display next arrival & minutes away information on the table in the html

// Create a variable to reference the database
var database = firebase.database();

// Whenever a user clicks the submit-bid

$("#addTrain").on("click", function(event) {
  // prevent form from trying to submit
  // event.preventDefault();
  // set initial values of inputs
  var trainName = "";
  var destination = "";
  var FirstTrainTime = 0;
  var frequency = "";
  // Get the input values from the form fields
  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  FirstTrainTime = $("#FirstTrainTime").val().trim();
  frequency = $("#frequency").val().trim();
  // var bidderPrice = parseInt($("#bidder-price").val().trim());
  // push results to firebase by setting the keys and values of the keys
  database.ref().push({
		name: trainName,
		destination: destination,
		firstTime: FirstTrainTime,
		frequency: frequency
	});



});

// display data in database in the html (table)
database.ref().on("child_added", function(train) {
	console.log(train.val());
	
// Set current time
    var currentTime = moment().format("HH:MM");
    console.log("CURRENT TIME: " + currentTime);

    var firstTime = train.val().firstTime;
	var firstTimeConverted = moment(firstTime, "hh:mm");
	// .subtract(1, "years");
    console.log("First Train Time: " + firstTimeConverted);

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tFrequency = train.val().frequency;
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
	

	var tr = $("<tr>");
	var td = $("<td>"); 
	td.append(train.val().name);
	tr.append(td);
	td = $("<td>");
	td.append(train.val().destination);
	tr.append(td);
	td = $("<td>");
	td.append(train.val().frequency);
	tr.append(td);
	td = $("<td>");
	td.append(moment(nextTrain).format("hh:mm"));
	tr.append(td);
	td = $("<td>");
	td.append(tMinutesTillTrain);
	tr.append(td);
	td = $("<td>");
	$("tbody").append(tr);
	
    

});



