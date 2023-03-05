const router = require("express").Router();
const { transactionsController } = require("../../controllers");
const { transactionValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// Common Routes ////////////////////
router.get(
  "/my",
  transactionValidator.getMyTransactionsValidator,
  auth("readOwn", "transaction"),
  transactionsController.getMyTransactions
);

router.get(
  "/my/export",
  auth("readOwn", "transaction"),
  transactionsController.exportMyTransactionsToExcel
);

//////////////////// Admin Routes ////////////////////
router.get(
  "/:userId",
  transactionValidator.exportUserTransactionsToExcelValidator,
  auth("readAny", "transaction"),
  transactionsController.exportUserTransactionsToExcel
);

router.get(
  "/:userId/export",
  transactionValidator.exportUserTransactionsToExcelValidator,
  auth("readAny", "transaction"),
  transactionsController.exportUserTransactionsToExcel
);

module.exports = router;
