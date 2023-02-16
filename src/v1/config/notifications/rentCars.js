class Notificatin {
  constructor(title, body, data = {}) {
    this.title = title;
    this.body = body;
    this.data = data;
  }
}

module.exports = {
  postAdded: new Notificatin(
    "طلب نشر سيّارة للإيجار",
    "يوجد هناك طلب نشر سيّارة للإيجار جديد تفحّصه"
  ),
  postRejected: new Notificatin("طلب نشر سيّارة للإيجار", "تم رفض طلبك"),
  postAccepted: new Notificatin("طلب نشر سيّارة للإيجار", "تم قبول طلبك"),
};
