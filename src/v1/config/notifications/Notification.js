module.exports = class Notificatin {
  constructor(title = "", body = "", photoURL = "") {
    this.title = title;
    this.body = body;
    this.photoURL = photoURL;
    this.seen = false;
    this.date = new Date().toISOString();
  }
};
