const router = require("express").Router();
const { brandsController } = require("../../controllers");
const { authValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// User Routes ////////////////////
router.get("/popular", brandsController.getPopularBrands);

module.exports = router;
