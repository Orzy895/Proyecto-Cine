let asientos = [];
let cantidad;

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
	//Verifica cuantos boletos hay en el almacenamiento
	const tickeState = localStorage.getItem("boletos");
	const { ticket: storedTicket} =
		JSON.parse(tickeState);
	cantidad = storedTicket;
	// Verificar si el checkbox está marcado
	if (document.getElementById(asiento).checked) {
		//Cuando esta marcado
		if(asientos.length < cantidad){//Verifica que sea menor a la cantidad de boletos seleccionados
			document.getElementById(`${asiento}-S`).classList.remove("hidden");
			document.getElementById(`${asiento}-D`).classList.add("hidden");
			asientos.push(`\n${asiento}`);
			mapearAsientos(asientos);
		}else{
			alert(`Solo puede seleccionar hasta ${cantidad} asientos`);
			document.getElementById(asiento).checked = false;
		}
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

document.addEventListener('DOMContentLoaded', function () {
    const usuarioDataString = sessionStorage.getItem('usuarioData');
    const guestSlide = document.getElementById('guest-slide');
    const userSlide = document.getElementById('user-slide');
    const perfilUsuario = document.getElementById('perfilUsuario');

    if (usuarioDataString) {
        guestSlide.style.display = 'none';
        userSlide.style.display = 'block';

        const usuarioData = JSON.parse(usuarioDataString);
        const usernamePlaceholder = document.getElementById('usernamePlaceholder');
        if (usernamePlaceholder) {
            usernamePlaceholder.innerText = `${usuarioData.nombre} ${usuarioData.apellido}`;
        }

        const rutaImagenPerfil = sessionStorage.getItem('rutaImagenPerfil');
        if (perfilUsuario && rutaImagenPerfil) {
            perfilUsuario.src = rutaImagenPerfil;
        }
    } else {
        guestSlide.style.display = 'block';
        userSlide.style.display = 'none';
    }

    const irPerfilUsuarioBtn = document.getElementById('perfilUsuarioBtn');
    if (irPerfilUsuarioBtn) {
        irPerfilUsuarioBtn.addEventListener('click', irAPerfilUsuario);
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            sessionStorage.removeItem('usuarioData');
            sessionStorage.removeItem('rutaImagenPerfil');
            window.location.href = './home.html';
        });
    }
});

function irAPerfilUsuario() {
    const usuarioDataString = sessionStorage.getItem('usuarioData');
    if (usuarioDataString) {
        window.location.href = './perfil-usuario.html';
    } else {
        window.location.href = './inicio-sesion.html';
    }
}
