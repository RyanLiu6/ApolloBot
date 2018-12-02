const slackEventsApi = require('@slack/events-api');
const SlackClient = require('@slack/client').WebClient;
const express = require('express');
const Mention = require("./mentionCommands");

// *** Initialize an Express application
const app = express();

// *** Initialize a client with your access token
const slack = new SlackClient(process.env.SLACK_ACCESS_TOKEN);

// *** Initialize event adapter using signing secret from environment variables ***
const slackEvents = slackEventsApi.createEventAdapter(process.env.SLACK_SIGNING_SECRET);

// Apollo Prefix
const PREFIX_SUGGEST = "suggest";
const PREFIX_CHECK = "check";

// Homepage
app.get('/', (req, res) => {
  const url = `https://${req.hostname}/slack/events`;
  res.setHeader('Content-Type', 'text/html');

  return res.send(`<pre>Copy this link to paste into the event URL field: <a href="${url}">${url}</a></pre>`);
});

// *** Plug the event adapter into the express app as middleware ***
app.use('/slack/events', slackEvents.expressMiddleware());

// *** Attach listeners to the event adapter ***

// *** Greeting any user that says "hi" ***
slackEvents.on('app_mention', (message) => {
  console.log(message);

  // Get user arguments and pass it to the command parser
  var userArr = message.text.split(" ");

  // Storing properties to the slack client for easier access
  slack.command = userArr[1];
  slack.arg = userArr.slice(1);
  slack.retChannel = message.channel;
  slack.retUser = message.user;

  Mention.commandParser(slack);
});

// // *** Responding to reactions with the same emoji ***
// slackEvents.on('reaction_added', (event) => {
//   console.log(event);
//   // Respond to the reaction back with the same emoji

//   slack.chat.postMessage({
//     channel: event.item.channel,
//     text: `:${event.reaction}:`
//   })
//   .catch(console.error);
// });

// *** Handle errors ***
slackEvents.on('error', (error) => {
  if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
    // This error type also has a `body` propery containing the request body which failed verification.
    console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
${JSON.stringify(error.body)}`);
  } else {
    console.error(`An error occurred while handling a Slack event: ${error.message}`);
  }
});

// Start the express application
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
