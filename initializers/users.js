// initializers/users.js
var crypto = require('crypto');
var salt = "asdjkafhjewiovnjksdv" // in production, you will want to change this, and probably have a unique salt for each user.

exports.users = function(api, next){
  var redis = api.redis.client;
  api.users = {

    // constants
    usersHash: "users",
    separator: ":",

    // methods

    add: function(userName, password, email, roomNumber, fullName, bio, company, cellPhone, next){
      var self = this;
      var key = this.buildUserKey(userName);
      redis.hget(self.usersHash, userName, function(error, data){
        if(error != null){
          next(error);
        }else if(data != null){
          next("userName already exists");
        }else{
          self.cryptPassword(password, function(error, hashedPassword){
            if(error != null){
              next(error);
            }else{
              var data = {
                userName: userName,
                fullName: fullName,
                email: email,
                cellPhone: cellPhone,
                company: company,
                bio: bio,
                roomNumber: roomNumber,
                hashedPassword: hashedPassword,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
              }
              redis.hmset(key, data, function(error){
                next(error);
              });
            }
          });
        }
      });
    },
    
    view: function(userName, next){
      var key = this.buildUserKey(userName);
      redis.hgetall(key, function(error, data){
        next(error, data);
      });
    },

    list: function(next){
      var sys = require('sys');
      var self = this;
      var search = self.usersHash + self.separator;
      redis.keys(search+"*", function(error, keys){
        var users = [];
        var started = 0;
        keys.forEach(function(key){
          var parts = key.split(self.separator)
          var k = parts[(parts.length - 2)];
          users.push(k);
        });
        users.sort();
        next(error, users);
      });
    },

    authenticate: function(userName, password, next){
      var self = this;
      redis.hget(self.usersHash, userName, function(error, data){
        if(error != null){
          next(error);
        }else{
          data = JSON.parse(data);
          self.comparePassword(data.hashedPassword, password, function(error, match){
            next(error, match);
          });
        }
      });
    },

    delete: function(userName, password, next){
      var self = this;
      redis.del(self.usersHash, userName, function(error){
        api.users.list(function(error){
          next(error);
        });
      });
    },

    // helpers

    cryptPassword: function(password, next) {
       var hash = crypto.createHash('md5').update(salt + password).digest("hex");
       next(null, hash);
    },

    comparePassword: function(hashedPassword, userPassword, next) {
       var hash = crypto.createHash('md5').update(salt + userPassword).digest("hex");
       var matched = (hash === hashedPassword);
       next(null, matched)
    },
    
    buildUserKey: function(userName){
      return this.usersHash + this.separator + userName + this.separator // "users:elvis: first user"
    },
  }

  next();
}