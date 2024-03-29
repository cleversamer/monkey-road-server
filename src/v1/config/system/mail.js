const Mailgen = require("mailgen");

const auth = {
  user: "monkeyroad.uaedubai@gmail.com",
  password: process.env["EMAIL_PRIVATE_KEY"],
  emailURL: "http://192.168.1.235:4000/",
  siteDomains: {
    verifyEmail: "http://192.168.1.235:4000/api/users/verify-email/",
  },
};

const types = {
  register: {
    subject: {
      en: "Welcome to Monkey Road Car",
      ar: "أهلًا بك في Monkey Road Car",
    },
    emailBody: {
      title: {
        en: (user) => `<br />
        <center text-align="right">
          This is your email verification code which is valid for 10 minutes:
          <br /> 
          ${user.verification.email.code}
          </center>
         <br />`,

        ar: (user) => `<br />
         <center text-align="right">
           هذا هو الكود الخاص بتفعيل بريدك الإلكتروني صالح لمدة 10 دقائق:
           <br /> 
           ${user.verification.email.code}
           </center>
          <br />`,
      },
      greeting: {
        en: "Dear",
        ar: "عزيزي",
      },
    },
  },

  forgotPassword: {
    subject: {
      en: "Forgot my password",
      ar: "نسيت كلمة المرور الخاصة بي",
    },
    emailBody: {
      title: {
        en: (user) => `<br />
        <center text-align="right">
          This is your reset password code which is valid for 10 minutes:
          <br /> 
          ${user.verification.password.code}
          </center>
         <br />`,

        ar: (user) => `<br />
        <center text-align="right">
          هذا هو الكود الخاص باستعادة كلمة المرور صالح لمدة 10 دقائق:
          <br /> 
          ${user.verification.password.code}
          </center>
         <br />`,
      },
      greeting: {
        en: "Dear",
        ar: "عزيزي",
      },
    },
  },

  changeEmail: {
    subject: {
      en: "Change your email",
      ar: "تغيير بريدك الإلكتروني",
    },
    emailBody: {
      title: {
        en: (user) => `<br />
        <center text-align="right">
          This is your new email verification code which is valid for 10 minutes:
          <br /> 
          ${user.verification.email.code}
          </center>
         <br />`,

        ar: (user) => `<br />
         <center text-align="right">
           هذا هو الكود الخاص بتفعيل بريدك الإلكتروني الجديد صالح لمدة 10 دقائق:
           <br /> 
           ${user.verification.email.code}
           </center>
          <br />`,
      },
      greeting: {
        en: "Dear",
        ar: "عزيزي",
      },
    },
  },
};

const getMailGenerator = (lang = "ar") => {
  try {
    const en = {
      theme: "default",
      product: {
        name: "Monkey Road Car",
        link: "#",
        copyright: "© 2023 Monkey Road Car.",
      },
    };

    const ar = {
      theme: "default",
      product: {
        name: "Monkey Road Car",
        link: "#",
        copyright: "© 2023 Monkey Road Car.",
      },
    };

    switch (lang.toLowerCase()) {
      case "en":
        return new Mailgen(en);

      case "ar":
        return new Mailgen(ar);

      default:
        return new Mailgen(ar);
    }
  } catch (err) {
    throw err;
  }
};

const getEmailBody = (mailGenerator, title, greeting, user) => {
  try {
    return mailGenerator.generate({
      body: {
        title,
        greeting,
        signature: user.name,
      },
    });
  } catch (err) {
    throw err;
  }
};

const getMessage = (email, html, subject) => ({
  from: "Monkey Road Car",
  to: email,
  html,
  subject,
});

module.exports = {
  auth,
  getMailGenerator,
  getEmailBody,
  getMessage,
  types,
};
