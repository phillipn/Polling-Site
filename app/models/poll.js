var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Poll = new Schema(
      { question:String, author: String, voters: [String], options:[ {choice:String, votes:Number} ] },
      { versionKey: false }
    );

module.exports = mongoose.model('Poll', Poll);