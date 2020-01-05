require('dotenv').config();

const SlackBot = require('slackbots');
const axios = require('axios');


const app = new SlackBot({
    token: process.env.TOKEN,
    name: process.env.BOT_NAME
})

//Start Handler
app.on('start', () => {
    console.log(process.env.BOT_NAME + " is now online!");

    const params = {
        icon_emoji: ':smiley:'
    };
    app.postMessageToChannel(
        'general',
        'What\'s up laddies!', params
    )
})

// Error Handler
app.on('error', (err) => console.log(err));

// Message Handler
app.on('message', (data) => {

    if (data.type !== 'message') {
        return;
    }

    handleMessage(data.text);


})

var handleMessage = (message) => {
    console.log(message);
}
