const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const port = process.env.PORT || 3000;

// Facebook Page Access Token (from your App)
const PAGE_ACCESS_TOKEN = 'EAAeb6KPJsPgBO1ZAbaYAf9VdqDtLM3pattsyCjfI14294poKBVE3ty4Hs8JlkXmiXvmIAJbTolAqmIyGgy6hHZARecxc4yqNNVirWq3tqAZAJmPBZAEFbFCRRZBJaAv8iA7CuMznlpZCWhthq8iFHPy9iyMgsWKdkTHOb67UtcdB9eVE0tQUgVfzmI1lBy0ZBshLQZDZD';

// Your Facebook Verification Token
const VERIFY_TOKEN = 'Anu1677##';

// Setup body-parser middleware
app.use(bodyParser.json());

// Step 1. Webhook Setup (for Facebook to verify)
app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Step 2. Handle incoming messages
app.post('/webhook', (req, res) => {
  const messaging_events = req.body.entry[0].messaging;
  for (let i = 0; i < messaging_events.length; i++) {
    const event = messaging_events[i];
    const sender = event.sender.id; // Sender ID

    if (event.message && event.message.text) {
      const text = event.message.text;
      // Handle the message from the user
      sendTextMessage(sender, `You said: ${text}`);
    }
  }

  res.sendStatus(200);
});

// Step 3. Send a text message to the user
function sendTextMessage(sender, text) {
  const messageData = {
    recipient: { id: sender },
    message: { text: text }
  };

  request({
    uri: 'https://graph.facebook.com/v12.0/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  }, (error, response, body) => {
    if (error) {
      console.error('Error sending message: ', error);
    } else if (response.body.error) {
      console.error('Error response: ', response.body.error);
    }
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
