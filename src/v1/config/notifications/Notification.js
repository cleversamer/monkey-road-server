module.exports = class Notificatin {
  constructor(title = "", body = "", data = {}, photoURL = "") {
    this.title = title;
    this.body = body;
    this.data = data;
    this.photoURL = photoURL;
    this.seen = false;
    this.date = new Date().toString();
  }
};
