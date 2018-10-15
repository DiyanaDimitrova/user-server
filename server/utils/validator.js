module.exports = {
  isValidEmail: email => {
    const regExp = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
    return regExp.test(email);
  },
  isValidName: name => {
    const regExp = /^[a-zA-Z ]{2,30}$/;
    return regExp.test(name);
  }
};
