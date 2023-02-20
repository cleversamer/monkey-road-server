const { Transaction } = require("../../models/user/transaction.model");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const usersService = require("./users.service");
const excelService = require("../storage/excel.service");

//////////////////// Inner Services ////////////////////
module.exports.createTransaction = async (
  authorId,
  receiverId,
  orderId,
  title,
  amount
) => {
  try {
    const transaction = new Transaction({
      author: authorId,
      receiver: receiverId,
      order: orderId,
      title,
      amount,
    });

    await transaction.save();

    return transaction;
  } catch (err) {
    throw err;
  }
};

module.exports.deleteOrderTransaction = async (orderId) => {
  try {
    return await Transaction.deleteOne({ order: orderId });
  } catch (err) {
    throw err;
  }
};

module.exports.completeOrderTransaction = async (orderId) => {
  try {
    const transaction = await Transaction.findOne({ order: orderId });
    transaction.complete();
    await transaction.save();
    return transaction;
  } catch (err) {
    throw err;
  }
};

//////////////////// Common Services ////////////////////
module.exports.getMyTransactions = async (user, skip = 0) => {
  try {
    const transactions = await Transaction.aggregate([
      { $match: { author: user._id } },
      { $sort: { _id: -1 } },
      { $skip: parseInt(skip) },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $project: {
          _id: 1,
          author: 1,
          receiver: { $arrayElemAt: ["$receiver", 0] },
          receiver: {
            _id: 1,
            avatarURL: 1,
            name: 1,
            email: 1,
            phone: 1,
          },
          title: 1,
          status: 1,
          amount: 1,
          date: 1,
        },
      },
    ]);

    if (!transactions || !transactions.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.transaction.hasNoTransactions;
      throw new ApiError(statusCode, message);
    }

    return transactions;
  } catch (err) {
    throw err;
  }
};

module.exports.exportMyTransactionsToExcel = async (user) => {
  try {
    const transactions = await Transaction.aggregate([
      { $match: { author: user._id } },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $project: {
          _id: 1,
          author: 1,
          receiver: { $arrayElemAt: ["$receiver", 0] },
          receiver: {
            _id: 1,
            avatarURL: 1,
            name: 1,
            email: 1,
            phone: 1,
          },
          title: 1,
          status: 1,
          amount: 1,
          date: 1,
        },
      },
    ]);

    if (!transactions || !transactions.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.transaction.hasNoTransactions;
      throw new ApiError(statusCode, message);
    }

    const fileURL = await excelService.exportUserTransactionsToExcel(
      user,
      transactions
    );

    return fileURL;
  } catch (err) {
    throw err;
  }
};

//////////////////// Admin Services ////////////////////
module.exports.exportUserTransactionsToExcel = async (userId) => {
  try {
    // Check if user exists
    const user = await usersService.findUserById(userId);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    const transactions = await Transaction.aggregate([
      { $match: { author: user._id } },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $project: {
          _id: 1,
          author: 1,
          receiver: { $arrayElemAt: ["$receiver", 0] },
          receiver: {
            _id: 1,
            avatarURL: 1,
            name: 1,
            email: 1,
            phone: 1,
          },
          title: 1,
          status: 1,
          amount: 1,
          date: 1,
        },
      },
    ]);

    if (!transactions || !transactions.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.transaction.hasNoTransactions;
      throw new ApiError(statusCode, message);
    }

    const fileURL = await excelService.exportUserTransactionsToExcel(
      user,
      transactions
    );

    return fileURL;
  } catch (err) {
    throw err;
  }
};
