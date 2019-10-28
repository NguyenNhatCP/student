const ramdom_id = function() {
    var getYear = new Date().getFullYear().toString().substr(2,2);
    var getStudent = Math.floor(Math.random() * 90000)+ 10000;
    var getSchool = 115;
    var Sid = getYear + getSchool + getStudent;
    return Sid;
}
module.exports = ramdom_id;