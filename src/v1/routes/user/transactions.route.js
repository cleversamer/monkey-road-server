const router = require("express").Router();
const { transactionsController } = require("../../controllers");
const { authValidator } = require("../../middleware/validation");

//////////////////// Common Routes ////////////////////
router.get("/my", transactionsController.getMyTransactions);

router.get("/my/export", transactionsController.exportMyTransactionsToExcel);

//////////////////// Admin Routes ////////////////////
router.get(
  "/:userId/export",
  transactionsController.exportUserTransactionsToExcel
);

module.exports = router;
