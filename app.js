require("dotenv").config();

let DEFAULTPREFIX = process.env.PREFIX;
let DEFAULTTEAM;
const SlackBot = require("slackbots");
const axios = require("axios");

const BLUE_ALLIANCE_CONFIG = {
  "X-TBA-Auth-Key": process.env.BLUE_ALLIANCE_API_KEY
};

const app = new SlackBot({
  token: process.env.TOKEN,
  name: process.env.BOT_NAME
});

//Start Handler
app.on("start", () => {
  console.log(process.env.BOT_NAME + " is now online!");

  const params = {
    icon_emoji: ":smiley:"
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
  console.log("handle message");

  if (PREFIX == DEFAULTPREFIX) {
    switch (COMMAND) {
      case "help":
        outMsg = getHelpMsg();
        sendMessage(outMsg);
        break;
      case "yomomma":
        outMsg = await getYoMommaJoke();
        sendMessage(outMsg);
        break;
      case "set":
        outMsg = await setDefaultTeam(PARAMETER);
        sendMessage(outMsg);
        break;
      case "prev":
        outMsg = await getPrevMatch(PARAMETER);
        sendMessage(outMsg);
        break;
      case "next":
        outMsg = await getNextMatch(PARAMETER);
        sendMessage(outMsg);
        break;
      case "upcoming":
        outMsg = await getUpcomingMatches(PARAMETER);
        sendMessage(outMsg);
        break;
      case "wl":
        outMsg = await getWinLoss(PARAMETER);
        sendMessage(outMsg);
        break;
      case "prefix":
        outMsg = await setPrefix(PARAMETER);
        sendMessage(outMsg);
        break;
      default:
        sendMessage("Unknown command");
        break;
    }
  }
  //<@URY21QNTD> test
  //<@URY4QJR0T> frc
  return;
};

// HELPER FUNCTIONS
var sendMessage = message => {
  app.postMessageToChannel("general", `${message}`);
};

var getYoMommaJoke = async () => {
  const res = await axios.get("https://api.yomomma.info/");
  return res.data.joke;
};

var getHelpMsg = () => {
  return "What do you need help with dummmy?";
};

var setPrefix = prefix => {
  if (prefix != undefined && prefix != null) {
    DEFAULTPREFIX = prefix;
    return `Success! Bot prefix set to '${prefix}'`;
  }
  return "Error, not a valid prefix value";
};

var setDefaultTeam = team => {
  DEFAULTTEAM = team;
  return true;
};

var getNextMatch = async (team = DEFAULTTEAM) => {
  //Gets the next upcomming match statistics and displays it
  // should also integrate with custom google sheets

  return "next";
};

var getPrevMatch = async (team = DEFAULTTEAM) => {
  //Gets the last match statistics and displays it
  return "prev";
};
var getUpcomingMatches = async (team = DEFAULTTEAM) => {
  //All matches involving team X for the next event
  return "upcoming";
};

var getWinLoss = async (team = DEFAULTTEAM) => {
  //Get all the matches of a team and compare how many wins and losses they've had
  //Optional year?
  const res = await axios.get(
    `https://www.thebluealliance.com/api/v3/team/frc${team}/years_participated`,
    (header = BLUE_ALLIANCE_CONFIG)
  );

  return res.data;
};

var error = errorMsg => {
  return `Error! Something went wrong, please check ${DEFAULTPREFIX} help for correct usage or check my logs to see what happened. Error message: ${errorMsg}`;
};

//BLUE_ALLIANCE_API_KEY

// attachments: [
//     {
//         "mrkdwn_in": ["text"],
//         "color": "#36a64f",
//         "pretext": "Optional pre-text that appears above the attachment block",
//         "author_name": "author_name",
//         "author_link": "http://flickr.com/bobby/",
//         "author_icon": "https://placeimg.com/16/16/people",
//         "title": "title",
//         "title_link": "https://api.slack.com/",
//         "text": "Optional `text` that appears within the attachment",
//         "fields": [
//             {
//                 "title": "A field's title",
//                 "value": "This field's value",
//                 "short": false
//             },
//             {
//                 "title": "A short field's title",
//                 "value": "A short field's value",
//                 "short": true
//             },
//             {
//                 "title": "A second short field's title",
//                 "value": "A second short field's value",
//                 "short": true
//             }
//         ],
//         "thumb_url": "http://placekitten.com/g/200/200",
//         "footer": "footer",
//         "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
//         "ts": 123456789
//     }
// ]

// Test buttons

// "text": "Would you like to play a game?",
//         "attachments": [
//             {
//                 "text": "Choose a game to play",
//                 "fallback": "You are unable to choose a game",
//                 "callback_id": "wopr_game",
//                 "color": "#3AA3E3",
//                 "attachment_type": "default",
//                 "actions": [
//                     {
//                         "name": "game",
//                         "text": "Chess",
//                         "type": "button",
//                         "value": "chess"
//                     },
//                     {
//                         "name": "game",
//                         "text": "Falken's Maze",
//                         "type": "button",
//                         "value": "maze"
//                     },
//                     {
//                         "name": "game",
//                         "text": "Thermonuclear War",
//                         "style": "danger",
//                         "type": "button",
//                         "value": "war",
//                         "confirm": {
//                             "title": "Are you sure?",
//                             "text": "Wouldn't you prefer a good game of chess?",
//                             "ok_text": "Yes",
//                             "dismiss_text": "No"
//                         }
//                     }
//                 ]
//             }
//         ]
