function formatUptime(seconds) {
  const pad = (s) => (s < 10 ? "0" : "") + s;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

module.exports = { formatUptime };
