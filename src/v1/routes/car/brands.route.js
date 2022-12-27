const router = require("express").Router();
const { brandsController } = require("../../controllers");
const { brandValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// Common Routes ////////////////////
router.get(
  "/popular",
  brandValidator.getPopularBrandsValidator,
  brandsController.getPopularBrands
);

router.post(
  "/add",
  brandValidator.addBrandValidator,
  auth("createAny", "brand"),
  brandsController.addBrand
);

module.exports = router;
