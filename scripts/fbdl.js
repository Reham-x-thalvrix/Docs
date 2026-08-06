const axios = require("axios");

module.exports = {
  meta: {
    name: "Facebook Downloader",
    version: "1.0.0",
    description: "Download Facebook public videos in HD/SD quality.",
    author: "Jubayer",
    method: "get",
    path: "/fbdl",
    category: "downloader"
  },
  onStart: async function({ req, res }) {
    const fbUrl = req.query.url || req.query.prompt;

    if (!fbUrl) {
      return res.status(400).json({ status: false, error: "Facebook URL is required" });
    }

    try {
      const { data } = await axios.post(
        "https://getmyfb.com/process",
        new URLSearchParams({ id: fbUrl, locale: "en" }).toString(),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
          }
        }
      );

      const hdMatch = data.match(/href="(https:\/\/[^"]+sd=1[^"]+)"/);
      const sdMatch = data.match(/href="(https:\/\/[^"]+hd=1[^"]+)"/);

      res.json({
        status: true,
        hd: hdMatch ? hdMatch[1].replace(/&amp;/g, "&") : null,
        sd: sdMatch ? sdMatch[1].replace(/&amp;/g, "&") : null
      });
    } catch (error) {
      res.status(500).json({ status: false, error: "Failed to download Facebook video", message: error.message });
    }
  }
};
