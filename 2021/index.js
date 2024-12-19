/***
 * O passo inicial consiste em ativar os ENDPOINTS
 *  com ajuda da função:
 *  
ENDPOINTS_etiqueta();

E conforme as chamadas (método GET) pode-se apresentar a lista de arquivos não classificados
(marcados com etiquetas) , e pode-se classificar com uma ou várias etiquetas.
Nesta versão inicial trabalha-se sem DB 
 */


var path = require('path');
var express = require('express');
var fs = require('fs');

var app = express();

const querystring = require('querystring');

//Configuração Inicial:

const pasta_fotos="passo_1"; 

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

//Listando a fotos contidas numa PASTA especifica

function listar_fotos(pasta_FOTOS,SAIDA_pasta_arquivo_LISTA_ARQUIVOS)
{
    const completo_pasta_FOTOS = path.join(__dirname, pasta_FOTOS); 

    const dirents = fs.readdirSync(completo_pasta_FOTOS, { withFileTypes: true });

    //A estrutura de arquivos é essencial: LEMBRAR que apenas 
    //serão considerados aqueles que estejam em pastas

    const filesNames = dirents.filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

    //Desta pasta se cria uma lista (formato TXT) dos arquivos nela 
    //contidos (lendo subdiretorios se tiver)

    function procurar_arquivos(element, index, array) {

//console.log("procurar_arquivos  element "+element);

        pasta_especifica = path.join(completo_pasta_FOTOS,element); 
        lista_arquivos=getFiles(pasta_especifica);

        informacao_TXT=Object.values(lista_arquivos).join("\n");

        if(informacao_TXT.length>0)
        {
            informacao_TXT=informacao_TXT+"\n";
        }
        

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

/////////////////////// Colocando de forma dinamica os ENDPOINTS ////
ENDPOINTS_etiqueta();

function ENDPOINTS_etiqueta() {

    //Lendo os diretorios presentes na pasta de ETIQUETAS

    const completo_pasta_INICIAL = path.join(__dirname, "/etiquetas/"); 

    const dirents = fs.readdirSync(completo_pasta_INICIAL, { withFileTypes: true });    
    const filesNames = dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);


    //E para cada pasta (nome da ETIQUETA) "emite" um link

    filesNames.forEach(element => {
        //Com o intuito de facilitar o uso desta apolicação na CONSOLE

        console.log("http://localhost:3001/"+element+"/");

        //Cada vez que seja invocada a ETIQUETA (na forma: "ETIQUETA"), 
        //se faz uma lista das fotos presentas na pasta inicial (pasta_fotos=)

        app.get("/"+element+"/", GET_listar_fotos);
        
        //ENDPOINT para registra: "Uma determinada foto recebe determinada ETIQUETA"

        app.get("/"+element+"/registrando/*", registrando);

        //Com o intuito de colocar mais etiquetas   
        //Caso de mais uma única (01) etiqueta.

        app.get("/"+element+"/*/*.png/:nova/", registrando_mais_etiquetas);

        //GET para entregar qualquer arquivo que seja chamado (conforme a configuração)

        app.get("/"+element+"/*", generico);
    });
}


///////////////////////// função para atenter o GET inicial "/"    

/** 
 * Será lida a pasta de ETIQUETAS com o intuito de 
 * publicar uma lista que contem cada uma das pastas (nome da ETIQUETA) contidas na pasta de 
 * ETIQUETAS
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
//console.log("completo_pasta_INICIAL  "+saida);
    res.send(saida);
    //res.sendStatus(200);    
}

///////////////////////// Registros das Etiquetas /////////////////////////////

function registrando(req, res, next) {

    //console.log(req.path)

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

///////////////////////// Multiplas etiquetas /////////////////////////////

//Caso SIMPLES: de mais uma (01) etiqueta, o sistema registra a nova etiqueta

function registrando_mais_etiquetas(req,res,next)
{
    
    if(req.path.slice(-1)!="/")
    {
        res.send(req.path+"/");
        return;
    }
    nova_etiqueta=req.params.nova;
    novareq=req.path.replace("/"+nova_etiqueta+"/","");        

    nome_arquivo=req.path.split("/")[4];

    decodificando_endereco_url=querystring.parse(nome_arquivo);

    file=Object.keys(decodificando_endereco_url)[0];    

// Construindo o endereço no qual serão colocadas as etiquetas    

    //console.log("nome_pasta_etiquetas  "+file);

    const SAIDA_pasta_arquivo_LISTA_ARQUIVOS = './etiquetas/'+nova_etiqueta;

    fs.appendFile(SAIDA_pasta_arquivo_LISTA_ARQUIVOS+'/fotos_etiquetadas.txt', file+"\n", function (err,data) {
        if (err) {
            return console.log("erro de escrita do arquivo"+err);
        }
    });  
  

    res.redirect(novareq);
}


/////////////////////////  /////////////////////////////

/**
 * Fase de Leitura de Arquivos:
 * 1) Antes de Classificar as fotos, deve-se ler aquelas que estão no "repósitorio geral" (pasta_fotos)
 * 2) 
 * 
 */


function GET_listar_fotos(req, res, next) {


    const nome_pasta_etiquetas_listar_fotos=req.path.split("/")[1];    

    const SAIDA_pasta_arquivo_LISTA_ARQUIVOS = './etiquetas/'+nome_pasta_etiquetas_listar_fotos;

//console.log("(split) listar_fotos  "+req.path.split("/")[1]+" SAIDA_pasta_arquivo_LISTA_ARQUIVOS  "+SAIDA_pasta_arquivo_LISTA_ARQUIVOS);
    
    listar_fotos("./"+pasta_fotos,SAIDA_pasta_arquivo_LISTA_ARQUIVOS);

//console.log(" Gerando Listas ");    
//Dado que nesta função, apenas está processando arquivos, terá que fazer un NEXT (express)
    next();

}

// Função para entregar arquivos HTML JS , etc.

/**
Função que entrega qualquer arquivo solicitado.




 */
function generico(req, res, next) {

//No caso entregar as fotos CONTIDAS na pasta das já etiquetadas, fas um tratamento a mais

    var dir = path.join(__dirname, "etiquetas"); 
    var previo_file = path.join(dir, req.path.replace(/\/$/, '/index.html'));   
    var file=previo_file;

//console.log("function venezuela  "+req.path);     No caso de ter uma indicação clara da pasta fotos!! 
    
    if(req.path.includes(pasta_fotos)>0)
    {

        var dir = path.join(__dirname, pasta_fotos);         
        var previo_file= path.join(dir, req.path.split(pasta_fotos)[1]);   
    
        decodificando_endereco_url=querystring.parse(previo_file);
        file=Object.keys(decodificando_endereco_url)[0];    
        //elementos_file=file.split("/").length

//console.log("Entregando FOTOS  "+elementos_file);   Proibe a entrega daqueles fora da pasta de fotos

        if (file.indexOf(dir + path.sep) !== 0) {
            return res.status(403).end('Forbidden');
        }
    }  

    var type = mime[path.extname(file).slice(1)] || 'text/plain';
//Envio do arquivo por PIPE
    var stream_pastas_locais = fs.createReadStream(file);

    stream_pastas_locais.on('open', function () {
        res.set('Content-Type', type);
        stream_pastas_locais.pipe(res);
    });

    //stream_pastas_locais.on('error', onError);

    stream_pastas_locais.on('error', function (err) {
        res.send("Erro função (GENERICO) "+req.path);
        next();
    });

}

//
//
//

///////////////////////// 

/*
 * Servidor escutando na porta 3001 
 */

app.listen(3001, function () {
    console.log('Listening on http://localhost:3001/');
});
