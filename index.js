/***
 * O passo inicial consiste em listar os arquivos (fotos PNG)
 * com ajuda da função:
 *  listar_fotos
 * Por este motivo deve-se coloca na Pasta de cada etiqueta o aqruivo "lista_arquivos.txt", o que 
 * é feito com a ajuda da função *_listar_fotos (Exemplo: venezuela_listar_fotos, fofinhos_listar_fotos)
 * 
 */


var path = require('path');
var express = require('express');
var app = express();
var fs = require('fs');
const readline = require('readline');

const querystring = require('querystring');
const { notEqual } = require('assert');

//Futuro:

function registro_db_desde_server(nome_imagem)
{
    console.log(nome_imagem);
}


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

///////////////////////// Funções Auxiliares /////////////////////////////

function listar_fotos(pasta_FOTOS,SAIDA_pasta_arquivo_LISTA_ARQUIVOS)
{
    const completo_pasta_FOTOS = path.join(__dirname, pasta_FOTOS); 

    const dirents = fs.readdirSync(completo_pasta_FOTOS, { withFileTypes: true });

//A estrutura de arquivos é essencial: LEMBRAR que apenas 
//serão considerados aqueles que estejam em pastas

    const filesNames = dirents.filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

//São coletadas informações nesta pasta que comtem as PASTAS de FOTOS

    function procurar_arquivos(element, index, array) {

//console.log("procurar_arquivos  element "+element);

        pasta_especifica = path.join(completo_pasta_FOTOS,element); 
        lista_arquivos=getFiles(pasta_especifica);

        informacao_TXT=Object.values(lista_arquivos).join("\n");

        informacao_TXT=informacao_TXT+"\n";

//console.log("ARQUIVO  informacao_TXT  "+completo_pasta_FOTOS+'/lista_arquivos.txt', informacao_TXT);

        fs.appendFile(SAIDA_pasta_arquivo_LISTA_ARQUIVOS+'/lista_arquivos.txt', informacao_TXT, function (err,data) {
            if (err) {
            return console.log("erro de escrita do arquivo"+err);
            }
        });

    }

//Antes de criar o ARCHIVO de listagem, se cria o memso VAZIO

    fs.writeFile(SAIDA_pasta_arquivo_LISTA_ARQUIVOS+'/lista_arquivos.txt', "", function (err,data) {
        if (err) {
        return console.log("erro de escrita do arquivo"+err);
        }
    });


    filesNames.forEach(procurar_arquivos);

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
}
  
///////////////////////// Rotas /////////////////////////////

app.get("/", pagina_inicial);

//-----------------------------------------Etiqueta de fofihhos (Minha Esposa Elaine adora animais)
app.get("/porno/", GET_listar_fotos);
    app.get("/porno/registrando/*", registrando);
    app.get("/porno/*", generico);
///////   A utilidade desta etiqueta (Fofinho) é para organizar as ajudas R$    

//-----------------------------------------Etiqueta de fofihhos (Minha Esposa Elaine adora animais)
app.get("/fofinhos/", GET_listar_fotos);
    app.get("/fofinhos/registrando/*", registrando);
    app.get("/fofinhos/*", generico);
///////   A utilidade desta etiqueta (Fofinho) é para organizar as ajudas R$

//----------------------------------------------Etiqueta de Venezuela:
app.get("/venezuela/", GET_listar_fotos);
//Usa-se a função GENERICO para poder apresentar outros arquivos: Fotos, JS, etc.    
    app.get("/venezuela/registrando/*", registrando);
//Para visualizar os que já estão classificados:
    app.get("/venezuela/classificados/", venezuela_listar_fotos_classificadas);    
app.get("/venezuela/*", generico);
    
///////   A utilidade desta etiqueta (Venezuela)


///////////////////////// GET inicial /////////////////////////////

/**
 * 
 * Será lida a pasta de ETIQUETAS com o intuito de 
 */
function pagina_inicial(req, res, next) {

//Lendo os diretorios presentes na pasta de ETIQUETAS
    const completo_pasta_INICIAL = path.join(__dirname, "/etiquetas/"); 
    const dirents = fs.readdirSync(completo_pasta_INICIAL, { withFileTypes: true });

    const filesNames = dirents.filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

    saida="<ol>";

    filesNames.forEach(element => {
        saida+="<li><a href=/"+element+"/>"+element+"</a></li>";
    });

    saida+="</ol>";
console.log("completo_pasta_INICIAL  "+saida);
    res.send(saida);
    //res.sendStatus(200);    
}

///////////////////////// Registros das Etiquetas /////////////////////////////

function registrando(req, res, next) {

    nome_arquivo=req.path.split("/")[3];

    decodificando_endereco_url=querystring.parse(nome_arquivo);
    file=Object.keys(decodificando_endereco_url)[0];    

// Construindo o endereço no qual serão colocadas as etiquetas
    nome_pasta_etiquetas=req.path.split("/")[1];
//console.log("nome_pasta_etiquetas  "+nome_pasta_etiquetas);
    const SAIDA_pasta_arquivo_LISTA_ARQUIVOS = './etiquetas/'+nome_pasta_etiquetas;

    fs.appendFile(SAIDA_pasta_arquivo_LISTA_ARQUIVOS+'/fotos_etiquetadas.txt', file+"\n", function (err,data) {
        if (err) {
        return console.log("erro de escrita do arquivo"+err);
        }
    });

//console.log("registrando  "+file); 

    res.sendStatus(200);
}

///////////////////////// FOFINHOS /////////////////////////////


///////////////////////// VENEZUELA /////////////////////////////

/**
 * Fase de Leitura de Arquivos:
 * 1) Antes de Classificar as fotos, deve-se ler aquelas que estão no repósitorio GERAL
 * 2) 
 * 
 */


function GET_listar_fotos(req, res, next) {


    const nome_pasta_etiquetas_listar_fotos=req.path.split("/")[1];    

    const SAIDA_pasta_arquivo_LISTA_ARQUIVOS = './etiquetas/'+nome_pasta_etiquetas_listar_fotos;

//console.log("(split) listar_fotos  "+req.path.split("/")[1]+" SAIDA_pasta_arquivo_LISTA_ARQUIVOS  "+SAIDA_pasta_arquivo_LISTA_ARQUIVOS);
    
    const pasta_FOTOS_geral = './passo_1';

    listar_fotos(pasta_FOTOS_geral,SAIDA_pasta_arquivo_LISTA_ARQUIVOS);

//console.log(" Gerando Listas ");    
//Dado que nesta função, apenas está processando arquivos, terá que fazer un NEXT (express)
    next();

}

// Quando se tem fotos CLASSIFICADAS, podem-se listar no sistema

function venezuela_listar_fotos_classificadas(req, res, next) {

    const venezuela_SAIDA_pasta_arquivo_LISTA_ARQUIVOS = './etiquetas/venezuela';
    
    const pasta_FOTOS_geral = './passo_1';

    listar_fotos(pasta_FOTOS_geral,venezuela_SAIDA_pasta_arquivo_LISTA_ARQUIVOS);

//console.log(" Gerando Listas ");    
//Dado que nesta função, apenas está processando arquivos, terá que fazer un NEXT (express)
    next();

}


// Função para entregar arquivos HTML JS , etc.

const pasta_fotos="passo_1"; 

function generico(req, res, next) {

//No caso entregar as fotos CONTIDAS na pasta das já etiquetadas, fas um tratamento a mais

    var dir = path.join(__dirname, "etiquetas"); 
    var previo_file = path.join(dir, req.path.replace(/\/$/, '/index.html'));   
    var file=previo_file

//console.log("function venezuela  "+req.path);      
    
    if(req.path.includes(pasta_fotos)>0)
    {

        var dir = path.join(__dirname, pasta_fotos);         
        var previo_file= path.join(dir, req.path.split(pasta_fotos)[1]);   
    
        decodificando_endereco_url=querystring.parse(previo_file);
        file=Object.keys(decodificando_endereco_url)[0];    
        elementos_file=file.split("/").length

//console.log("Entregando FOTOS  "+elementos_file);   

        if (file.indexOf(dir + path.sep) !== 0) {
            return res.status(403).end('Forbidden');
        }
    }  

    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
}

///////////////////////// FIM  
///////////////////////// Colombia /////////////////////////////

function colombia(req, res, next) {

    var dir = path.join(__dirname, "etiquetas");
    var previo_file = path.join(dir, req.path.replace(/\/$/, '/index.html'));   

    var type = mime[path.extname(previo_file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(previo_file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });

    var pasta_fotos_etiquetadas= path.join(dir, req.path);   
    var pasta_fotos_nao_etiquetadas = path.join(__dirname, "./passo_1");

    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(pasta_fotos_nao_etiquetadas+"/lista_arquivos.txt")
      }).on('line', function (line) {
        console.log('Registrado :', line);
      });

    console.log("Roteamento Explicito  "+pasta_fotos_nao_etiquetadas);    
}

///////////////////////// FIM  

/*
 * Servidor escutando na porta 3000 
 */

app.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});
