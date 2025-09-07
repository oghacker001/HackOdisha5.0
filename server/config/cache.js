const cache = {};
export const getCache = (key) => cache[key];
export const setCache = (key, value, duration = 3600000) => {
  cache[key] = value;
  setTimeout(() => { delete cache[key]; }, duration);
};