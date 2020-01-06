require("dotenv").config();

let DEFAULT_PREFIX = process.env.PREFIX;
let DEFAULT_TEAM;
const SlackBot = require("slackbots");
const axios = require("axios");
const moment = require("moment");
const api = require("./api.js");

const BLUE_ALLIANCE_CONFIG = {
  "X-TBA-Auth-Key": process.env.BLUE_ALLIANCE_API_KEY
};

const REQUEST_HEADER = { headers: BLUE_ALLIANCE_CONFIG, validateStatus: false };

const app = new SlackBot({
  token: process.env.TOKEN,
  name: process.env.BOT_NAME
});

//Start Handler
app.on("start", () => {
  console.log(process.env.BOT_NAME + " is now online!");

  const params = {
    icon_emoji: ":smiley:",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Hey there 👋 I'm Upcoming Matches Bot."
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*1️⃣ Use the \`${DEFAULT_PREFIX} help\` command*. This will display a list of all functions and how to use them.`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*2️⃣ I'm fun too!* Try out \`${DEFAULT_PREFIX} yomomma\` and see what happens!`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*3️⃣ If anything breaks...* Knock up Max on Slack if anything is wrong with me."
        }
      },
      {
        type: "divider"
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `❓Get help at any time with \`${DEFAULT_PREFIX} help\``
          }
        ]
      }
    ]
  };
  app.postMessageToChannel("general", "What's up laddies!", params);
});

// Error Handler
app.on("error", err => console.log(err));

// Message Handler
app.on("message", data => {
  if (data.type !== "message" || data.text === undefined) {
    return;
  }
  console.log(data.text.split(" "));
  handleMessage(data.text.split(" "));
});

var handleMessage = async message => {
  var outMsg;
  const PREFIX = message[0];
  const COMMAND = message[1];
  const PARAMETER = message[2];
  const PARAMETER2 = message[3];
  console.log("handle message");

  if (PREFIX == DEFAULT_PREFIX) {
    switch (COMMAND) {
      case "help":
        outMsg = helpMsg();
        break;

      case "yomomma":
        outMsg = await yoMommaJoke();
        break;

      case "set":
        outMsg = await setDEFAULT_TEAM(PARAMETER);
        break;

      case "prev":
        outMsg = await prevMatch(PARAMETER);
        break;

      case "next":
        outMsg = await nextMatch(PARAMETER);
        break;

      case "prevEvent":
        outMsg = await prevEvent(PARAMETER);
        break;

      case "nextEvent":
        outMsg = await nextEvent(PARAMETER);
        break;

      case "wl":
        outMsg = await winLoss(PARAMETER, PARAMETER2);
        break;

      case "prefix":
        outMsg = await setPrefix(PARAMETER);
        break;

      default:
        outMsg = "Unknown command";
        break;
    }
  }
  if (typeof outMsg == "string") {
    sendMessage(outMsg);
  } else {
    sendMessage("", outMsg);
  }
  //<@URY21QNTD> test
  //<@URY4QJR0T> frc
  return;
};

// HELPER FUNCTIONS

var sendMessage = (message, params) => {
  app.postMessageToChannel("general", `${message}`, params);
};

var helpMsg = () => {
  let params = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*❓COMMAND LIST❓*"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `This is a list of currently available commands. Make sure you use the command prefix \`${DEFAULT_PREFIX}\` before typing in any of these commands`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*help*\nReally?"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*prefix [prefix]*\n `prefix` is *required*.\n Sets the command prefix for this bot."
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*set [team]*\n `team` is *required*.\n Sets the `defaultTeam` for this bot"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*next [team]*\n `team` defaults to current `defaultTeam`.\n Gets the upcoming match"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*prev [team]*\n `team` defaults to current `defaultTeam`.\n Gets the most recent match."
        }
      },

      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*nextEvent [team]*\n `team` defaults to current `defaultTeam`.\n Gets the upcoming event."
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*prevEvent [team]*\n `team` defaults to current `defaultTeam`.\n Gets the most recent event."
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*wl [team] [year]*\n `team` defaults to current `defaultTeam`.\n `year` defaults to all years.\n Gets win loss of given team during a specific year."
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*yomomma*\nHaha, funny joke."
        }
      },
      {
        type: "divider"
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `❓Get help at any time with \`${DEFAULT_PREFIX} help\``
          }
        ]
      }
    ]
  };
  return params;
};

var yoMommaJoke = async () => {
  const joke = await api.getYoMommaJoke;
  return joke;
};

var prevMatch = async (team = DEFAULT_TEAM) => {
  return;
};
var nextMatch = async (team = DEFAULT_TEAM) => {
  return;
};
var prevEvent = async (team = DEFAULT_TEAM) => {
  const payload = await api.getPrevEvent(team);
  if (payload.status == "OK") {
    return payload.data;
  } else {
    return handleError(payload.data);
  }
};
var nextEvent = async (team = DEFAULT_TEAM) => {
  const payload = await api.getNextEvent(team);
  if (payload.status == "OK") {
    return payload.data;
  } else {
    return handleError(payload.data);
  }
};
var winLoss = async (team = DEFAULT_TEAM, year = "all") => {
 const payload = await api.getWinLoss(team,year);
 if(payload.status == "OK"){
     return payload.data;
 } else {
     return handleError(payload.data);
 }
};

// Setters

var setPrefix = prefix => {
  if (prefix != undefined && prefix != null) {
    DEFAULT_PREFIX = prefix;
    return `Success! Bot prefix set to '${prefix}'`;
  }
  return handleError("Error, not a valid prefix value");
};

var setDEFAULT_TEAM = team => {
  DEFAULT_TEAM = team;
  return `Success! \`defaultTeam\` set to '${team}'`;
};

// Error handling

var handleError = errorMsg => {
  console.log(errorMsg);
  errorMsg = JSON.stringify(errorMsg);
  return `Error! Something went wrong, please check \`${DEFAULT_PREFIX} help\` for correct usage or check my logs to see what happened. \nError message: \`${errorMsg}\``;
};

//BLUE_ALLIANCE_API_KEY
