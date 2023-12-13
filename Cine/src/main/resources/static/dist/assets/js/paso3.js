const ticketState = localStorage.getItem("boletos");
const { ticket: localStoredTicker } = JSON.parse(ticketState);
const boletos = parseInt(storedTicket);
console.log(boletos);
let adulto = localStorage.getItem('adulto')
let adultoMon = parseInt(localStorage.getItem('adultoMon'), 10) || 0;
let nino = localStorage.getItem('nino')
let ninoMon = parseInt(localStorage.getItem('ninoMon'), 10) || 0;
let jubilado = localStorage.getItem('jubilado')
let jubiladoMon = parseInt(localStorage.getItem('jubiladoMon'), 10) || 0;
let discapacitado = localStorage.getItem('discapacitado')
let discapacitadoMon = parseInt(localStorage.getItem('discapacitadoMon'), 10) || 0;
let baseUrl = "http://localhost:8080"
let pelicula = localStorage.getItem('pelicula')
let genero = localStorage.getItem('genero')
let ofertaAplicado = false;
let total = 0;

function sumar() {
    total = adultoMon + ninoMon + jubiladoMon + discapacitadoMon;
    localStorage.setItem('total', total)
    console.log(total)
}

function oferta(oferta) {
    console.log(boletos)
    if (ofertaAplicado === false) {
        //el de parejas
        if (oferta === 1) {
            if (adulto == 2 && boletos==2) {
                localStorage.setItem('total', (total * 0.9))
                alert("Oferta aplicada")
                ofertaAplicado = true;
            }
            else {
                alert("Oferta invalida")
            }
        }
        //el de familia
        else if (oferta === 2) {
            if (adulto ===2 && nino == 2 && boletos == 4) {
                localStorage.setItem('total', (total * 0.9))
                alert("Oferta aplicada")
                ofertaAplicado = true;
            }
            else{
                alert("Oferta invalida")
            }
        }
        // el de transformer
        else if (oferta === 3) {
            if (boletos >= 2) {
                if (pelicula === 226) {
                    total *= 0.75
                    localStorage.setItem('total', total)
                    alert("Oferta aplicada")
                    ofertaAplicado = true;
                }
                else {
                    alert("Oferta solamente valido para Transformers")
                }
            }
            else {
                alert("Oferta invalida")
            }
        }
        //si compra 3 boletos
        else if (oferta === 4) {
            if (boletos >= 3) {
                total *= 0.85
                localStorage.setItem('total', total)
                alert("Oferta aplicada")
                ofertaAplicado = true;
            }
            else {
                alert("Oferta invalida")
            }
        }
        //4 boletos, 1 gratis si es a jujutsu
        else if (oferta === 5) {
            if (boletos == 4) {
                if (pelicula === 286) {
                    total -= 3
                    localStorage.setItem('total', total)
                    alert("Oferta aplicada")
                    ofertaAplicado = true;
                }
                else{
                    alert("Oferta solo valido para Jujutsu Kaisen")
                }
            }
            else{
                alert("Oferta invalida")
            }
        }
        //2 boletos si es de terror
        else if(oferta ===6){
            if(boletos == 2){
                if(genero.includes('Terror')){
                    total-=1.5
                    localStorage.setItem('total', total)
                    ofertaAplicado = true
                    alert("Oferta aplicada")
                }
                else{
                    alert("Oferta solo valido para peliculas de terror")
                }
            }
            else{
                alert("Oferta invalida")
            }
        }
        document.getElementById("codigoOferta").placeholder = generarCodigoAleatorio();
    }
    else {
        alert("Ya ha aplicado una oferta")
    }
}


let paso3;
// Agrega un listener para el evento 'input' en cada campo
document.getElementById('nombre').addEventListener('input', verificarCampos);
document.getElementById('apellido').addEventListener('input', verificarCampos);

document.getElementById('correo').addEventListener('input', verificarCampos);
document.getElementById('numTarjeta').addEventListener('input', verificarCampos);
document.getElementById('exp').addEventListener('input', verificarCampos);
document.getElementById('cw').addEventListener('input', verificarCampos);

function verificarCampos() {
  // Obtener los valores de los campos
  var valorCampo1 = document.getElementById('nombre').value;
  var valorCampo2 = document.getElementById('apellido').value;
 
  var valorCampo4 = document.getElementById('correo').value;
  var valorCampo5 = document.getElementById('numTarjeta').value;
  var valorCampo6 = document.getElementById('exp').value;
  var valorCampo7 = document.getElementById('cw').value;

  // Obtener el botón
  var miBoton = document.getElementById('button-next');
  var mensajeError = document.getElementById('mensajeError');
  // Verificar si todos los campos están llenos
  if (valorCampo1 !== '' && valorCampo2 !== '' && valorCampo4 !== '' &&
  valorCampo5 !== '' && valorCampo6 !== '' && valorCampo7 !== '' ) {
    // Habilitar el botón si todos los campos están llenos
    miBoton.disabled = false;

  } else {
    // Deshabilitar el botón si algún campo está vacío
    miBoton.disabled = true;

  }

}

// dropdown
function toggleDropdown() {
    var dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("invisible");
}

function cancelarDropdown() {
    var dropdown = document.getElementById("dropdown");
    dropdown.classList.add("invisible");
}

function aceptarDropdown() {
    // Genera un código aleatorio y lo muestra en el campo de contraseña
    var passwordInput = document.getElementById("passwordInput");
    var codigoAleatorio = generarCodigoAleatorio();
    passwordInput.value = codigoAleatorio;

    // Oculta el dropdown
    var dropdown = document.getElementById("dropdown");
    dropdown.classList.add("invisible");
}

function generarCodigoAleatorio() {
    // Genera un número aleatorio de 1000 a 9999
    var codigo = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return codigo.toString(); // Convierte el número a cadena
}

