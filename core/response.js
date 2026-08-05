function sendSuccess(res, data, meta = {}) {
  return res.status(200).json({
    status: true,
    meta,
    data
  });
}

function sendError(res, message, code = 400) {
  return res.status(code).json({
    status: false,
    error: message
  });
}

module.exports = { sendSuccess, sendError };
