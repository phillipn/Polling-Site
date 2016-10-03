var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = new Schema({
      github: {
        id: String,
        displayName: String,
        username: String,
        publicRepos: Number
      }
    });

module.exports = mongoose.model('User', User);