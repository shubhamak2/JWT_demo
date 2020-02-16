const helperMethods = {
  validateFields(username, password, users) {
    // username validation
    if (!(username && username.trim && username.trim()))
    {
      return {
        message: 'username is required field and should be \'string\' type',
        error: true
      }
    } 

    // password validation
    if (!(password && password.trim && password.trim()))
    {
      return {
        message: 'password is required field and should be \'string\' type',
        error: true
      };
    }

    // to check if user already exists
    const isUserAlreadyExist = users.find((userData) => userData.username.toLowerCase() == username.toLowerCase());
    if (isUserAlreadyExist) {
      return {
        message: 'Username already exist!!',
        error: true
      };
    }

    return {error: false};  
  }
};

module.exports = helperMethods;
