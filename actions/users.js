exports.userAdd = {
  name: "userAdd",
  description: "I add a user",
  inputs: {
    required: ["userName", "password", "email", "roomNumber", "fullName"],
    optional: ["bio", "company", "cellPhone"],
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.users.add(connection.params.userName, 
                  connection.params.password, 
                  connection.params.email, 
                  connection.params.roomNumber, 
                  connection.params.fullName, 
                  connection.params.bio,
                  connection.params.company,
                  connection.params.cellPhone,
                  function(error){
      connection.error = error;
      next(connection, true);
    });
  }
};

exports.userView = {
  name: "userView",
  description: "Show an user",
  inputs: {
    required: ["userName"],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.users.view(connection.params.userName, function(error, user){
      connection.error = error;
      connection.response.user = user;
      next(connection, true);
    });
  }
};

exports.userDelete = {
  name: "userDelete",
  description: "I delete a user",
  inputs: {
    required: ["userName", "password"],
    optional: [],
  },
  authenticated: true,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.users.delete(connection.params.userName, connection.params.password, function(error){
      connection.error = error;
      next(connection, true);
    });
  }
};

exports.usersList = {
  name: "usersList",
  description: "I list all the users",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.users.list(function(error, users){
      connection.error = error;
      connection.response.users = [];
      for(var i in users){
        connection.response.users.push(users[i])
      }
      next(connection, true);
    });
  }
};

exports.authenticate = {
  name: "authenticate",
  description: "I authenticate a user",
  inputs: {
    required: ["userName", "password"],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.users.authenticate(connection.params.userName, connection.params.password, function(error, match){
      connection.error = error;
      connection.response.authenticated = match;
      next(connection, true);
    });
  }
};