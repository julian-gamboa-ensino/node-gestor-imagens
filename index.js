var path = require('path');
var express = require('express');
var app = express();
var fs = require('fs');

const querystring = require('querystring');

/**
 * 
 * 
 * 
 * 
 */

//se indica a pasta onde se tem a INDEX e as fotos para serem processadas

const totalidade = './passo_1';

//São coletadas informações nesta pasta, procurando em cada pasta:

const testFolder = path.join(__dirname, totalidade); 

const dirents = fs.readdirSync(testFolder, { withFileTypes: true });
const filesNames = dirents
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);


//São coletadas informações nesta pasta

function procurar_arquivos(element, index, array) {
//    console.log("a[" + index + "] = " + element);
    pasta_especifica = path.join(totalidade,element); 
    lista_arquivos=getFiles(pasta_especifica);
//console.log(getFiles(pasta_especifica))
//console.log(String(lista_arquivos)); JSON.stringify(lista_arquivos)
//console.log(lista_arquivos);
//console.log(typeof(lista_arquivos));
//console.log(Object.values(lista_arquivos).toString("\n"));
//console.log(Object.values(lista_arquivos).join("\n"));

informacao_TXT=Object.values(lista_arquivos).join("\n");
fs.writeFile('./passo_1/lista_arquivos.txt', informacao_TXT, function (err,data) {
    if (err) {
      return console.log("erro de escrita do arquivo"+err);
    }
    else
    {
        //console.log(data);
    }
    
  });
}

filesNames.forEach(procurar_arquivos);

//console.log("Lista de pastas "+filesNames[1]);
//console.log("Lista de pastas "+pasta_especifica);

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}


/*
Com as informações essenciais (Dor diretorios) 

*/

var dir = path.join(__dirname, totalidade);

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

app.get('*', function (req, res) {
    var previo_file = path.join(dir, req.path.replace(/\/$/, '/index.html'));

    decodificando_endereco_url=querystring.parse(previo_file);

//Registrando num DB (formato JSON) as imagens que são consultadas
    console.log(decodificando_endereco_url);
    file=Object.keys(decodificando_endereco_url)[0];

    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';

    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

app.listen(3001, function () {
    console.log('Listening on http://localhost:3001/');
});
