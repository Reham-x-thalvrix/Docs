function validateQueryParams(req, requiredParams = []) {
  const missing = [];
  for (const param of requiredParams) {
    if (!req.query[param]) missing.push(param);
  }
  return missing;
}

module.exports = { validateQueryParams };
