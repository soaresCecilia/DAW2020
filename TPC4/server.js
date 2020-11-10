var http = require('http');
var fs = require('fs');
var aux = require("./mymod.js")


/*quando faz um pedido ao servidor responde com uma página web
consoante o numero que ponho depois do /, o qual só pode ser de 1 a 122
*/


function getResponse(path, response) {
    fs.readFile(path, function(err, data){
        if(err){
            //pagina de erro criada
            fs.readFile('arqs/404.html', function(err, data){
                if(err){
                    response.writeHead(400, {'Content-Type': 'text/html'});
                    response.write("O erro foi: " + err.message);
                    response.end();
                }
                else{
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(data);
                    response.end();
                }
            });    
        }
        else{
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.write(data);
            response.end();
        }
    });
}



http.createServer(function(request, response) {
    console.log(request.method + " " + request.url + " " + aux.myDateTime())
    
    //para fazer match com a página web arqs/ de 1 a 122
    if(request.url.match(/\/arqs\/[1-9][0-9]?$|\/1[0-1][0-9]$|\/12[0-2]$/)){
        console.log("Fez match com a ER que verifica se o path é /arqs/numero")

        var req = request.url.split("/");
        var arquivo = req[req.length-1]
        console.log("Este é o numero da ER: " + arquivo + " e a request url é: " + req)
        var path = "arqs/arq" + arquivo + ".html";
        
        getResponse(path, response)
        
    }
    //para poder ir para o indice
    else if (request.url.match(/\/arqs\/index.html$/)){
        console.log("Fez match com a ER /arqs/index.html");
        getResponse("arqs/index.html", response)
    }
    //para poder ir para o indice
    else if(request.url.match(/\/arqs\/index$/)){
        console.log("Fez match com a ER /arqs/index");

        getResponse("arqs/index.html", response)
        
    }
    //para poder voltar ao indice principal a partir de uma página
    else if (request.url.match(/\/arq[1-9][0-9]?.html$|\/arq1[0-1][0-9].html$|\/arq12[0-2].html$/)){
        console.log("Fez match com a ER /arq/numero.html")

        var req = request.url.split("/");
        var arquivo = req[req.length-1]
        console.log("Este é o numero da ER: " + arquivo)

        var path2 = "arqs/" + arquivo;

        getResponse(path2, response);
    }
    //não faz match com nenhuma das ER anteriores
    else{
        getResponse(request.url, response)
    } 
}).listen(12346);
console.log('Servidor à escuta na porta 12346');

