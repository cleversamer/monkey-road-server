const router = require("express").Router();
const { pricesController } = require("../../controllers");
const { priceValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// Common Routes ////////////////////
router.get(
  "/price/:couponCode",
  priceValidator.getCouponPricesValidator,
  auth("readAny", "price"),
  pricesController.getCouponPrices
);

//////////////////// Admin Routes ////////////////////
router.post(
  "/price/add",
  priceValidator.addPriceValidator,
  auth("createAny", "price"),
  pricesController.addPrice
);

module.exports = router;
