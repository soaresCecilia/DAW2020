var http = require('http')
var axios = require('axios');

var myMapInst = new Map();
var myMapCurso = new Map();
var i = 1;


//preenche duas hashmaps: uma com o id do instrumento e o seu nome e outra com o id do curso e o seu nome
myFillMap = function () {
    axios.get('http://localhost:3001/cursos')
    .then(function(resp) {
        cursos = resp.data;
        cursos.forEach(a => {
            var inst = a.designacao.split(" ");
            var instrum = inst[inst.length-1]
            myMapInst.set(a.instrumento.id, instrum)
            myMapCurso.set(a.id, a.designacao)
            console.log("O que está no myMapInst: " + myMapInst.get(a.instrumento.id))
            console.log("O que está no myMapCurso: " + myMapCurso.get(a.id))

            i = 0;
         })

    }).catch(function (error)  {
        console.log('Erro no preenchimento do Map: ' + error);
    })

    return i
}



http.createServer(function (req, res) {
    

    //preencher as minhas hashmaps somente uma vez
    if(i) {
        myFillMap();
    }
    
    console.log(req.method + ' ' + req.url)
    if(req.method == 'GET'){
        if(req.url == '/'){
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<h2 style='color:pink;text-align:center';>Escola de Música</h2>")
            res.write('<ul>')
            res.write("<li><p><a href='/alunos'; style='color:green'>Lista de alunos</a></p></li>")
            res.write("<li><p><a href='/cursos'; style='color:green'>Lista de Cursos</p></li>")
            res.write("<li><p><a href='/instrumentos'; style='color:green'>Lista de instrumentos</p></li>")
            res.write('</ul>')
            res.end()
        }


        //página de todos os alunos
        else if(req.url == '/alunos'){
            axios.get('http://localhost:3001/alunos')
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<h2 style='color:pink;text-align:center';>Escola de Música: Lista de Alunos</h2>")
                res.write('<ul>')
            
                alunos.forEach(a =>{
                    res.write("<li><p><a href= '/"+ a.id + "' style='color:brown';>" + a.id + " - " + a.nome + "</p></li>")
                });


                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar à página inicial</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de alunos: ' + error);
            });

        }

        //página de cada aluno de acordo com o seu id de Aluno
        else if (req.url.match(/\/A[0-9]+$|\/AE-[0-9]+$/)){
            console.log("Estou aqui e a url é: " + req.url)

            var num = req.url.split("/");

            console.log("Estou aqui e o num é : " + num)

            var numAluno = num[num.length-1]

            console.log("Estou aqui e o numAluno é : " + numAluno)

            axios.get('http://localhost:3001/alunos?id='+ numAluno)
            .then(function (resp) {
                aluno = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<h2 style='color:pink;text-align:center';>Informação relativa ao Aluno " + numAluno + '</h2>')
                res.write('<ul>')
            
                aluno.forEach(a => {
                    res.write("<li> <p style='color:green'> Número Identificativo do Aluno: " + a.id + '</p></li>')
                    res.write("<li> <p style='color:green'> Nome do Aluno: " + a.nome + '</p></li>')
                    res.write("<li> <p style='color:green'> Data de Nascimento: " + a.dataNasc + '</p></li>')
                    res.write("<li> <p style='color:green'> Curso: " + myMapCurso.get(a.curso) + '</p></li>')
                    res.write("<li> <p style='color:green'> Ano lectivo: " + a.anoCurso + '</p></li>')
                    res.write("<li> <p style='color:green'> Instrumento que toca: " + a.instrumento + '</p></li>')


                });

                res.write('</ul>')
                res.write('<address>[<a href="/alunos">Voltar à lista de alunos</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de alunos: ' + error);
            });
        }

        //página de todos os cursos
        else if(req.url == '/cursos'){
            axios.get('http://localhost:3001/cursos')
            .then(function (resp) {
                cursos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<h2 style='color:pink;text-align:center';>Escola de Música: Lista de Cursos</h2>")
                res.write('<ul>')

                     
                cursos.forEach(a => {
                    res.write("<li><p><a href= '/"+ a.id + "' style='color:orange';>" + a.id + " - " + a.designacao + "</p></li>")
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar à página inicial</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de cursos: ' + error);
            }); 
        }


        //página de cada curso consoante o seu id
        else if (req.url.match(/\/CB[0-9]+$|\/CS[0-9]+$/)){
            console.log("Estou aqui e a url é: " + req.url)

            var num = req.url.split("/");

            console.log("Estou aqui e o num é : " + num)

            var idCurso = num[num.length-1]

            console.log("Estou aqui e o id do Curso é : " + idCurso)

           
            axios.get('http://localhost:3001/cursos?id='+ idCurso)
            .then(function (resp) {
                aluno = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<h2  style='color:pink;text-align:center';>Informação relativa ao Curso número " + idCurso + '</h2>')
                res.write('<ul>')
            
                aluno.forEach(a => {
                    res.write("<li> <p style='color:green'> Número Identificativo do Curso: " + a.id + '</p></li>')
                    res.write("<li> <p style='color:green'> Designação : " + a.designacao + '</p></li>')

                    var inst = a.designacao.split(" ");
                    
                    //o instrumento corne inglês tem duas palavras
                    if(inst[inst.length-1].match(/Inglês/)) {
                        var instrum = inst[inst.length-2] + " " + inst[inst.length-1]

                    }
                    //viola de arco tem três palavras
                    else if (inst[inst.length-1].match(/Arco/) ){
                        var instrum = inst[inst.length-3] + " " + inst[inst.length-2] + " " + inst[inst.length-1]

                    }
                    else var instrum = inst[inst.length-1]
        
                    res.write("<li> <p style='color:green'> Duração: " + a.duracao + '</p></li>')
                    res.write("<li> <p style='color:green'> Instrumento: " + instrum + '</p></li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/cursos">Voltar à lista de cursos</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de cursos: ' + error);
            });
        }


        //página de todos os intrumentos
        else if(req.url == '/instrumentos'){
            axios.get('http://localhost:3001/instrumentos')
            .then(function (resp) {
                inst = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<h2 style='color:pink;text-align:center';>Escola de Música: Lista de Instrumentos</h2>")
                res.write('<ul>')
            
                inst.forEach(a => {
                    res.write("<li><p style='color:blue'>" + a.id + ' - ' + myMapInst.get(a.id) + "</p></li>")
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar à página inicial</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de instrumentos: ' + error);
            }); 
        }



        //no caso de haver um erro a fazer um get
        else{
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>Pedido não suportado: " + req.method + " " + req.url + "</p>")
            res.end() 
        }

    }

    //erro do servidor
    else{
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
        res.write("<p>Erro com a criação do servidor: " + req.method + " " + req.url + "</p>")
        res.end()
    }
    
}).listen(4000)

console.log('Servidor à  escuta na porta 4000...')