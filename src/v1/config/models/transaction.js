module.exports = {
  title: { minLength: 1, maxLength: 512 },
  // First status should be `incomplete`
  statuses: ["incomplete", "complete"],
  amount: { min: 50, max: 200 * 1000 },
};
