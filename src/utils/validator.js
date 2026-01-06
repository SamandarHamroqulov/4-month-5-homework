const regEmail = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
const regPassword = /^(?=.*[A-Z])(?=.*\d).{4,}$/;

function regexEmail(email) {
  return regEmail.test(email);
}

function regexPassword(password) {
  return regPassword.test(password);
}

module.exports = { regexEmail, regexPassword };
