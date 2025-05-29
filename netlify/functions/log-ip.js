exports.handler = async (event) => {
  const webhookURL = "https://discord.com/api/webhooks/1347303016960888862/tJhE5rbEck2YenBeyPQmP-8x60moVrX-4Xb7UTl6SSV0OT8A8HxbNKpUnWOU6Njf6qtQ"; // Replace this

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    "Unknown IP";

  const userAgent = event.headers["user-agent"] || "Unknown";
  const time = new Date().toISOString();

  const ipMessage = { content: ip };
  const infoMessage = {
    content: `User Agent: ${userAgent}\nTime: ${time}`,
  };

  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ipMessage),
    });

    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infoMessage),
    });

    return {
      statusCode: 200,
      body: "IP logged successfully!",
    };
  } catch (err) {
    console.error("Error sending to Discord:", err);
    return {
      statusCode: 500,
      body: "Failed to send webhook.",
    };
  }
};
