const fetch = require('node-fetch');

exports.handler = async () => {
  const webhookURL = "https://discord.com/api/webhooks/1379270305272299530/EdXC7ENWy6IzQiR1-ETKyeyitOmG_It2088qG3SROttMnLqzvp6YV879Wqs-WwIYa4yk";

  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: "✅ Netlify function is running!" }),
    });

    return {
      statusCode: 200,
      body: 'Success',
    };
  } catch (err) {
    console.error("Webhook send failed", err);
    return {
      statusCode: 500,
      body: 'Fail',
    };
  }
};
