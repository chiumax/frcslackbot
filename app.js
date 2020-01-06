require("dotenv").config();

let DEFAULT_PREFIX = process.env.PREFIX;
let DEFAULT_TEAM,
  DEFAULT_SHEET =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuO5uzyhF6NjaNU1E3l9Gwqxi4b4qklsodLWuEuJ_SqMDr2wvA1-cEU1IYRrOMxlAPG6lPkhIeE0vr/pub?gid=1216391683&single=true&output=csv";
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
      case "sheet":
        outMsg = await sheet(PARAMETER);
        break;
      case "setSheet":
        outMsg = await setSheet(PARAMETER);
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
            "*setSheet [url]*\n `url` is *required*.\n Sets the `defaultSheet` for this bot"
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
          text:
            "*sheet [url]*\n `url` defaults to current `defaultSheet`.\n Returns first 4 cells of the second row."
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

var sheet = async (url = DEFAULT_SHEET) => {
  if (url[0] == "<") {
    url = url.substring(1, url.length - 1);
    url = url.replace(/&amp;/g, "&");
  }

  let res = await api.getGoogleSheet(url);
  console.log(res);
  return `${res[0]}, ${res[1]}, ${res[2]}, ${res[3]}`;
};

var yoMommaJoke = async () => {
  const joke = await api.getYoMommaJoke();
  return joke.data;
};

var prevMatch = async (team = DEFAULT_TEAM) => {
  const payload = await api.getPrevMatch(team);
  const match = payload.data;

  if (payload.data == undefined) {
    return "No match data found";
  }
  if (payload.status == "OK") {
    const params = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${"https://www.youtube.com/watch?v=" + match.videos[0].key}`
          }
        },
        { type: "divider" }
      ],
      attachments: [
        {
          fallback: "",
          color: "#FF451D",
          pretext: `Score: ${match.alliances.red.score}`,
          author_name: "Red Alliance",
          fields: [
            {
              title: `${match.alliances.red.team_keys[0].substring(3)}`,
              short: false
            },
            {
              title: `${match.alliances.red.team_keys[1].substring(3)}`,
              short: false
            },
            {
              title: `${match.alliances.red.team_keys[2].substring(3)}`,
              short: false
            }
          ]
        },
        {
          fallback: "",
          color: "#1851F5",
          pretext: `Score: ${match.alliances.blue.score}`,
          author_name: "Blue Alliance",

          fields: [
            {
              title: `${match.alliances.blue.team_keys[0].substring(3)}`,
              short: false
            },
            {
              title: `${match.alliances.blue.team_keys[1].substring(3)}`,
              short: false
            },
            {
              title: `${match.alliances.blue.team_keys[2].substring(3)}`,
              short: false
            }
          ]
        }
      ]
    };
    return params;
  } else {
    return handleError(payload.data);
  }
};
var nextMatch = async (team = DEFAULT_TEAM) => {
  const payload = await api.getNextMatch(team);
  const match = payload.data;
  console.log(payload.data);

  if (payload.data == "empty") {
    return "No match data found";
  }
  if (payload.status == "OK") {
    const params = {
      attachments: [
        {
          fallback: "",
          color: "#FF451D",

          author_name: "Red Alliance",
          fields: [
            {
              title: `${match.alliances.red.team_keys[0].substring(3)}`,
              short: false
            },
            {
              title: `${match.alliances.red.team_keys[1].substring(3)}`,
              short: false
            },
            {
              title: `${match.alliances.red.team_keys[2].substring(3)}`,
              short: false
            }
          ]
        },
        {
          fallback: "",
          color: "#1851F5",

          author_name: "Blue Alliance",

          fields: [
            {
              title: `${match.alliances.blue.team_keys[0].substring(3)}`,
              short: false
            },
            {
              title: `${match.alliances.blue.team_keys[1].substring(3)}`,
              short: false
            },
            {
              title: `${match.alliances.blue.team_keys[2].substring(3)}`,
              short: false
            }
          ]
        }
      ]
    };
    return params;
  } else {
    return handleError(payload.data);
  }
};
var prevEvent = async (team = DEFAULT_TEAM) => {
  const payload = await api.getPrevEvent(team);
  const event = payload.data;
  console.log(payload.data.win);
  let params = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${event.name}`
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*<${event.gmaps_url}|${event.location_name}>*\n ⌛ ${moment(
            event.start_date
          ).format("LL")}\n  🔗 <${event.website}|Website>\n 🏆 ${
            event.event_type_string
          } event\n ✔️ Win ${event.win[0]}\n ❌ Loss ${event.win[1]}\n `
        },
        accessory: {
          type: "image",
          image_url:
            "https://img.icons8.com/plasticine/200/000000/google-maps.png",
          alt_text: "map icon"
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
  if (payload.status == "OK") {
    return params;
  } else {
    return handleError(payload.data);
  }
};
var nextEvent = async (team = DEFAULT_TEAM) => {
  const payload = await api.getNextEvent(team);
  const event = payload.data;
  let params = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${event.name}`
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*<${event.gmaps_url}|${event.location_name}>*\n ⌛ ${moment(
            event.start_date
          ).format("LL")}\n  🔗 <${event.website}|Website>\n 🏆 ${
            event.event_type_string
          } event`
        },
        accessory: {
          type: "image",
          image_url:
            "https://img.icons8.com/plasticine/200/000000/google-maps.png",
          alt_text: "map icon"
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
  if (payload.status == "OK") {
    return params;
  } else {
    return handleError(payload.data);
  }
};
var winLoss = async (team = DEFAULT_TEAM, year = "all") => {
  const payload = await api.getWinLoss(team, year);
  if (payload.status == "OK") {
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

var setSheet = url => {
  if (url[0] == "<") {
    url = url.substring(1, url.length - 1);
    url = url.replace(/&amp;/g, "&");
  }
  DEFAULT_SHEET = url;
  return `Success! \`defaultSheet\` set to '${url}'`;
};

// Error handling

var handleError = errorMsg => {
  console.log(errorMsg);
  errorMsg = JSON.stringify(errorMsg);
  return `Error! Something went wrong, please check \`${DEFAULT_PREFIX} help\` for correct usage or check my logs to see what happened. \nError message: \`${errorMsg}\``;
};

//BLUE_ALLIANCE_API_KEY
