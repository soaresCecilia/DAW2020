var express = require('express')
var bodyParser = require('body-Parser')
var templates = require('./html-templates') 
var jsonfile = require('jsonfile')
var logger = require('morgan')
var multer = require('multer')
const { json } = require('body-Parser')
var fs = require('fs')

var upload = multer({dest: 'uploads/'})

var app = express()


app.use(logger('dev'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

//recursos estáticos
app.use(express.static('public'))


app.get('/', function(req,res){
    var d = new Date().toISOString().substr(0,16)
    
    var files = jsonfile.readFileSync('./dbFiles.json')
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileList(files,d))
    res.end()
})

app.get('/files/download/:fname', (req, res) => {
    res.download(__dirname + '/public/fileStore/' + req.params.fname)
})

app.get('/files/upload', function(req,res){
    var d = new Date().toISOString().substr(0,16)
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileForm(d))
    res.end()
})


app.post('/files', upload.array('myFile'), function(req, res){
    var i = 0;

    for(i = 0; i < req.files.length; i++) {

        console.dir("Tamanho do req.files: " + req.files.length)
        let oldPath = __dirname + '/' + req.files[i].path
        let newPath = __dirname + '/public/fileStore/' + req.files[i].originalname

        var request = req.files[i]
      
        fs.rename(oldPath, newPath, function(err) {
            if(err) throw err

        })

            
                
        //actualizar a BD
        var files = jsonfile.readFileSync('./dbFiles.json')
        var d = new Date().toISOString().substr(0,16)
        //registo da meta-info
        files.push(
            {
                date: d,
                name: request.originalname,
                size: request.size,
                mimetype: request.mimetype,
                desc: req.body.desc
                }
            )
        jsonfile.writeFileSync('./dbFiles.json', files)
    }
        
    //redirecciona para a página principal
    res.redirect('/')

})




app.listen(7702, () => console.log('Servidor à escuta na porta 7702...'))
