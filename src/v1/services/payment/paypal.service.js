const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", // or 'live'
  client_id: "<your_client_id>",
  client_secret: "<your_client_secret>",
});

module.exports.createPayment = async (amount) => {
  try {
    const payment = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      },
      transactions: [
        { amount: { total: amount, currency: "USD" }, description: "" },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(payment, (err, payment) => {
        if (err) reject(err);
        else resolve(payment);
      });
    });
  } catch (err) {
    throw err;
  }
};

module.exports.executePayment = async (paymentId, payerId) => {
  const paymentExecution = {
    payer_id: payerId,
  };

  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, paymentExecution, (err, payment) => {
      if (err) reject(err);
      else resolve(payment);
    });
  });
};

const tryPayment = () => {
  // Example usage:

  // create a payment of $10
  createPayment("10.00")
    .then((payment) => {
      // redirect user to PayPal for payment
      const redirectUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;
      console.log(`Redirecting to ${redirectUrl}`);
      // redirect to redirectUrl
      // ...
      // after user completes payment, PayPal redirects back to your site
      // with a paymentId and PayerID as query parameters in the return URL
      // use them to execute the payment
      const paymentId = req.query.paymentId;
      const payerId = req.query.PayerID;
      executePayment(paymentId, payerId)
        .then((payment) => {
          console.log("Payment executed successfully");
        })
        .catch((err) => {
          console.error(`Error executing payment: ${err}`);
        });
    })
    .catch((err) => {
      console.error(`Error creating payment: ${err}`);
    });
};
