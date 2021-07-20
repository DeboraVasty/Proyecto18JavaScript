const criptomonedasSelect =document.querySelector('#criptomonedas');
const monedaSelect =document.querySelector('#moneda');
const formulario= document.querySelector('#formulario');


const objBusqueda={
    moneda:'',
    criptomoneda:''
}
//crear un promise
const obtenerCriptonomedas= criptomonedas => new Promise(resolve=>{
    resolve(criptomonedas);
});


document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas();
    formulario.addEventListener('submit',submitFormulario);
    criptomonedasSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor);
})

async function consultarCriptomonedas(){
    const url='https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try{
        const respuesta=await fetch(url);
        const resultado=await respuesta.json();
        const criptomonedas=await obtenerCriptonomedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    }catch(error){
        console.log(error)
    }
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto=>{
       const{FullName, Name}= cripto.CoinInfo;

       const option=document.createElement('option');
       option.value=Name;
       option.textContent=FullName;
       criptomonedasSelect.appendChild(option);
    })

}

function leerValor(e){
    objBusqueda[e.target.name]=e.target.value;
   
}


function submitFormulario(e){
    e.preventDefault();
    //validar
    const{moneda,criptomoneda}=objBusqueda;
    if(moneda===''|| criptomoneda===''){
        mostrarAlerta('Ambos cmpos son obligatorios');
        return;
    }

    //consultar la API
    consultarAPI();
}

function mostrarAlerta(msg){
    const existeError=document.querySelector('.error');

    if(!existeError){
        const divMensaje=document.createElement('div');
        divMensaje.classList.add('error');
     
        //mensaje
        divMensaje.textContent=msg;
        formulario.appendChild(divMensaje);
        setTimeout( () => {
         divMensaje.remove();
     }, 3000);

    }
  
}
async function consultarAPI(){
    const {moneda,criptomoneda}=objBusqueda;
    const url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
        try{
            const respuesta=await fetch(url);
            const cotizacion= await respuesta.json();
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        }catch(error){
            console.log(error)
        }
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();

   const{FROMSYMBOL,TOSYMBOL,PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE,HIGHHOUR,OPENDAY}=cotizacion;

   const contizar=document.createElement('p');
   contizar.innerHTML=`Cotizar : <span>${FROMSYMBOL}</span>  => <span>${TOSYMBOL}</span>`;

   const precio=document.createElement('p');
   precio.classList.add('precio');
   precio.innerHTML=`El Precio es: <span>${PRICE}</span>`;

   const precioAlto=document.createElement('p');
   precioAlto.innerHTML=`<p>El Precio más alto del dia : <span>${HIGHDAY}</span>`;

   const precioBajo=document.createElement('p');
   precioBajo.innerHTML=`<p>El Precio más Bajo del dia : <span>${LOWDAY}</span>`;

   const ultimasHoras=document.createElement('p');
   ultimasHoras.innerHTML=`<p>Variación últimas 24 horas : <span>${CHANGEPCT24HOUR}%</span>`;

   const ultimaActualizacion=document.createElement('p');
   ultimaActualizacion.innerHTML=`<p>Ultima Actualización : <span>${LASTUPDATE}</span>`;

   const precioAltoH=document.createElement('p');
   precioAltoH.innerHTML=`<p>El Precio alto por Hora : <span>${HIGHHOUR}</span>`;
  
   const AbrirDia=document.createElement('p');
   AbrirDia.innerHTML=`<p>Precio Inicial del dia : <span>${OPENDAY}</span>`;

   resultado.appendChild(contizar);
   resultado.appendChild(precio);
   resultado.appendChild(precioAlto);
   resultado.appendChild(precioBajo);
   resultado.appendChild(ultimasHoras);
   resultado.appendChild(ultimaActualizacion);
   resultado.appendChild(precioAltoH);
   resultado.appendChild(AbrirDia);
   
  

}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner=document.createElement('div');
    spinner.classList.add('sk-chase');

    spinner.innerHTML=`
    
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>

    `;
    resultado.appendChild(spinner);
}