module.exports = {
  statuses: ["pending", "approved", "rejected", "closed"],
  noOfDays: { min: 3, max: 365 },
  locationTitle: { minLength: 1, maxLength: 1024 },
  longitude: { min: -180, max: 180 },
  latitude: { min: -90, max: 90 },
  fullName: { minLength: 3, maxLength: 128 },
};
