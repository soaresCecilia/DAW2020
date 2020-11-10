var http = require('http');
var fs = require('fs');
var aux = require("./mymod.js")


/*quando faz um pedido ao servidor responde com uma página web
consoante o numero que ponho depois do /, o qual só pode ser de 1 a 122
*/
http.createServer(function(request, response) {
    console.log(request.method + " " + request.url + " " + aux.myDateTime())
    if(request.url.match(/\/[1-9][0-9]?$|\/1[0-1][0-9]$|\/12[0-2]$/)){
        console.log("Fez match na ER")
        var req = request.url.split("/");
        var arquivo = req[req.length-1]
        console.log("Este é o numero da ER: " + arquivo + " e a request url é: " + req)
        fs.readFile("arqs/arq" + arquivo + ".html", function(err,data) {
            if(err) {
                response.writeHead(400, {'Content-Type': 'text/html'});
                response.write("O numero do arquivo que leu foi " + arquivo + " "+ err.message);
                response.end();
            }else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write(data)
                response.end()
            }
        })
    }
    else if (request.url.match(/\/index.html$/)){
        console.log("Fez match com a ER");
        fs.readFile("arqs/index.html", function(err,data) {
            if(err) {
                response.writeHead(400, {'Content-Type': 'text/html'});
                response.write("Não consegue ir para o indice " + " "+ err.message);
                response.end();
            }else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write(data)
                response.end()
            }
        })
    }
    else if (request.url.match(/\/arq[1-9][0-9]?.html$|\/arq1[0-1][0-9].html$|\/arq12[0-2].html$/)){
        console.log("Fez match na ER")
        var req = request.url;
        var arquivo = request.url.split("/")[2]
        console.log("Este é o numero da ER: " + arquivo + " e a request url é: " + req)
        fs.readFile("arqs/" + arquivo, function(err,data) {
            if(err) {
                response.writeHead(400, {'Content-Type': 'text/html'});
                response.write("O numero do arquivo que leu foi " + arquivo + " "+ err.message);
                response.end();
            }else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write(data)
                response.end()
            }
        })
    }
    else{
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.write("<p> O URL não corresponde ao esperado </p>")
        console.log(request.url)
        response.end()
    } 
}).listen(12346);
console.log('Servidor à escuta na porta 12346');

