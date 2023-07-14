const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  name: { type: String, required: true},
  body: {type: String},
  masterjudgeId: {type: Number, required : true},
  typeId : {type: Number, required: true},
  interactive: {type: Boolean, default: false},
  problemId : {type: Number}
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
