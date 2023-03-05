const AccessControl = require("accesscontrol");
const user = require("./user");
const office = require("./office");
const secretary = require("./secretary");
const admin = require("./admin");

const roles = new AccessControl({
  user,
  office,
  secretary,
  admin,
});

module.exports = roles;
