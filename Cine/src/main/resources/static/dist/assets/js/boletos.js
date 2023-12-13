let boletosTotal = 0;
let adulto = 0;
let adultoMon = 0;
let nino = 0;
let ninoMon = 0;
let jubilado = 0;
let jubiladoMon = 0;
let discapacitado = 0;
let discapacitadoMon = 0;
function siguiente(){
    if(boletosTotal===0 || boletosTotal<0){
        alert("No ha seleccionado ningun boleto")
    }
    else{
        localStorage.setItem('adulto',adulto)
        localStorage.setItem('adultoMon',adultoMon)
        localStorage.setItem('nino',nino)
        localStorage.setItem('ninoMon',ninoMon)
        localStorage.setItem('jubilado',jubilado)
        localStorage.setItem('jubiladoMon',jubiladoMon)
                localStorage.setItem('discapacitado',discapacitado)
        localStorage.setItem('discapacitadoMon',discapacitadoMon)
        window.location.href="./compra-paso-2(asientos).html"
    }
}

function increment(type) {
    const cantidadElement = document.getElementById(`${type}Cantidad`);
    const totalElement = document.getElementById('total');

    let cantidad = parseInt(cantidadElement.innerText);
    cantidad++;
    cantidadElement.innerText = cantidad;

    let total = parseFloat(totalElement.innerText.replace('$', ''));
    if (type === 'jubilado' || type === 'discapacitado') {
        total += 2.00;
    } else {
        total += 3.00;
    }
    totalElement.innerText = `$${total.toFixed(2)}`;
    if(type === 'adulto'){
        adulto++;
        adultoMon +=3;
        localStorage.setItem('adulto',adulto)
        localStorage.setItem('adultoMon',adultoMon)
    }
    else if(type === 'niño'){
        nino++;
        ninoMon+=3;
        localStorage.setItem('nino',nino)
        localStorage.setItem('ninoMon',ninoMon)
    }
    else if(type === 'jubilado'){
        jubilado++;
        jubiladoMon+=2;
        localStorage.setItem('jubilado',jubilado)
        localStorage.setItem('jubiladoMon',jubiladoMon)
    }
    else if(type === 'discapacitado'){
        discapacitado++;
        discapacitadoMon+=2;
        localStorage.setItem('discapacitado',discapacitado)
        localStorage.setItem('discapacitadoMon',discapacitadoMon)
    }
    //Verifica cuantos boletos hay en el almacenamiento
	const tickeState = localStorage.getItem("boletos");
	const { ticket: storedTicket} =
		JSON.parse(tickeState);
	boletosTotal = storedTicket;
    boletosTotal++;
     //Guardar boletos en almacenamiento para usarlo en asientos
     localStorage.setItem(
        "boletos",
        JSON.stringify({ ticket: boletosTotal})
    );
}

function decrement(type) {
    const cantidadElement = document.getElementById(`${type}Cantidad`);
    const totalElement = document.getElementById('total');

    let cantidad = parseInt(cantidadElement.innerText);
    if (cantidad > 0) {
        cantidad--;
        cantidadElement.innerText = cantidad;

        let total = parseFloat(totalElement.innerText.replace('$', ''));
        if (type === 'jubilado' || type === 'discapacitado') {
            total -= 2.00;
        } else {
            total -= 3.00;
        }
        totalElement.innerText = `$${total.toFixed(2)}`;
        if(type === 'adulto'){
            adulto--;
            adultoMon -=3;
            localStorage.setItem('adulto',adulto)
            localStorage.setItem('adultoMon',adultoMon)
        }
        else if(type === 'niño'){
            nino--;
            ninoMon-=3;
            localStorage.setItem('nino',nino)
            localStorage.setItem('ninoMon',ninoMon)
        }
        else if(type === 'jubilado'){
            jubilado--;
            jubiladoMon-=2;
            localStorage.setItem('jubilado',jubilado)
            localStorage.setItem('jubiladoMon',jubiladoMon)
        }
        else if(type === 'discapacitado'){
            discapacitado--;
            discapacitadoMon-=2;
            localStorage.setItem('discapacitado',discapacitado)
            localStorage.setItem('discapacitadoMon',discapacitadoMon)
        }
        //Verifica cuantos boletos hay en el almacenamiento
	    const tickeState = localStorage.getItem("boletos");
	    const { ticket: storedTicket} =
		    JSON.parse(tickeState);
	    boletosTotal = storedTicket;
        boletosTotal--;
        //Guardar boletos en almacenamiento para usarlo en asientos
        localStorage.setItem(
            "boletos",
            JSON.stringify({ ticket: boletosTotal})
        );
    }
}

function reiniciarBoletos(){
    localStorage.setItem(
        "boletos",
        JSON.stringify({ ticket: 0})
    );
}

