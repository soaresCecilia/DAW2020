function showImage(name, type) {

    if(type =='image/png' || type =='image/jpeg')
        var ficheiro = '<img src="/fileStore/' + name + '"width="80%"/>'
    else 
        var ficheiro = '<p>' + name + ', ' + type + '</p>'

    var fileObject = $(`
    <div class="w3-row w3-margin">
        <div class="w3-col s6">
            ${ficheiro}
        </div>
        <div class="w3-col s6 w3-border"> 
           <p>Filename: ${name}</p>
           <p>Mimetype: ${type}</p>
        </div>
    </div>
    `)
    
    var download = $('<div><a href="/files/download/' + name + '">Download</a></div>')


    $("#display").empty()
    $("#display").append(fileObject, download)
    $("#display").modal()
}



function addFile(){

    var newFile = $(`
    <div id="oneFile">
        <hr style="border-width: 2px; color: w3-blue;">
        <div class="w3-row w3-margin-bottom">
            <div class="w3-col s3">
                <label class="w3-text-teal">Description</label>
            </div>
            <div class="w3-col s9 w3-border">
                <input class="w3-input w3-border w3-light-grey" type="text" name="desc" required>
            </div>
        </div>
        <div class="w3-row w3-margin-bottom">
            <div class="w3-col s3">
                <label class="w3-text-teal">Select File</label>
            </div>
            <div class="w3-col s9 w3-border">
                <input class="w3-input w3-border w3-light-grey" type="file" name="myFile">
            </div>
        </div>
    </div>     
    `
)
    $("#addFiles").append(newFile)
}

function removeOneFile(){
    $("#oneFile").remove()
}