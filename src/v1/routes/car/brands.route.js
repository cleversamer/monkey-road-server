const router = require("express").Router();
const { brandsController } = require("../../controllers");

//////////////////// User Routes ////////////////////
router.get("/popular", brandsController.getPopularBrands);

module.exports = router;
