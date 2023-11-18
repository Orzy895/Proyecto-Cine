let asientos = [];

// Verifica si antes habia segundos o minutos
const storedState = localStorage.getItem("timerState");
if (storedState) {
	const { minutes: storedMinutes, seconds: storedSeconds } =
		JSON.parse(storedState);
	minutos = storedMinutes;
	segundos = storedSeconds;
} else {
	iniciar();
}
//Definimos los minutos y segundos
function iniciar() {
	minutos = 5;
	segundos = 0;
}
// Definimos y ejecutamos los segundos
function cargarSegundo() {
	let txtSegundos;

	if (segundos < 0) {
		segundos = 59;
		minutos--;
	}

	// Mostrar segundos en pantalla
	if (segundos < 10) {
		txtSegundos = `0${segundos}`;
	} else {
		txtSegundos = segundos;
	}
	document.getElementById("container-segundos").innerHTML = txtSegundos;

	// Mostrar minutos en pantalla
	let txtMinutos;
	if (minutos < 10) {
		txtMinutos = `0${minutos}`;
	} else {
		txtMinutos = minutos;
	}
	document.getElementById("container-minutos").innerHTML = txtMinutos;

	if (minutos === 0 && segundos === 0) {
		clearInterval(timer); // Detiene el temporizador
		localStorage.removeItem("timerState"); //Limpia el almacenamiento local
		document.getElementById("tiempoExcedido").classList.remove("hidden"); //Oculta el mensaje por inactividad
	} else {
		// Almacena el estado actual del temporizador en el almacenamiento local
		localStorage.setItem(
			"timerState",
			JSON.stringify({ minutes: minutos, seconds: segundos })
		);
	}

	segundos--;
}

// Ejecutamos cada segundo
let timer = setInterval(cargarSegundo, 1000);

function validarDisponibilidad(asiento) {
	// Verificar si el checkbox está marcado
	if (document.getElementById(asiento).checked) {
		//Cuando esta marcado
		document.getElementById(`${asiento}-S`).classList.remove("hidden");
		document.getElementById(`${asiento}-D`).classList.add("hidden");
		asientos.push(`\n${asiento}`);
		mapearAsientos(asientos);
	} else {
		//Cuando esta desmarcado
		document.getElementById(`${asiento}-S`).classList.add("hidden");
		document.getElementById(`${asiento}-D`).classList.remove("hidden");
		asientos = asientos.filter((eliminar) => eliminar !== `\n${asiento}`);
		mapearAsientos(asientos);
	}
}
//Mapea los asientos seleccionados
function mapearAsientos(asiento) {
	let contenedor = document.getElementById("asiento-S");
	contenedor.innerHTML = mapearPlantilla(asiento);
}

function mapearPlantilla(asiento) {
	return `${asiento}`;
}
//Manda los asientos ocupados
function asientosOcupados() {
	let JSON = {
		"ocupados": [
			{
				"asiento": "F1",
			},
			{
				"asiento": "F2",
			},
			{
				"asiento": "F3",
			},
			{
				"asiento": "F4",
			},
		],
	};

	JSON.ocupados.forEach((ocupado) => {
		document.getElementById(ocupado.asiento).disabled = true;
		document.getElementById(`${ocupado.asiento}-D`).classList.add("hidden");
		document.getElementById(`${ocupado.asiento}-O`).classList.remove("hidden");
		document
			.getElementById(`asiento-${ocupado.asiento}`)
			.classList.remove("cursor-pointer");
		document
			.getElementById(`asiento-${ocupado.asiento}`)
			.classList.add("pointer-events-none");
	});
}
//Para que muestre el siguiente mensaje de inactividad
function siguienteMensaje() {
	document.getElementById("container-message1").classList.add("hidden");
	document.getElementById("container-message2").classList.remove("hidden");
}
