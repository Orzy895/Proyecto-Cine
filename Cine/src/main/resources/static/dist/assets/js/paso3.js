let boletos = localStorage.getItem("boletos");
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

function sumar() {
    let total = adultoMon + ninoMon + jubiladoMon + discapacitadoMon;
    localStorage.setItem('total', total)
    console.log(total)
}

function obtenerpelis() {
    sumar()
    fetch(baseUrl + '/Cine/peliculas').then(res => {
        res.json().then(json => {
            peliculas = json
            console.log(peliculas)
        })
    })
}

function oferta(oferta) {
    if (ofertaAplicado === false) {
        //el de parejas
        if (oferta === 1) {
            if (adulto === 2) {
                localStorage.setItem('adultoMon', (adultoMon * 0.9))
                alert("Oferta aplicada")
                ofertaAplicado = true;
            }
            else {
                alert("Oferta invalida")
            }
        }
        //el de familia
        else if (oferta === 2) {
            if (adulto === 2 && nino === 2) {
                localStorage.setItem('adultoMon', (adultoMon * 0.9))
                localStorage.setItem('ninoMon', (ninoMon * 0.9))
                alert("Oferta aplicada")
                ofertaAplicado = true;
            }
        }
        // el de transformer
        else if (oferta === 3) {
            if (boletos >= 2) {
                if (pelicula === 226) {
                    total *= 0.75
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
                alert("Oferta aplicada")
                ofertaAplicado = true;
            }
            else {
                alert("Oferta invalida")
            }
        }
        //4 boletos, 1 gratis si es a jujutsu
        else if (oferta === 5) {
            if (boletos === 4) {
                if (pelicula === 286) {
                    total -= 3
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
            if(boletos === 2){
                if(genero.includes('Terror')){
                    total-=1.5
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
        sumar()
    }
    else {
        alert("Ya ha aplicado una oferta")
    }
}