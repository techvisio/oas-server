var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counterModel = require('../providers/sequenceProvider.js');

var User = new Schema({
    userId: Number,
    clientCode: String,
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    mobileNo: String,
    emailId: String,
    creationDate: Date,
    createdBy: String,
    updateDate: Date,
    updatedBy: String,
    role: String,
    isActive: Boolean,
    priviledges: [String],
    securityQuestion: { question: String, answer: String }
});

User.pre('save', function (next) {
    var doc = this;
    counterModel.findByIdAndUpdate({ _id: 'user' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error) {
            return next(error);
        }
        if (!counter) {
            counterModel.create({ _id: 'user', seq: 2 });
            counter = { seq: 1 };
        }

        doc.userName = doc.userName.toLowerCase();
        doc.userId = counter.seq;
        next();
    });
});

module.exports = mongoose.model('user', User);