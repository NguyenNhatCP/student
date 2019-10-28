const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    Sid: { type: Number, unique: true, required: true},
    Slname: { type: String, required: true, trim: true, max: 20 },
    Sfname: { type: String, required: true, trim: true, max: 10 },
    Sgender: { type: String, enum: ['Nam', 'Nữ'] },
    Sbirthday: { type: Date, required: true},
    Sbirthplace: { type: String },
    Strain: { type: String },
    Savatar: {type: String},
    Fid: { type: String },
    Syear: { type: String },
    Cid: { type: String },
    Password: { type: String, required: true, minlength: 6 },
    Permission: { type: String, enum: ['admin', 'student'] },
    Status: { type: Number, default: 1 }, //0 nghĩ học
    Transcript: [{ type: Schema.Types.ObjectId, ref: "Transcript" }],
    Faculty: [{ type: Schema.Types.ObjectId, ref: "Faculty" }],
});
studentSchema.virtual('fullName').get(function() {
    var fullName = this.Sfname + ' ' + this.Slname;
    return fullName;
})
//Create model user
const Student = mongoose.model('Student', studentSchema);
//init to using model 
module.exports = Student;