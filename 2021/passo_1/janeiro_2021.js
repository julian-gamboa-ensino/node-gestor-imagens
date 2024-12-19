/**
 * Inicialmente LEE-SE um arquivo que contem as potenciais imagem que deve mostrar
 * 
 * 
 * 
 */

    var lista_fotos=[]
    var nome_pasta="passo_1";

    readTextFile("lista_arquivos.txt");

    var nova_posicao=(lista_fotos.length-1);

//console.log("lista_fotos  "+lista_fotos.length);

//Coloca-se as fotos inicialmente (antes de qualquer SETA)
    colocar_imagens(lista_fotos.length-1);
/**
 * 
 * Função de leitura do arquivo que contem a 
 * LISTAGEM
 * dos arquivos das fotos
 */

    function readTextFile(file)
    {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
//console.log(allText.split("\n"));
                    allText.split("\n").forEach(function myFunction(item, index) {
                        lista_fotos.push(item);
                    });
                }
            }
        }
        rawFile.send(null);
    }

/*
Com as setas, pode-se movimentar no INDICE
*/


    function whichButton(event) {
        

        if(event.keyCode==39)
        {
            nova_posicao=nova_posicao+1;
        }
        if(event.keyCode==37)
        {
            nova_posicao=nova_posicao-1;        
        }

        if(event.keyCode==38)
        {
            nova_posicao=nova_posicao+10;
            
        }

        if(event.keyCode==40)
        {
            nova_posicao=nova_posicao-10;        
            
        }
        colocar_imagens(nova_posicao);
    }


function colocar_imagens(indice_ultimo_para_COLOCAR)
{
//console.log(indice_ultimo_para_COLOCAR);   
//console.log("lista_fotos   "+lista_fotos[indice_ultimo_para_COLOCAR]);
//console.log("lista_fotos  (length) "+lista_fotos.length);

    indice=indice_ultimo_para_COLOCAR;
    cota_inferior=indice_ultimo_para_COLOCAR-9;

    Nome_id_INDICE=9;
//Desde a ultima IMAGEN (canto inferior direito) até a primeira (SUPERIOR ESQUERDO)
for(i=indice_ultimo_para_COLOCAR;i>cota_inferior;i--)
{
    nome_id="imagem-"+Nome_id_INDICE;
    Nome_id_INDICE--;
    pre_url=lista_fotos[indice_ultimo_para_COLOCAR];
    url=pre_url.split(nome_pasta)[1];
    
    indice_ultimo_para_COLOCAR--;

//console.log("document.getElementById   "+nome_id);
//console.log("indice_ultimo_para_COLOCAR  "+indice_ultimo_para_COLOCAR);
//console.log("url  "+url);

    if(document.readyState === "complete")
    {
        document.getElementById(nome_id).setAttribute('src', url);   
    }
    else
    {
//console.log("-----------------Falta---------------------");
    }

}


}

