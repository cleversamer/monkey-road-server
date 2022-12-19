const router = require("express").Router();
const { brandsController } = require("../../controllers");
const { authValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

//////////////////// User Routes ////////////////////
// TODO:
router.get("/popular", brandsController.getPopularBrands);

module.exports = router;
