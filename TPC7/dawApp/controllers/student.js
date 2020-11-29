// Student controller

var Student = require('../models/student')

// Returns student list
module.exports.list = () => {
    return Student
        .find()
        .sort({nome:1})
        .exec()
}

module.exports.lookUp = id => {
    return Student
        .findOne({numero: id})
        .exec()
}

module.exports.insert = student => {
    var newStudent = new Student(student)
    return newStudent.save()
}

module.exports.delete = id => {
    return Student
        .findOneAndDelete({numero: id})
        .exec()
}


module.exports.update = (id, campos) =>{
    return Student
        .findOneAndUpdate({numero: id}, {
            $set: {
                numero: campos['numero'],
                nome: campos['nome'],
                git: campos['git'],
                tpc: campos['tpc']       
            }
        })
        .exec()
}
