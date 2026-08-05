const axios = require("axios");
const FormData = require("form-data");

const meta = {
  name: "Catbox Upload API",
  version: "1.0.0",
  description: "Upload files to Catbox using URL",
  author: "Jubayer",
  method: "get",
  category: "utility",
  path: "/catbox"
};

async function onStart({ req, res }) {
  const fileUrl = req.query.url;
  if (!fileUrl) {
    return res.status(400).json({ error: "Please provide ?url=" });
  }

  try {
    const form = new FormData();
    form.append("reqtype", "urlupload");
    form.append("url", fileUrl);

    const catboxRes = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    res.json({
      status: "success",
      original: fileUrl,
      catbox: catboxRes.data
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Upload failed" });
  }
}

module.exports = { meta, onStart };
