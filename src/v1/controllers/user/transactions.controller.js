const { transactionsService } = require("../../services");
const httpStatus = require("http-status");
const { CLIENT_SCHEMA } = require("../../models/user/transaction.model");
const _ = require("lodash");

//////////////////// Common Controllers ////////////////////
module.exports.getMyTransactions = async (req, res, next) => {
  try {
    const user = req.user;
    const { page, limit } = req.query;

    const { currentPage, totalPages, transactions } =
      await transactionsService.getMyTransactions(user, page, limit);

    const response = {
      currentPage,
      totalPages,
      transactions: transactions.map((t) => _.pick(t, CLIENT_SCHEMA)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.exportMyTransactionsToExcel = async (req, res, next) => {
  try {
    const user = req.user;

    const fileURL = await transactionsService.exportMyTransactionsToExcel(user);

    const response = {
      type: "file/xlsx",
      path: fileURL,
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

//////////////////// Admin Controllers ////////////////////
module.exports.getUserTransactions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const { currentPage, totalPages, transactions } =
      await transactionsService.getUserTransactions(userId, page, limit);

    const response = {
      currentPage,
      totalPages,
      transactions: transactions.map((t) => _.pick(t, CLIENT_SCHEMA)),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.exportUserTransactionsToExcel = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const fileURL = await transactionsService.exportUserTransactionsToExcel(
      userId
    );

    const response = {
      type: "file/xlsx",
      path: fileURL,
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};
