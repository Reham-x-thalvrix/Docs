const cacheStore = new Map();

function setCache(key, value, ttlMs = 60000) {
  cacheStore.set(key, { value, expire: Date.now() + ttlMs });
}

function getCache(key) {
  const data = cacheStore.get(key);
  if (!data) return null;
  if (Date.now() > data.expire) {
    cacheStore.delete(key);
    return null;
  }
  return data.value;
}

module.exports = { setCache, getCache };
