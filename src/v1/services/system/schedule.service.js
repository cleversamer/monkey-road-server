const defualtCallback = () => {};

module.exports.scheduleDailyEvent = (callback = defualtCallback) => {
  try {
    setInterval(callback, 1000 * 60 * 60 * 24);
  } catch (err) {
    // TODO: write error to the DB
  }
};
