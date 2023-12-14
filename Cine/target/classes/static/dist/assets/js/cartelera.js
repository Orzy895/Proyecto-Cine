const urlbase = 'http://localhost:8080';
let cartelera = [];
let anteriorPeli;
let ID;
function obtenerPeliculas() {
    fetch(`${urlbase}/Cine/cartelera`)
        .then((response) => {
            response.json()
            .then((json) => {
                cartelera = json;
                ImprimirPeliculas();
            });
        })
        .catch(error => {
            console.error("Error al obtener las películas:", error);
        });
}

function ImprimirPeliculas() {
    let contenedor = document.getElementById('cartelera');
    let anteriorPeli;
    contenedor.innerHTML = "";
    cartelera.forEach(pelicula => {

        if (ID) {
            let filtradasPorID = cartelera.filter(pelicula => pelicula.id_pelicula === parseInt(ID));
            contenedor.innerHTML = "";
            filtradasPorID.forEach(pelicula => {
                contenedor.innerHTML += MapearPeliculas(pelicula);
            });
        } else {
            if (anteriorPeli !== pelicula.id_pelicula) {
                contenedor.innerHTML += MapearPeliculas(pelicula);
            }
            anteriorPeli = pelicula.id_pelicula;
        }
    });
}

function MapearPeliculas(pelicula) {
    const horaInicial = new Date(`January 1, 2023 ${pelicula.hora}`);
    const minutosDeLaPelicula = parseInt(pelicula.duracion, 10);

    const hora1 = sumarMinutosAHora(horaInicial, minutosDeLaPelicula);
    const hora2 = sumarMinutosAHora(hora1, minutosDeLaPelicula);
    const hora3 = sumarMinutosAHora(hora2, minutosDeLaPelicula);

    return `
    <section class="w-[95%] py-4 flex flex-col justify-center gap-5 sm:flex-row sm:items-start rounded-md border-[2px] border-white border-solid z-20 my-4">
			<div class="h-[95%] sm:h-[95%] sm:w-1/3 md:mx-[1px] md:my-1 gap-1 flex flex-col justify-center items-center">
				<div class="relative flex flex-col justify-center items-center h-[100%] w-[60%] rounded-md mx-2 px-2">
					<img src="${pelicula.foto_poster}" class="image-item max-w-none rounded-md w-[120px] h-[180px] object-cover md:w-[200px] md:h-[260px] lg:w-[220px] lg:h-[280px] md:mx-3 lg:mx-3">
				</div>
			</div>
			<div class="md:h-full md:w-2/3 md:mx-[1px] md:my-1 md:px-3">
				<ul class="">
					<li class="h-8 w-full">
						<h2 class="text-white text-left font-mono w-11/12 text-lg mx-1 my-1">${pelicula.titulo}
						</h2>
					</li>
					<li class="flex flex-wrap justify-start">
						<div
							class="bg-[#764D30] w-[40px] h-7 mx-1 my-1 px-1 py-1 justify-center rounded-md border-[2px]">
							<h2 class="text-white text-left px-1 font-mono w-[30px] font-bold">${pelicula.clasificacion}</h2>
						</div>
						<div
							class="bg-[#764D30] w-[90px] h-7 mx-1 my-1 px-1 py-1 justify-center rounded-md border-[2px]">
							<h2 class="text-white text-left px-1 font-mono w-[78px] font-bold">${pelicula.duracion}</h2>
						</div>
					</li>
					<li class="w-full">
						<hr class="my-4 w-full">
					</li>
					<li class="flex flex-wrap h-8 my-3 items-center justify-start">
						<div class="h-7 mx-1 my-1 px-1 py-1 justify-center rounded-md border-[2px] bg-[#764D30]">
							<h2 class="text-white text-left font-bold px-1 font-mono w-[44px]">Dob</h2>
						</div>
						<button
                            onclick="guardarPeliSeleccionada(${pelicula.id_cartelera}, '${formatearHora(horaInicial)}')"
							class="h-7 bg-[#C6C3C3] w-[102px] mx-1 my-1 px-1 py-1 justify-start rounded-full border-[2px]">
							<p class="text-black w-[79px] h-6 text-center font-bold">${formatearHora(horaInicial)}</p>
						</button>

						<button
                            onclick="guardarPeliSeleccionada(${pelicula.id_cartelera}, '${formatearHora(hora1)}')"
							class="h-7 bg-[#C6C3C3] w-[100px] mx-1 my-1 px-1 py-1 justify-start rounded-full border-[2px]">
							<p class="text-black w-[78px] h-5 text-center font-bold">${formatearHora(hora1)}</p>
						</button>
					</li>
					<li class="flex flex-wrap h-8 my-3 items-center justify-start">
						<div class="h-7 mx-1 my-1 px-1 py-1 justify-center rounded-md border-[2px] bg-[#764D30]">
							<h2 class="text-white text-left font-bold px-1 font-mono w-[44px]">sub</h2>
						</div>
						<button
                            onclick="guardarPeliSeleccionada(${pelicula.id_cartelera}, '${formatearHora(hora2)}')"
							class="h-7 bg-[#C6C3C3] w-[102px] mx-1 my-1 px-1 py-1 justify-start rounded-full border-[2px]">
							<p class="text-black w-[79px] h-6 text-center font-bold">${formatearHora(hora2)}</p>
						</button>
						<button
                            onclick="guardarPeliSeleccionada(${pelicula.id_cartelera}, '${formatearHora(hora3)}')"
							class="h-7 bg-[#C6C3C3] w-[100px] mx-1 my-1 px-1 py-1 justify-start rounded-full border-[2px]">
							<p class="text-black w-[78px] h-5 text-center font-bold">${formatearHora(hora3)}</p>
						</button>
					</li>
				</ul>
			</div>
		</section>
    `;
}

function sumarMinutosAHora(hora, minutos) {
    // Convertir la hora a minutos para facilitar la manipulación
    let totalMinutos = hora.getHours() * 60 + hora.getMinutes() + minutos + 15;

    // Definir las horas límite (12:00 pm y 6:00 pm) en minutos
    const limiteInferior = 12 * 60; // 12:00 pm
    const limiteSuperior = 18 * 60; // 6:00 pm

    // Asegurarse de que el resultado esté dentro del rango permitido
    totalMinutos = Math.min(Math.max(totalMinutos, limiteInferior), limiteSuperior);

    // Calcular las nuevas horas y minutos
    const nuevasHoras = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;

    // Crear un nuevo objeto de fecha con las nuevas horas y minutos
    const nuevaHora = new Date();
    nuevaHora.setHours(nuevasHoras, nuevosMinutos);

    return nuevaHora;
}

function formatearHora(hora) {
    // Utiliza toLocaleTimeString con options para obtener el formato deseado
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return hora.toLocaleTimeString('en-EN', options);
}

function guardarPeliSeleccionada(peliSeleccionada, hora) {
    let anteriorCartelera;
    cartelera.forEach(pelicula => {
        if (pelicula.id_cartelera === peliSeleccionada && anteriorCartelera !== peliSeleccionada) {
            // Guarda los datos de la peli seleccionada en sessionStorage para usarlo en otra pagina
            sessionStorage.sede = pelicula.cine;
            sessionStorage.pelicula = pelicula.titulo;
            sessionStorage.fecha = document.getElementById('fecha').value;
            sessionStorage.hora = hora;
            sessionStorage.nombreSala = pelicula.sala;
        }
        anteriorCartelera = pelicula.id_cartelera;
    });
    window.location.href = "./boletos-Paso-1.html"; // Dirige al paso 1 de compra
}


// Función para aplicar filtros y actualizar la cartelera
function actualizarCartelera() {
    const filtro = document.getElementById('cine').value;
    const genero = document.getElementById('genero').value;


    if (filtro === 'CVLS') {
        let idSucursal = 1;
        if (genero === 'all') {
            filtrarSucursal(idSucursal);
        } else {
            filtrarSucursalGenero(idSucursal, genero);
        }

    } else if (filtro === 'TOC') {
        let idSucursal = 2;
        if (genero === 'all') {
            filtrarSucursal(idSucursal);
        } else {
            filtrarSucursalGenero(idSucursal, genero);
        }

    } else if (filtro === 'HOW') {
        let idSucursal = 3;
        if (genero === 'all') {
            filtrarSucursal(idSucursal);
        } else {
            filtrarSucursalGenero(idSucursal, genero);
        }

    } else if (filtro === 'CPO') {
        let idSucursal = 4;
        if (genero === 'all') {
            filtrarSucursal(idSucursal);
        } else {
            filtrarSucursalGenero(idSucursal, genero);
        }

    } else if (filtro === 'CBT') {
        let idSucursal = 5;
        if (genero === 'all') {
            filtrarSucursal(idSucursal);
        } else {
            filtrarSucursalGenero(idSucursal, genero);
        }

    } else if (filtro === 'CHI') {
        let idSucursal = 6;
        if (genero === 'all') {
            filtrarSucursal(idSucursal);
        } else {
            filtrarSucursalGenero(idSucursal, genero);
        }

    } else if (filtro === 'COL') {
        let idSucursal = 7;
        if (genero === 'all') {
            filtrarSucursal(idSucursal);
        } else {
            filtrarSucursalGenero(idSucursal, genero);
        }

    } else if (filtro === 'VER') {
        let idSucursal = 8;
        if (genero === 'all') {
            filtrarSucursal(idSucursal);
        } else {
            filtrarSucursalGenero(idSucursal, genero);
        }
    } else {
        filtrarPorGenero();
    }


}
function filtrarSucursal(idSucursal) {
    fetch(`${urlbase}/Cine/filtrarCarteleraPorSucursal/${idSucursal}`)
        .then((response) => {
            response.json()
            .then((json) => {
                cartelera = json;
                ImprimirPeliculas();
            });
        })
        .catch(error => {
            console.error("Error al obtener las películas:", error);
        });
}
function filtrarPorGenero() {
    let genero = document.getElementById('genero').value;
    if (genero === 'all') {
        obtenerPeliculas();
    } else {
        fetch(`${urlbase}/Cine/filtrarCarteleraPorGenero/${genero}`)
            .then((response) => {
                response.json()
                .then((json) => {
                    cartelera = json;
                    ImprimirPeliculas();
                });
            })
            .catch(error => {
                console.error("Error al obtener las películas:", error);
            });
    }
}
function filtrarSucursalGenero(idSucursal, genero) {
    fetch(`${urlbase}/Cine/filtrarCarteleraPorSucursalYGenero/${idSucursal}/${genero}`)
        .then((response) => {
            response.json()
            .then((json) => {
                cartelera = json;
                ImprimirPeliculas();
            });
        })
        .catch(error => {
            console.error("Error al obtener las películas:", error);
        });
}
function FiltrarPorID(ID) {
    fetch(`/Cine/filtrarCarteleraPorID/${ID}`)
        .then(res => res.json())
        .then((json) => {
            cartelera = json;
            ImprimirPeliculas();
        })
}
let filtroProvincia = document.getElementById('provincia')
let filtroCine = document.getElementById('cine');
let filtroGenero = document.getElementById('genero');

// Maneja cambios en los filtros de provincia y cine
filtroProvincia.addEventListener('change', actualizarCartelera);
filtroCine.addEventListener('change', actualizarCartelera);
filtroGenero.addEventListener('change', actualizarCartelera);

document.addEventListener("DOMContentLoaded", function () {
    let filtrarID = new URLSearchParams(window.location.search);
    ID = filtrarID.get("idPelicula");
    let fechaActual = new Date().toISOString().split('T')[0];
    document.getElementById("fecha").value = fechaActual;
    if (ID) {
        FiltrarPorID(ID);
    }
});