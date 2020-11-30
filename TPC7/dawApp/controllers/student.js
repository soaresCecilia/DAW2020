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

module.exports.insert = fields => {
    var res = fields.tpc.split(",");
    var tpcNumber = [];

    for(var i= 0; i < 8; i++){
        if(res[i] == null || res[i] != '1' || res[i] != '0')
            tpcNumber.push(0)
        else 
            tpcNumber.push(parseInt(res[i]))
    }

    var newStudent = new Student({ 
        numero: fields['numero'],
        nome: fields['nome'],
        git: fields['git'],
        tpc: tpcNumber
    })
    
    return newStudent
        .save()
}



module.exports.delete = id => {
    return Student
        .findOneAndDelete({numero: id})
        .exec()
}


module.exports.update = (id, fields) =>{
    var res = fields.tpc.split(",");
    var tpcNumber = [];

    for(var i= 0; i < 8; i++){
        if(res[i] == null || res[i] != '1' || res[i] != '0')
            tpcNumber.push(0)
        else 
            tpcNumber.push(parseInt(res[i]))
    }

    return Student
        .findOneAndUpdate({numero: id}, {
            $set: {
                numero: fields['numero'],
                nome: fields['nome'],
                git: fields['git'],
                tpc: tpcNumber      
            }
        })
        .exec()
}

module.exports.consult = (id, callback) => {
       Student
        .findOne({numero: id})
        .exec()
        .then(data => callback(null, data))
}