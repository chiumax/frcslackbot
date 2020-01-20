# runner-slack-bot
slack bot to provide drive team metrics regarding upcoming matches


## Run This Bot

1. Clone the repository and run `npm install`
2. In the base repository create a `.env` file
3. Follow [this](https://slack.com/help/articles/115005265703-Create-a-bot-for-your-workspace) to make a slack app
4. Get the `Bot User OAuth Access Token` and put it in your `.env` file.
5. Go to [this](https://www.thebluealliance.com/apidocs/v3) and make a bluealliance API key and put it in your `.env` file.
6. Take a look at the `.env` template below
7. `node ./app.js`

## .env Template

**KEEP** quotation marks.

```env
TOKEN='xxxx-5555-...'
BLUE_ALLIANCE_API_KEY='QXgurhs...'
BOT_NAME='Upcoming Match Bot'
PREFIX=.upcoming
```

