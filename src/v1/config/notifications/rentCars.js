class Notificatin {
  constructor(title, body, data = {}) {
    this.title = title;
    this.body = body;
    this.data = data;
  }
}

module.exports = {
  postRejected: new Notificatin("طلب نشر سيّارة للإيجار", "تم رفض طلبك"),
  postAccepted: new Notificatin("طلب نشر سيّارة للإيجار", "تم قبول طلبك"),
};
