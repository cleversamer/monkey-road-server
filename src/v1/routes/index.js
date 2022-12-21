const router = require("express").Router();
const authRoute = require("./user/auth.route");
const usersRoute = require("./user/users.route");
const ordersRoute = require("./user/orders.route");
const brandsRoute = require("./car/brands.route");
const purchaseCarsRoute = require("./car/purchaseCars.route");
const rentCarsRoute = require("./car/rentCars.route");

const routes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: usersRoute,
  },
  {
    path: "/orders",
    route: ordersRoute,
  },
  {
    path: "/brands",
    route: brandsRoute,
  },
  {
    path: "/cars/purchase",
    route: purchaseCarsRoute,
  },
  {
    path: "/cars/rent",
    route: rentCarsRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
