const Excel = require("exceljs");
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

    // Return file's path
    return filePath;
  } catch (err) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = errors.system.errorExportingExcel;
    throw new ApiError(statusCode, message);
  }
};

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
