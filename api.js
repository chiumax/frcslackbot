// Collection of functions that handles with APIs
// ALL FUNCTIONS REQUIRE A PAYLOAD
const axios = require("axios");
const moment = require("moment");

const BLUE_ALLIANCE_CONFIG = {
  "X-TBA-Auth-Key": process.env.BLUE_ALLIANCE_API_KEY
};
let DEFAULT_PREFIX = process.env.PREFIX;

const REQUEST_HEADER = { headers: BLUE_ALLIANCE_CONFIG, validateStatus: false };

var getYoMommaJoke = async () => {
  const payload = {
    status: "OK",
    data: "empty"
  };
  const res = await axios.get("https://api.yomomma.info/");
  payload.data = res.data.joke;
  return payload;
};

var getPrevMatch = async team => {
  //Gets the last match statistics and displays it

  return "next";
};

var getNextMatch = async team => {
  //Gets the next upcomming match statistics and displays it
  // should also integrate with custom google sheets
};

var getPrevEvent = async team => {
  // all matches involving team x for the last event
  const payload = {
    status: "OK",
    data: "empty"
  };
  var teamKey = "frc" + team;
  var res,
    closestEventTime = moment(),
    closestEvent,
    now = moment();
  res = await axios.get(
    `https://www.thebluealliance.com/api/v3/team/${teamKey}/events`,
    REQUEST_HEADER
  );
  if (res.data.Errors) {
    return handleError(res.data.Errors);
  }
  for (const event of res.data) {
    let startDate = moment(event.start_date);
    if (now - startDate < closestEventTime && now > startDate) {
      closestEventTime = now - startDate;
      closestEvent = event.key;
    }
  }
  console.log(closestEvent);
  payload.data = getEvent(closestEvent);
  return payload;
};
var getNextEvent = async team => {
  const payload = {
    status: "OK",
    data: "empty"
  };
  //All matches involving team X for the next event
  var teamKey = "frc" + team;
  var res,
    closestEventTime = moment(),
    closestEvent,
    now = moment();
  res = await axios.get(
    `https://www.thebluealliance.com/api/v3/team/${teamKey}/events`,
    REQUEST_HEADER
  );
  if (res.data.Errors) {
    return handleError(res.data.Errors);
  }
  for (const event of res.data) {
    let startDate = moment(event.start_date);
    if (startDate - now < closestEventTime && startDate > now) {
      closestEventTime = startDate - now;
      closestEvent = event.key;
    }
  }
  console.log(closestEvent);

  payload.data = getEvent(closestEvent);
  return payload;
};

var getEvent = async eventID => {
  var res;

  res = await axios.get(
    `https://www.thebluealliance.com/api/v3/event/${eventID}`,
    REQUEST_HEADER
  );
  if (res.data.Errors) {
    return handleError(res.data.Errors);
  }
  const event = res.data;
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
  return params;
};

var getWinLoss = async (team, year) => {
  //Get all the matches of a team and compare how many wins and losses they've had
  //Optional year?
  const payload = {
    status: "OK",
    data: "empty"
  };
  var teamKey = "frc" + team;
  var res,
    years,
    win = 0,
    loss = 0,
    returnVal,
    total = 0,
    yearTotal = 0;
  res = await axios.get(
    `https://www.thebluealliance.com/api/v3/team/${teamKey}/years_participated`,
    REQUEST_HEADER
  );
  if (res.data.Errors) {
    return handleError(res.data.Errors);
  }

  years = res.data;
  if (year == "all") {
    for (const subYear of years) {
      res = await axios.get(
        `https://www.thebluealliance.com/api/v3/team/${teamKey}/matches/${subYear}`,
        REQUEST_HEADER
      );
      if (res.data.Errors) {
        return handleError(res.data.Errors);
      }
      returnVal = checkWin(teamKey, res.data);
      win += returnVal[0];
      loss += returnVal[1];
      total += returnVal[2];
      yearTotal += 1;
    }
    payload.data = `Wins: ${win} Loss: ${loss} Win Percentage: ${win /
      (loss + win)} Total: ${total} Years: ${yearTotal}`;
    return payload;
  } else if (res.data.includes(parseInt(year))) {
    res = await axios.get(
      `https://www.thebluealliance.com/api/v3/team/${teamKey}/matches/${year}`,
      REQUEST_HEADER
    );
    if (res.data.Errors) {
      return handleError(res.data.Errors);
    }
    returnVal = checkWin(teamKey, res.data);
    win = returnVal[0];
    loss = returnVal[1];
    total = returnVal[2];
    payload.data = `Wins: ${win} Loss: ${loss} Win Percentage: ${win /
      (loss + win)} Total: ${total} Year: ${year}`;
    return payload;
  } else {
    return handleError("Not a valid year");
  }
};

var checkWin = (teamKey, matches) => {
  let win = 0,
    loss = 0;
  for (const match of matches) {
    if (match.alliances.red.team_keys.includes(teamKey)) {
      if (match.winning_alliance == "red") {
        win += 1;
      } else {
        loss += 1;
      }
    } else if (match.alliances.blue.team_keys.includes(teamKey)) {
      if (match.winning_alliance == "blue") {
        win += 1;
      } else {
        loss += 1;
      }
    }
  }
  return [win, loss, matches.length];
};

var handleError = error => {
  // wrap up the payload and send it back
  const payload = {
    status: "FAIL",
    data: error
  };
  return payload;
};

module.exports = {
  getYoMommaJoke,
  getWinLoss,
  getNextEvent,
  getPrevEvent,
  getNextMatch,
  getPrevMatch
};
