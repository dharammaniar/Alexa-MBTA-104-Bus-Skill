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

/**
 * MBTA104 is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var MBTA104 = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MBTA104.prototype = Object.create(AlexaSkill.prototype);
MBTA104.prototype.constructor = MBTA104;

MBTA104.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("MBTA104 onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

MBTA104.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("MBTA104 onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the MBTA 104 Bus Skill, you can say when is the next bus to Malden";
    var repromptText = "You can say when is the next bus to Malden";
    response.ask(speechOutput, repromptText);
};

MBTA104.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("MBTA104 onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

MBTA104.prototype.intentHandlers = {
    // register custom intent handlers
    "104MaldenIntent": function (intent, session, response) {
        response.tellWithCard(
            "The next bus to Malden is in 5 minutes",
            "MBTA 104",
            "The next bus to Malden is in 5 minutes");
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "Welcome to the MBTA 104 Bus Skill, you can say when is the next bus to Malden";
        var repromptText = "You can say when is the next bus to Malden";
        response.ask(speechOutput, repromptText);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the MBTA104 skill.
    var mbta104 = new MBTA104();
    mbta104.execute(event, context);
};

