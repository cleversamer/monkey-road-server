module.exports = class Notificatin {
  constructor(title = "", body = "", data = {}) {
    this.title = title;
    this.body = body;
    this.data = data;
  }
};
