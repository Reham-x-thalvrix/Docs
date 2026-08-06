const axios = require("axios");

module.exports = {
  meta: {
    name: "Facebook Downloader",
    version: "1.0.1",
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
      const response = await axios.post(
        "https://snapsave.app/action.php",
        new URLSearchParams({ url: fbUrl }).toString(),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://snapsave.app",
            "referer": "https://snapsave.app/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        }
      );

      const htmlData = response.data;

      // Extract video download URLs using match regex
      const hdMatch = htmlData.match(/href=\\"(https:\/\/video[^\"]+)\\"[^>]*>HD<\/a>/i) || htmlData.match(/https:\/\/[^\s"]+sd_src_no_ratelimit[^\s"]+/i);
      const sdMatch = htmlData.match(/href=\\"(https:\/\/video[^\"]+)\\"[^>]*>SD<\/a>/i) || htmlData.match(/https:\/\/[^\s"]+hd_src_no_ratelimit[^\s"]+/i);

      // Generic URL Fallback matcher
      const allUrls = htmlData.match(/https?:\/\/[^\s"',]+\.(mp4|m3u8)[^\s"',]*/gi) || [];

      const hdUrl = hdMatch ? hdMatch[1] || hdMatch[0] : (allUrls[0] || null);
      const sdUrl = sdMatch ? sdMatch[1] || sdMatch[0] : (allUrls[1] || allUrls[0] || null);

      if (!hdUrl && !sdUrl) {
        return res.status(404).json({
          status: false,
          error: "Could not extract video links. Make sure the video is public."
        });
      }

      res.json({
        status: true,
        hd: hdUrl ? hdUrl.replace(/\\/g, '') : null,
        sd: sdUrl ? sdUrl.replace(/\\/g, '') : null
      });

    } catch (error) {
      console.error('Error in FB DL API:', error);
      res.status(500).json({ status: false, error: "Failed to process Facebook URL", message: error.message });
    }
  }
};
