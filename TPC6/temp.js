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
                  <h2 class="w3-opacity w3-text-teal">Lista de Tarefas</h2>
              </div>
  
              <form class="w3-container" action="/tarefas" method="POST">
              <hr>
              <div class="w3-container w3-blue">
                  <h4>Inserir Nova Tarefa</h4>
              </div>
                  <label class="w3-text-indigo"><b>Descricao</b></label>
                  <input class="w3-input w3-border w3-light-grey" type="text" name="description">
  
                  <label class="w3-text-teal"><b>Número Identitificativo</b></label>
                  <input class="w3-input w3-border w3-light-grey" type="text" name="id" value="${t.id}">
  
            
                  <label class="w3-text-indigo"><b>Data de Criação</b></label>
                  <input class="w3-input w3-border w3-light-grey" type="text" name="dateCreation">
  
                  <label class="w3-text-blue"><b>Prazo de Realização</b></label>
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
                  <label class="w3-text-blue"><b>Responsável</b></label>
                  <input class="w3-input w3-border w3-light-grey" type="text" name="who">
  
                  <label class="w3-text-indigo"><b>Estado da Tarefa</b></label>
                  <br/>
                  <label  class="w3-text-blue" for="done">Realizada</label>
                  <input type="radio" name="done" value="Yes">
                  <br/>
                  <label class="w3-text-blue" for="done">Por realizar</label>
                  <input type="radio" name="done" value="No">
                  <hr/>
  
                  <input class="w3-btn w3-blue" type="submit" value="Submeter"/>
                  <input class="w3-btn w3-indigo" type="reset" value="Limpar valores"/> 
              </form>
  
  
              <hr>
  
              <div class="w3-container w3-pink">
              <h4>Tarefas por Realizar</h4>
               </div>
  
              <table class="w3-table w3-bordered">
                  <tr>
                      <th>Descrição</th>
                      <th>Data de Criação</th>
                      <th>Prazo de Realização</th>
                      <th>Tipo de Tarefa</th>
                      <th>Responsável</th>
                  </tr>
    `
   
      tarefas.forEach(t => {
  
          if((/No/).test(t.done)) {
          console.log("O que está no t.done é " + t.done)
              pagHTML +=  `
              <tr>
              <td><a href="/tarefas/${t.id}">${t.description}</a> </td>
              <td>${t.id}</td>
              <td>${t.dateCreation}</td>
              <td>${t.dateDue}</td>
              <td>${t.type}</td>
              <td>${t.who}</td>
              <td>${t.done}</td>
              </tr>
              `
          }
      });
  
  
      
  
    pagHTML += `
  
          </table>
  
          <hr>
          <div class="w3-container w3-teal">
              <h4>Tarefas Realizadas</h4>
          </div>
  
  
          <table class="w3-table w3-bordered">
                  <tr>
                      <th>Descrição</th>
                      <th>Data de Criação</th>
                      <th>Prazo de Realização</th>
                      <th>Tipo de Tarefa</th>
                      <th>Responsável</th>
                  </tr>
    `
   
      tarefas.forEach(t => {
          if((/Yes/).test(t.done)) {
              pagHTML +=  `
              <tr>
              <td><a href="/tarefas/${t.id}">${t.description}</a> </td>
              <td>${t.id}</td>
              <td>${t.dateCreation}</td>
              <td>${t.dateDue}</td>
              <td>${t.type}</td>
              <td>${t.who}</td>
              </tr>
              `
          }
      });
  
  
      pagHTML += `
  
      </table>
  
          <div class="w3-container w3-purple">
              <address>Gerado em ${d} --------------</address>
          </div>
      </body>
      </html>
    `
    return pagHTML
  }
  
  
  


/*
form.w3-container(action='/addtodo' method='POST')
                label Data Limite:
                input.w3-input.w3-border.w3-light-grey(type="date", name="data")
                label Descrição:
                input.w3-input.w3-border.w3-light-grey(type="text", name="desc")
                input.w3-button.w3-large.w3-circle.w3-xlarge.w3-ripple.w3-black(type="submit", value="+")
    hr
    hr
    header.w3-container
        h3 Lista de ToDo's
        .w3-container
            table.w3-table-all
                tr
                    th Data da Tarefa
                    th Descrição
                    th
                - for(var x = 0; lista[x] != null; x++)
                    tr
                        td=lista[x].data
                        td=lista[x].desc
                        td
                            form.w3-container(action='/remove' method='POST')
                                input(type="hidden",name="id",value=x)
                                input(type="submit", value="Remover")

*/
