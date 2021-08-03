export const timeSince = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.round(seconds / 31536000);
  const returnValue = (interval, time) => {
    return Math.floor(interval) + ` ${time}${interval === 1 ? "" : "s"} ago`;
  };
  if (interval >= 1) {
    return returnValue(interval, "year");
  }
  interval = Math.round(seconds / 2592000);
  if (interval >= 1) {
    return returnValue(Math.round(interval), "month");
  }
  interval = Math.round(seconds / 86400);
  if (interval >= 1) {
    return returnValue(Math.round(interval), "day");
  }
  interval = Math.round(seconds / 3600);
  if (interval >= 1) {
    return returnValue(Math.round(interval), "hour");
  }
  interval = Math.round(seconds / 60);
  if (interval >= 1) {
    return returnValue(Math.round(interval), "minute");
  }
  return returnValue(Math.round(seconds), "second");
};