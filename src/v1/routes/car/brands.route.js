const router = require("express").Router();
const { brandsController } = require("../../controllers");
const { brandValidator } = require("../../middleware/validation");

//////////////////// Common Routes ////////////////////
router.get(
  "/popular",
  brandValidator.getPopularBrandsValidator,
  brandsController.getPopularBrands
);

module.exports = router;
