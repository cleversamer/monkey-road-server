const AccessControl = require("accesscontrol");
const user = require("./user");
const office = require("./office");
const admin = require("./admin");

const roles = new AccessControl({
  user,
  office,
  admin,
});

module.exports = roles;
