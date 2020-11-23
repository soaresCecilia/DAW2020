var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static')

var {parse} = require('querystring')



// Funçõess auxilidares
// Retrieves task info from request body --------------------------------
//VAi buscar o body
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        //let só é válido no contexto em que é declarado
        let body = ''
        //on vai buscar um chunk de dados ao body do request e devolve o evento data
        request.on('data', bloco => {
            body += bloco.toString()
        })

        //quando o on não consegue retirar nada do body devolve um end
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}




// POST Confirmation HTML Page Template -------------------------------------
function geraPostConfirm( tarefa, d){
    return `
    <html>
    <head>
        <title>POST receipt: ${tarefa.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${tarefa.id} inserida</h1>
            </header>

            <div class="w3-container">
                <p><a href="/tarefas/${tarefa.id}">Aceda aqui à sua página."</a></p>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}




// Template para a página com a lista de tarefas  ------------------
//Recebe um array de tarefas e a data processada
function geraPagPrincipal( tarefas, d){
  let pagHTML = `
    <html>
        <head>
            <title>Lista de tarefas</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-orange w3-center">
                <h2 class="w3-opacity w3-text-blue">Lista de Tarefas</h2>
            </div>

            <form class="w3-container" action="/tarefas" method="POST">
            <hr>
            <div class="w3-container w3-blue">
                <h4>Inserir Nova Tarefa</h4>
            </div>
                <label class="w3-text-teal"><b>Descricao</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="description">
          
                <label class="w3-text-teal"><b>Numero / Identificador</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id">

                <label class="w3-text-teal"><b>Data de Criação</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="dateCreation">

                <label class="w3-text-teal"><b>Prazo de Realização</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="dateDue">

                <label class="w3-text-teal"><b>Tipo de Tarefa</b></label>
                  </br>
                  <select class="w3-text-teal" name="tipoTarefa">
                  <option >Pessoal</option>
                  <option>Doméstica</option>
                  <option>Escolar</option>
                  <option>Profissional</option>
                  </select>
  
                  </br>

                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="who">


                <label class="w3-text-teal"><b>Estado da Tarefa</b></label>
                  <br/>
                  <label  class="w3-text-blue" for="done">Realizada</label>
                  <input type="radio" name="done" value="Yes">
                  <br/>
                  <label class="w3-text-blue" for="done">Por realizar</label>
                  <input type="radio" name="done" value="No">
                  <br/>
                  <br/>

          
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>


            <hr>

            <div class="w3-container w3-pink">
            <h4>Tarefas por Realizar</h4>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>ID da Tarefa</th>
                    <th>Descrição</th>
                    <th>Data de Criação</th>
                    <th>Prazo de Realização</th>
                    <th>Tipo de Tarefa</th>
                    <th>Responsável</th>
                </tr>
  `
 
    tarefas.forEach(t => {
            pagHTML +=  `
            <tr>
            <td><a href="/tarefas/${t.id}">${t.id}</a> </td>
            <td>${t.description}</td>
            <td>${t.dateCreation}</td>
            <td>${t.dateDue}</td>
            <td>${t.tipoTarefa}</td>
            <td>${t.who}</td>
            </tr>
            `
    });


  pagHTML += `
    </table>




    <hr>

            <div class="w3-container w3-green">
            <h4>Tarefas Realizadas</h4>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>ID da Tarefa</th>
                    <th>Descrição</th>
                    <th>Data de Criação</th>
                    <th>Prazo de Realização</th>
                    <th>Tipo de Tarefa</th>
                    <th>Responsável</th>
                </tr>


        <div class="w3-container w3-purple">
            <address>Gerado em ${d} --------------</address>
        </div>
    </body>
    </html>
  `
  return pagHTML
}

// Template para a página de tarefa -------------------------------------
function geraPagTarefa( tarefa, d ){
        var x;
    if(/No/.test(tarefa.done)) {
        x = "Não realizada"
    }
    else x = "Realizada"
    return `
    <html>
    <head>
        <title>Tarefa: ${tarefa.description}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${tarefa.description}</h1>
            </header>

            <div class="w3-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                    <li><b>Descrição: </b> ${tarefa.description}</li>
                    <li><b>Data de Criação: </b> ${tarefa.dateCreation}</li>
                    <li><b>Prazo: </b> ${tarefa.dateDue}</li>
                    <li><b>Tipo de Tarefa: </b> ${tarefa.tipoTarefa}</li>
                    <li><b>Responsável: </b> ${tarefa.who}</li>
                    <li><b>Estado da Tarefa: </b> ${x} </li>
                </ul>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

// Template para o formulário de tarefa ------------------
function geraFormTarefa( d ){
    return `
    <html>
        <head>
            <title>Registo de uma Tarefa</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="../w3.css"/>
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>Registo de Tarefa</h2>
            </div>

            <form class="w3-container" action="/tarefas" method="POST">
                <label class="w3-text-teal"><b>Descricao</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="description">
          
                <label class="w3-text-teal"><b>Numero / Identificador</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id">

                <label class="w3-text-teal"><b>Data de Criação</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="dateCreation">

                <label class="w3-text-teal"><b>Prazo de Realização</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="dateDue">

                <label class="w3-text-teal"><b>Tipo de Tarefa</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="tipoTarefa">


                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="who">

          
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>

            <footer class="w3-container w3-teal">
                <address>Gerado em ${d}</address>
            </footer>
        </body>
    </html>
    `
}


// Template para o formulário de tarefa ------------------
function geraForm2(t,d){
    return `
    <html>
        <head>
            <title>Editar uma tarefa: ${t.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="../w3.css"/>
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>Editar Tarefa: ${t.id}</h2>
            </div>

            <form class="w3-container" action="/tarefas/edit" method="PUT">
                <label class="w3-text-teal"><b>Descrição</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="descricao" value="${t.description}">
          
                <label class="w3-text-teal"><b>Numero / Identificador</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id" value="${t.id}">

                <label class="w3-text-teal"><b>Date de Criação</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="criacao" value="${t.dateCreation}">

                <label class="w3-text-teal"><b>Prazo de Realização</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="prazo" value="${t.dateDue}">


                <label class="w3-text-teal"><b>Tipo de Tarefa</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="tipoTarefa" value="${t.tipoTarefa}">

                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="who" value="${t.who}">

                <label class="w3-text-teal"><b>Estado da Tarefa</b></label>
                <input class="w3-input w3-border w3-light-grey" type="radio" name="done" value="Yes">
                <input class="w3-input w3-border w3-light-grey" type="radio" name="done" value="No">


          
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>

            <footer class="w3-container w3-teal">
                <address>Gerado em ${d}</address>
            </footer>
        </body>
    </html>
    `
}

// Criação do servidor
var tarefaServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    if(static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
    }
    else {
    switch(req.method){
        case "GET": 
            // GET /tarefas --------------------------------------------------------------------
            if((req.url == "/") || (req.url == "/tarefas")){
                axios.get("http://localhost:3000/tarefas")
                    .then(response => {
                        var tarefas = response.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagPrincipal(tarefas,d))
                        res.end()

                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possivel obter a lista de tarefas...")
                        res.end()
                    })
            }
            // GET /tarefas/id -----(só podem ser casa, emprego ou escola)---------------------------------------------------------------
            else if(/\/tarefas\/T[0-9]+$/.test(req.url)){
                var id = req.url.split("/")[2]
                console.log("O que está no tipo é " + id)


                axios.get("http://localhost:3000/tarefas/" + id)
                    .then( response => {
                        let a = response.data
                        
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagTarefa(a,d))
                        res.end()

                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possivel obter o registo da tarefa...")
                        res.end()
                    })
            }
            // GET /tarefas/registo --------------------------------------------------------------------
            else if(req.url == "/tarefas/registo"){
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(geraFormTarefa(d))
                res.end()
    }

        // GET /tarefas/:id/edit --------------------------------------------------------------------
        else if(/\/tarefas\/T[0-9]+\/edit$/.test(req.url)){
             var idTarefa = req.url.split("/")[2]
             axios.get("http://localhost:3000/tarefas/" + idTarefa)
                .then( response => {
                 let a = response.data
                
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(geraForm2(a,d))
                res.end()

            })
            .catch(function(erro){
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>Não foi possivel obter o registo das tarefas...")
                res.end()
            })
        }
           
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " NÃo suportado neste serviço.</p>")
                res.end()
            }
            break
            
        case "POST":
                if(req.url=='/tarefas') {
            recuperaInfo(req, resultado => {
                console.log('POST de tarefa:' + JSON.stringify(resultado))
                axios.post('http://localhost:3000/tarefas', resultado)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPostConfirm( resp.data, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write('<p>Erro no POST: ' + erro + '</p>')
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
            })
        }
        else if(req.url=='/tarefas/edit'){
            recuperaInfo(req, resultado => {
                console.log('PUT de tarefa:' + JSON.stringify(resultado))
                axios.put('http://localhost:3000/tarefas/' + resultado.id, resultado)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPostConfirm( resp.data, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write('<p>Erro no PUT: ' + erro + '</p>')
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
            }) 
        }
        break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
}
})

tarefaServer.listen(7779)
console.log('Servidor à  escuta na porta 7779...')