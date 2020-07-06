const palabrasReservadas = ['auto', 'stdio','scanf', 'printf', 'main', 'include', 'const','struct','unsigned','break','continue','else','for','signed','switch','void','case','default','enum','goto','register','sizeof','typedef','volatile','do','extern','if','return','static','union','while','asm','dynamic_cast','namespace','reinterpret_cast','try','explicit','new','static_cast','typeid','catch','false','operator','template','typename','class','friend','private','this','using','const_cast','inline','public','throw','virtual','delete','mutable','protected','true','wchar_t','cout','cin']
const tiposDatos=['int','float','double','char', 'long', 'short'] //TAMBIEN SON PALABRAS RESERVADAS
const operadores=[ '+', '-', '*', '/', '%', '<', '>', '=', '==', '.', '!', ',', ';', '[',']','{','}', '(',')','"',"'",':', '::', '#', '&', '&&', '|', '||']

var bandera = true
let contadorINT=1,contadorFLOAT=1,contadorDOUBLE=1,contadorCHAR=1
var aux = ''
var arregloObj = []
var numeros = []
var j = 0
var x = 0;
var cont = "";
var tipo='';
var q=0, q1=0, q2=0;
var contLinea = 0
var conterror = 0
document.getElementById('file-input')
.addEventListener('change',convertFile, false);

document.getElementById('button-scan')
.addEventListener('click',process, false);

class identificador{
    constructor(){
        let codigo = ''
        let tipoDato = ''
        let nombreId = ''
    }
        
    setCodigo(codigo){
        this.codigo = codigo
    }
    getCodigo(){
        return  this.codigo
    }
    setTipoDato(tipoDato){
        this.tipoDato = tipoDato
    }
    getTipoDato(){
        return  this.tipoDato
    }
    setNombreId(nombreId){
        this.nombreId = nombreId
    }
    getNombreId(){
        return  this.nombreId
    }
}

function quitarComentariosmulti(contenido){
    // debugger
		let aux = ' '
        let longitud = contenido.length
        let j = 0
        let com = 0
        let band = true
		while( j < longitud ){       //      /*hola*/o
				if(contenido.charAt(j) == '/' && contenido.charAt(j+1) == '*'){
                    com = j+2
                    while(band){
                        //let a = contenido.charAt(com)
                        // console.log(contenido.charAt(com))
                        if(contenido.charAt(com) =='*' && contenido.charAt(com+1) =='/'){
                            band = false
                        }
                        com++
                    }
                    band = true
                    j = com + 2
				}else{
                    aux = aux + contenido.charAt(j)
                    j++
                }
			}
		
		return aux
}

function quitarComentariosuni(contenido){
    // debugger
		let aux = ' '
        let longitud = contenido.length
        let j = 0
        let com = 0
        band = true
		while( j < longitud ){
				if(contenido.charAt(j) == '/' && contenido.charAt(j+1) =='/'){
                    com = j+2
                    while(band){
                        // let a = contenido.charAt(com)
                        // console.log(contenido.charAt(com))
                        if(contenido.charAt(com) =='\n' ){
                            band = false
                        }
                        com++
                    }
                    band = true
                    j = com 
				}else{
                    aux = aux + contenido.charAt(j)
                    j++
                }
			}
		
		return aux
}

function convertFile(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result     //contenido
        mostrarContenido(contenido,'contenido-archivo')
        let auxiliar = quitarComentariosmulti(contenido)
        let auxiliar2 = quitarComentariosuni(auxiliar)
        document.scanner.aux.value = auxiliar2
        cont=auxiliar2
        mostrarContenido(auxiliar2,'contenido-archivo2')
        let auxiliar3 = contUniformizado()
        mostrarContenido(auxiliar3, 'uniformed')
        // console.log(auxiliar3);
        document.scanner.aux2.value = auxiliar3
    };
    lector.readAsText(archivo);
}


var a1dentro=false, a2dentro=false, a3dentro=false;
var a2correct=false;
function process(){
    debugger;
    document.getElementById('incorrect').classList.remove('active-red');
    document.getElementById('correct').classList.remove('active-green');
    let a1=null, a2=null, a3=null;
    document.scanner.token.value = scanner();
    // console.log(document.scanner.token.value);
    // console.log(document.scanner.aux.value);
    if(document.scanner.token.value == '$' && conterror > 0){
        document.getElementById('identify-language-error').classList.add('active-red');
    }else if(document.scanner.token.value == '$' && conterror == 0){
        document.getElementById('identify-language').classList.add('active-green');
    }
    a1 = automataDeDeclaracion(document.scanner.token.value);
    if(!a1 && !a1dentro){
        if(!a3dentro || a3dentro==null)
            a2 = automataDeOperaciones(document.scanner.token.value);
        if(a2correct)
            a2=false;
        if(!a2 && !a2dentro)
            a3 = automataDeLeerMostrar(document.scanner.token.value);
    }
    //if(document.scanner.token.value == ';')
    //    contLinea += 1
    if(document.scanner.token.value==';' && a1 || document.scanner.token.value==';' && a2 || document.scanner.token.value==';' && a3){
        // console.log(`Linea correcta ${contLinea}`);
        document.getElementById('correct').classList.add('active-green');
        document.getElementById('incorrect').classList.remove('active-red');
    }else if(!a1 && a1dentro || !a1 && !a1dentro && document.scanner.token.value==';' || !a2 && a2dentro || !a2 && !a2dentro && document.scanner.token.value==';' || !a3 && a3dentro || !a3 && !a3dentro && document.scanner.token.value==';'){
        // console.log(`Linea incorrecta ${contLinea}`);
        document.getElementById('incorrect').classList.add('active-red');
        document.getElementById('correct').classList.remove('active-green');
        conterror += 1;
    }
}

function mostrarContenido(contenido,cadena) {
	var elemento = document.getElementById(cadena);
    elemento.innerHTML = contenido;
}

function comprobarOperador(palabra){
    // debugger
    for(let i =0;i<operadores.length;i++){
        if(palabra === operadores[i]){
            return true
        }
    }
    return false
}

function comprobarNumero(numero){
    let band=false;
    for(let i=0; i<numeros.length; i++){
        if(numero==numeros[i]){
            band=true;
        }
    }
    return band;
}

function pintarReservada(palabra){
    // debugger
    if(comprobarPalabraReservada(palabra) == true || comprobarTipoDeDato(palabra) == true || comprobarTipoDeDato(palabra)==true) {
        document.getElementById('reserved')
        .classList.add('active')
        
        document.getElementById('operator')
        .classList.remove('active')

        document.getElementById('var')
        .classList.remove('active')

        document.getElementById('numero')
        .classList.remove('active')

    }else if(comprobarOperador(palabra)){
        document.getElementById('operator')
        .classList.add('active')
    
        document.getElementById('reserved')
        .classList.remove('active')

        document.getElementById('var')
        .classList.remove('active')

        document.getElementById('numero')
        .classList.remove('active')

    }else if(comprobarNumero(palabra)){
        document.getElementById('numero')
        .classList.add('active')

        document.getElementById('operator')
        .classList.remove('active')

        document.getElementById('var')
        .classList.remove('active')

        document.getElementById('reserved')
        .classList.remove('active')

    }else if(palabra =='$'){
        document.getElementById('reserved')
        .classList.remove('active')
    
        document.getElementById('operator')
        .classList.remove('active')

        document.getElementById('var')
        .classList.remove('active')

        document.getElementById('numero')
        .classList.remove('active')

    }else{
        document.getElementById('reserved')
        .classList.remove('active')
    
        document.getElementById('operator')
        .classList.remove('active')

        document.getElementById('numero')
        .classList.remove('active')

        document.getElementById('var')
        .classList.add('active')
    }
}

function scanner() {
    let tok = "";
    let c = "";
    tipo='';
    while (document.scanner.aux.value.charAt(j)==' '  || document.scanner.aux.value.charAt(j)=='	') { // Ignorar espacios en blanco
    j++;
    }
      
    if (j >= document.scanner.aux.value.length) {
        c = '$';  // fin de cadena
    }else{
        c = document.scanner.aux.value.charAt(j);
    }
    //PARA PALABRAS RESERVADAS E IDENTIFICADOR
    if (c>='a' && c<='z' || c>='A' && c<='Z')	{   // Cadena de letras
        while ((c>='a' && c<='z') || (c>='0' && c<='9') || (c>='A' && c<='Z') || c=='_') {
            tok = tok+c;
            j++;
            c = document.scanner.aux.value.charAt(j);
        }
        // if(!comprobarPalabraReservada(tok))
        //     generarObjetosId(tok);
        // else
        //     aux="";
        tipo='id';
        for(let u=0; u<palabrasReservadas.length; u++){
            if(tok==palabrasReservadas[u]){
                tipo='';
            }    
        }
        for(let u=0; u<tiposDatos.length; u++){
            if(tok==tiposDatos[u]){
                tipo='';
            }    
        }
    }
    //PARA NUMEROS
    else if (c>='0' && c<='9')	{  // Encadenar numeros
        tok=c;
        j++;
        c=document.scanner.aux.value.charAt(j)
        if(c=='.'){
            tok = tok + c;
            j++;
            c=document.scanner.aux.value.charAt(j)
        }
        while (c>='0' && c<='9')	{
            tok = tok+c;
            j++;
            c = document.scanner.aux.value.charAt(j);
        }
        tipo='num';        
    }
    //PARA OPERADORES
    else if (c==',' || c=='(' || c==')' || c=='=' || c=='*' || c=='/' || c=='-' || c=='+' || 
            c=='<' || c=='>' || c==';' || c=='{' || c== '}' || c=='#' || c=='"' || c=='!' || c=='.' || c==':' || c=='::' || c=='%' || c=='&' || c=='|'){  // Operador
        tok = c;
        if ((c=='-' && document.scanner.aux.value.charAt(j+1)=='-') ||
            (c=='+' && document.scanner.aux.value.charAt(j+1)=='+') ||
            (c=='<' && document.scanner.aux.value.charAt(j+1)=='=') ||
            (c=='>' && document.scanner.aux.value.charAt(j+1)=='=') ||
            (c=='<' && document.scanner.aux.value.charAt(j+1)=='<') ||
            (c=='>' && document.scanner.aux.value.charAt(j+1)=='>') ||
            (c=='&' && document.scanner.aux.value.charAt(j+1)=='&') ||
            (c=='|' && document.scanner.aux.value.charAt(j+1)=='|'))
        {
            tok = tok + document.scanner.aux.value.charAt(j+1);
            j++;
        }
        j++;
    }	  
    else if (c=='$') { // fin de cadena
        tok = c;
    }else{
        tok=c;
        j++;
    }
    pintarReservada(tok)
    return tok;
}

function scanner1() {
    let tok = "";
    let c="";
    

    if (x >= cont.length) {
        c = '$';  // fin de cadena
    }else{
        c = cont.charAt(x);
    }

    if (c>='a' && c<='z' || c>='A' && c<='Z')	{   // Cadena de letras
        while ((c>='a' && c<='z') || (c>='0' && c<='9') || (c>='A' && c<='Z') || c=='_') {
            tok = tok+c;
            x++;
            c = cont.charAt(x);
        }
        if(!comprobarPalabraReservada(tok))
            generarObjetosId(tok);
        else
            aux="";
    }
    
    else if (c>='0' && c<='9')	{  // Encadenar numeros
        tok=c;
        x++;
        c=cont.charAt(x)
        if(c=='.'){
            tok = tok + c;
            x++;
            c=cont.charAt(x)
        }
        while (c>='0' && c<='9')	{
            tok = tok+c;
            x++;
            c = cont.charAt(x);
        }
        numeros.push(tok)
    }

    else if (c==',' || c=='(' || c==')' || c=='=' || c=='*' || c=='/' || c=='-' || c=='+' || 
            c=='<' || c=='>' || c==';' || c=='{' || c== '}' || c=='#' || c=='"' || c=='!' || c=='.' || c==':' || c=='::' || c=='%' || c=='&' || c=='|'){  // Operador
        tok = c;
        if ((c=='-' && cont.charAt(x+1)=='-') ||
            (c=='+' && cont.charAt(x+1)=='+') ||
            (c=='<' && cont.charAt(x+1)=='=') ||
            (c=='>' && cont.charAt(x+1)=='=') ||
            (c=='<' && cont.charAt(x+1)=='<') ||
            (c=='>' && cont.charAt(x+1)=='>') || 
            (c=='&' && cont.charAt(x+1)=='&') ||
            (c=='|' && cont.charAt(x+1)=='|'))
        {
            tok = tok + cont.charAt(x+1);
            x++;
        }
        x++;
    }	  
    else if (c=='$') { // fin de cadena
        tok = c;
    }else{
        tok=c;
        x++;
    }
    return tok;
}

function comprobarPalabraReservada(palabra){
    // console.log(palabrasReservadas.length);
    for(let i = 0; i<palabrasReservadas.length;i++){
        if(palabra == palabrasReservadas[i]){
           return true
        }
    }
    return false
}

function verificarPalabra(palabra){
    if(arregloObj === -1){
        return false
    }else{
        for(let i = 0;i<arregloObj.length;i++){
            if(palabra == arregloObj[i].nombreId){
                return true
            }
        }
        return false
    }
}

function comprobarTipoDeDato(palabra){
    for(let i = 0; i<tiposDatos.length;i++){
        if(palabra == tiposDatos[i]){
           return true
        }
    }
    return false
}

function generarCodigo(palabra,tipo){
    let codigo = ''
    if(arregloObj.length>0){
        for(let i=0;i<arregloObj.length;i++){
            if(palabra == arregloObj[i].getNombreId()){
                return arregloObj[i].getCodigo()
                // console.log(arregloObj[i].getCodigo());
            }
        }
    }
        switch (tipo) {
            case 'int':
                if(contadorINT<10){
                    codigo = `i00${contadorINT}`
                    contadorINT++
                }else if(contadorINT<100){
                    codigo = `i0${contadorINT}`
                    contadorINT++
                }else{
                    codigo = `i${contadorINT}`
                    contadorINT++
                }
                break;
            case 'float':
                if(contadorFLOAT<10){
                    codigo = `f00${contadorFLOAT}`
                    contadorFLOAT++
                }else if(contadorFLOAT<100){
                    codigo = `f0${contadorFLOAT}`
                    contadorFLOAT++
                }else{
                    codigo = `f${contadorFLOAT}`
                    contadorFLOAT++
                }
                break;
            case 'double':
                if(contadorDOUBLE<10){
                    codigo = `d00${contadorDOUBLE}`
                    contadorDOUBLE++
                }else if(contadorDOUBLE<100){
                    codigo = `d0${contadorDOUBLE}`
                    contadorDOUBLE++
                }else{
                    codigo = `d${contadorDOUBLE}`
                    contadorDOUBLE++
                }
                break;
            case 'char':
                if(contadorCHAR<10){
                    codigo = `c00${contadorCHAR}`
                    contadorCHAR++
                }else if(contadorCHAR<100){
                    codigo = `c0${contadorCHAR}`
                    contadorCHAR++
                }else{
                    codigo = `c${contadorCHAR}`
                    contadorCHAR++
                }
                break;
            default:
                break;
        }
        return codigo
}

function generarObjetosId(palabra){
    if(comprobarTipoDeDato(palabra)){
        aux = palabra
        bandera = false
    }else{
        if(aux!=''){
            if(!verificarPalabra(palabra)){
                //palabra nueva
                //int numero1, numero2, numero3;
                if(bandera){
                        let long = arregloObj.length
                        let obj2 = new identificador()
                        obj2.setNombreId(palabra)
                        obj2.setCodigo(generarCodigo(palabra,aux))
                        obj2.setTipoDato(arregloObj[long-1].getTipoDato())
                        arregloObj.push(obj2)
                    }else{
                        let obj = new identificador()
                        obj.setTipoDato(aux)
                        obj.setNombreId(palabra)
                        obj.setCodigo(generarCodigo(palabra,obj.getTipoDato()))
                        arregloObj.push(obj)
                        bandera = true
                }
            }else{
                for(let i=0; i<arregloObj.length; i++){
                    if(palabra==arregloObj[i].getNombreId()){
                        if(aux!=arregloObj[i].getTipoDato()){
                            // alert('Se ha redefinido o redeclarado una variable');
                        }
                    }
                }                    
            }
        }
    }
}

function contUniformizado(){
    let conten="";
    let token="";
    let to="";
    let band, comentario=false;
    let c=1;
    while(to!='$'){
        to=scanner1();
    }
    x=0;
    do{
        band=true;
        token=scanner1()
        if(token=='"' && c%2!=0){
            comentario=true;
            c++;
        }else if (token=='"' && c%2==0){
            comentario=false;
            c++;
        }
        for(let i=0; i<arregloObj.length; i++){
            if(token==arregloObj[i].getNombreId() && !comentario){
                conten=conten+arregloObj[i].getCodigo();
                band=false
                break;
            }
        }
        if(band){
            if(token!='$'){
                conten=conten+token;
            }   
        }

    }while(token!='$');
    return conten;
}

// AUTOMATAS

function automataDeDeclaracion(token){
    // debugger
    // let mensaje="";
    let band = true
    const QF=7;
    const QE=-1;
    if (q!=QF && q!=QE){
        q=matrizTransicionDeclaracion(q,token);
    }
    if (q==QF) {
        // mensaje="Linea correcta";
        band = true
        q=0;
    }else if(q==QE){
        // mensaje="Error de declaracion";
        band = false
        q=0;
    }
    return band;
}

function matrizTransicionDeclaracion(q, tok){

    // debugger
    let estadoactual=-1;
    let alfabeto = ['int', 'float', 'id', '=', 'num', ',', ';'];
    let matriz = [
        [1, 1, -1, -1, -1, -1, -1],
        [-1, -1, 2, -1, -1, -1, -1],
        [-1, -1, -1, 5, -1, 3, 7],
        [-1, -1, 4, -1, -1, -1, -1],
        [-1, -1, -1, 5, -1, 3, 7],
        [-1, -1, -1, -1, 6, -1, -1],
        [-1, -1, -1, -1, -1, 3, 7]
    ];
    let pos;
    let band=false;
    let i=0;
    while (i<alfabeto.length && !band){
        if(tok==alfabeto[i] || tipo==alfabeto[i]){
            pos=i;
            estadoactual=matriz[q][pos];
            band=true;
        }
        i++;
    }

    if(tok=='int' || tok=='float'){
        a1dentro=true;
    }else if (tok==';'){
        a1dentro=false;
    }
    return estadoactual;
}

function automataDeOperaciones(token){
    // debugger
    let band = true
    const QF=9;
    const QE=-1;
    if (q1!=QF && q1!=QE){
        q1=matrizTransicionOperaciones(q1,token);
    }
    
    
    if (q1==QF) {
        // mensaje="Linea correcta";
        band = true
        q1=0;
    }else if(q1==QE){
        // mensaje="Error de operación"
        band = false
        q1=0;
    }
    return band  
}

function matrizTransicionOperaciones(q1, tok){
    let estadoactual=-1;
    let alfabeto = ['id', '=', ',', ';', '+', '-', '/', '*', 'num', '++', '--'];
    let matriz = [
        [1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, 2, -1, -1, 6, 6, 6, 6, -1, 7, 7],
        [3, -1, -1, -1, -1, -1, -1, -1, 8, -1, -1],
        [-1, -1, -1, 9, 4, 4, 4, 4, -1, -1, -1],
        [5, -1, -1, -1, -1, -1, -1, -1, 8, -1, -1],
        [-1, -1, -1, 9, 4, 4, 4, 4, -1, -1, -1],
        [-1, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, 9, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, 9, 4, 4, 4, 4, -1, -1, -1]
    ];
    let pos;
    let band=false;
    let i=0;
    while (i<alfabeto.length && !band){
        if(tok==alfabeto[i] || tipo==alfabeto[i]){
            pos=i;
            estadoactual=matriz[q1][pos];
            band=true;
        }
        i++;
    }
    if(tipo=='id'){
        a2dentro=true;
    }
    if(a2dentro && estadoactual==-1){
        a2correct=true;
    }
    if (tok==';'){
        a2dentro=false;
        a2correct=false;
    }
    return estadoactual;
}

function automataDeLeerMostrar(token){
    // let mensaje="";
    let band = true
    const QF=9;
    const QE=-1;
    if (q2!=QF && q2!=QE){
        q2=matrizTransicionLeerMostrar(q2,token);
    }
    if (q2==QF) {
        // mensaje="Linea correcta";
        band = true
        q2=0;
    }else if(q2==QE){
        // mensaje="Error al leer y mostrar";
        band = false
        q2=0;
    }
    return band;
}

function matrizTransicionLeerMostrar(q2, tok){
    let estadoactual=-1;
    let alfabeto = ['cin', 'cout', '>>', '<<', 'id', '"', ';'];
    let matriz = [
        [1, 4, -1, -1, -1, -1, -1],
        [-1, -1, 2, -1, -1, -1, -1],
        [-1, -1, -1, -1, 3, -1, -1],
        [-1, -1, 2, -1, -1, -1, 9],
        [-1, -1, -1, 5, -1, -1, -1],
        [-1, -1, -1, -1, 6, 7, -1],
        [-1, -1, -1, 5, -1, -1, 9],
        [-1, -1, -1, -1, 8, 9, -1]
    ];
    let pos;
    let band=false;
    let i=0;
    while (i<alfabeto.length && !band){
        if(tok==alfabeto[i] || tipo==alfabeto[i]){
            pos=i;
            estadoactual=matriz[q2][pos];
            band=true;
        }
        i++;
    }
    if(tok=='cin' || tok =='cout'){
        a3dentro=true;
    }else if(tok==';'){
        a3dentro=false;
    }
    return estadoactual;
}