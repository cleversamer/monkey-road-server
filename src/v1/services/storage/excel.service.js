const Excel = require("exceljs");
const localStorage = require("./localStorage.service");
const cloudStorage = require("../cloud/cloudStorage.service");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const { ApiError } = require("../../middleware/apiError");

module.exports.exportUsersToExcelFile = async (users = []) => {
  try {
    // Create a new Excel Workbook
    let workbook = new Excel.Workbook();
    // Add new sheet to the Workbook
    let worksheet = workbook.addWorksheet("Monkey Road Users");

    // Specify excel sheet's columns
    worksheet.addRow([
      "الإسم الكامل",
      "البريد الإلكتروني",
      "رقم الهاتف",
      "نوع المستخدم",
      "البريد مفعّل",
      "رقم الهاتف مفعّل",
      "عدد السيّارات المفضّلة",
      "عدد الإشعارات",
      "عدد الإشعارات المقروءة",
      "عدد الإشعارات الغير مقروءة",
      "سيّارات البيع",
      "سيّارات الإيجار",
      "سيّارات الإيجار النشطة",
      "سيّارات الإيجار المعلّقة",
      "عدد الطلبات المستلمة",
      "عدد الطلبات المنشأة",
      "عدد الطلبات المنشأة قيد الإنتظار",
      "عدد الطلبات المنشأة المقبولة",
      "عدد الطلبات المنشأة المرفوضة",
      "عدد الطلبات المنشأة المغلقة",
      "مسجّل بواسطة",
      "يملك كلمة مرور",
      "رابط الصورة الشخصيّة",
      "آخر دخول",
    ]);

    // Add row for each user in the Database
    users.forEach(function (user) {
      const seenNotifications = user.notifications.filter((n) => n.seen).length;
      const unseenNotifications = user.notifications.filter(
        (n) => !n.seen
      ).length;
      const role =
        user.role === "user"
          ? "مستخدم"
          : user.role === "office"
          ? "مكتب تأجير"
          : "آدمن";

      worksheet.addRow([
        user.name,
        user.email,
        user.phone.full,
        role,
        user.verified.email ? "نعم" : "لا",
        user.verified.phone ? "نعم" : "لا",
        user.favorites.length,
        user.notifications.length,
        seenNotifications,
        unseenNotifications,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        user.authType,
        user.password ? "نعم" : "لا",
        user.avatarURL,
        user.lastLogin,
      ]);
    }, "i");

    // Decide excel's file
    const fileName =
      filterName(`monkey_road_users_${getCurrentDate()}`) + ".xlsx";
    const filePath = `/${fileName}`;

    // Generate and save excel file
    await workbook.xlsx.writeFile(`./uploads/${fileName}`);

    // Upload excel file to storage bucket
    const cloudFile = await cloudStorage.uploadFile({
      name: fileName,
      path: filePath,
    });

    // Delete local excel file
    await localStorage.deleteFile(filePath);

    // Return file's path
    return cloudFile;
  } catch (err) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = errors.system.errorExportingExcel;
    throw new ApiError(statusCode, message);
  }
};

module.exports.exportUserTransactionsToExcel = async (user, transactions) => {
  try {
    // Create a new Excel Workbook
    let workbook = new Excel.Workbook();
    // Add new sheet to the Workbook
    const worksheetName =
      user.favLang === "en"
        ? `${user.name}'s Transactions Report`
        : `سجل المعاملات الماليّة ${user.name}`;
    let worksheet = workbook.addWorksheet(worksheetName);

    // Specify excel sheet's columns
    worksheet.addRow([
      user.favLang === "en" ? "Title" : "العنوان",
      user.favLang === "en" ? "Office Name" : "مكتب التأجير",
      user.favLang === "en" ? "Status" : "الحالة",
      user.favLang === "en" ? "Amount" : "المبلغ",
      user.favLang === "en" ? "Date" : "التاريخ",
    ]);

    // Add row for each user in the Database
    transactions.forEach(function (transaction) {
      const { receiver, title, status, amount, date } = transaction;
      const receiverName = receiver[0].name;
      const viewStatus =
        status === "complete"
          ? { en: "complete", ar: "مكتملة" }
          : { en: "incomplete", ar: "غير مكتملة" };
      let viewDate = new Date(date);
      const day = viewDate.getDay();
      const month = viewDate.getMonth();
      const year = viewDate.getFullYear();
      viewDate = `${day}-${month}-${year}`;

      worksheet.addRow([
        title[user.favLang],
        receiverName,
        viewStatus[user.favLang],
        amount,
        viewDate,
      ]);
    }, "i");

    // Decide excel's file
    const userName = user.name.toLowerCase().split(" ").join("_");
    const fileName = filterName(`${userName}_${getCurrentDate()}`) + ".xlsx";
    const filePath = `/${fileName}`;

    // Generate and save excel file
    await workbook.xlsx.writeFile(`./uploads/${fileName}`);

    // Upload excel file to storage bucket
    const cloudFile = await cloudStorage.uploadFile({
      name: fileName,
      path: filePath,
    });

    // Delete local excel file
    await localStorage.deleteFile(filePath);

    // Return file's path
    return cloudFile;
  } catch (err) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = errors.system.errorExportingExcel;
    throw new ApiError(statusCode, message);
  }
};

//////////////////// HELPER FUNCTIONS ////////////////////
const filterName = (name = "") => {
  return name.split(" ").join("_").split(":").join("_");
};

const getCurrentDate = () => {
  let strDate = new Date().toLocaleString();
  strDate = strDate.split(", ");
  let part1 = strDate[0];

  let date = `${part1}`;
  date = date.split("/").join("-");
  return date;
};
