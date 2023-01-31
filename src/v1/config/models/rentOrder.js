module.exports = {
  // First status should be always pending
  statuses: ["pending", "approved", "rejected", "closed"],
  noOfDays: { min: 3, max: 365 },
  locationTitle: { minLength: 1, maxLength: 1024 },
  fullName: { minLength: 3, maxLength: 128 },
};
