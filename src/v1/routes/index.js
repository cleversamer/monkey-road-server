const router = require("express").Router();
const authRoute = require("./user/auth.route");
const usersRoute = require("./user/users.route");
const transactionsRoute = require("./user/transactions.route");
const brandsRoute = require("./car/brands.route");
const purchaseCarsRoute = require("./car/purchaseCars.route");
const rentCarsRoute = require("./car/rentCars.route");
const ordersRoute = require("./car/rentOrders.route");

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
    path: "/transactionsRoute",
    route: transactionsRoute,
  },
  {
    path: "/orders/rent",
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
