function sendQuickReplies(sender) {
  const messageData = {
    recipient: { id: sender },
    message: {
      text: 'What would you like to do next?',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Option 1',
          payload: 'OPTION_1'
        },
        {
          content_type: 'text',
          title: 'Option 2',
          payload: 'OPTION_2'
        }
      ]
    }
  };

  request({
    uri: 'https://graph.facebook.com/v12.0/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  });
}
if (event.message && event.message.text) {
  const text = event.message.text;
  if (text.toLowerCase() === 'start') {
    sendQuickReplies(sender); // Send quick replies on "start" message
  } else {
    sendTextMessage(sender, `You said: ${text}`);
  }
}
