/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var http = require('http');
var moment = require('moment');

/**
 * MBTA is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var MBTA = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MBTA.prototype = Object.create(AlexaSkill.prototype);
MBTA.prototype.constructor = MBTA;

MBTA.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("MBTA onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

MBTA.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("MBTA onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the MBTA 104 Bus Skill, you can say when is the next bus to Malden";
    var repromptText = "You can say when is the next bus to Malden";
    response.ask(speechOutput, repromptText);
};

MBTA.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("MBTA onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

MBTA.prototype.intentHandlers = {
    // register custom intent handlers
    "MBTAMaldenIntent": function (intent, session, response) {
        processIntent('Malden', 'http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=5357&format=json', response);
    },
    "MBTASullivanIntent": function (intent, session, response) {
        processIntent('Sullivan', 'http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=5351&format=json', response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "Welcome to the MBTA 104 Bus Skill, you can say when is the next bus to Malden";
        var repromptText = "You can say when is the next bus to Malden";
        response.ask(speechOutput, repromptText);
    }
};

function processIntent(direction, url, response) {
    http.get(url, function(res) {
        console.log('Inside successCallback');
        var str = '';
        res.on('data', function (chunk) {
            str += chunk;
        });
        res.on('end', function() {
            console.log('STR: ' + str);
            var data = JSON.parse(str);
            console.log('DATA: ' + data);
            if (data.mode && data.mode.length > 0) {
                var secondsAway = data.mode[0].route[0].direction[0].trip[0].pre_away;
                var timeLeft = moment.duration(Number(secondsAway), 'seconds');
                var minutesLeft = timeLeft.minutes();
                var secondsLeft = timeLeft.seconds();
                response.tellWithCard(
                    "The next bus to " + direction + " is in " + minutesLeft + " minutes and " + secondsLeft + " seconds",
                    "MBTA",
                    "The next bus to " + direction + " is in " + minutesLeft + " minutes and " + secondsLeft + " seconds");
            } else {
                response.tellWithCard(
                    "Sorry, there are no scheduled buses to " + direction,
                    "MBTA",
                    "Sorry, there are no scheduled buses to " + direction);
            }
        });

    }).on('error', function (err) {
        console.log(err);
        response.tellWithCard(
            "Sorry, there are no scheduled buses to " + direction,
            "MBTA",
            "Sorry, there are no scheduled buses to " + direction);
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the MBTA skill.
    var mbta = new MBTA();
    mbta.execute(event, context);
};

