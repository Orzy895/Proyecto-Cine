const urlbase = "http://127.0.0.1:8080";
let ofertas = [];

// Variable to track the current image in the carousel
let carruselCurrent = 1;

// Image elements in the carousel
let img1 = document.getElementById('car1img');
let img2 = document.getElementById('car2img');
let img3 = document.getElementById('car3img');
let img4 = document.getElementById('car4img');

// Radio buttons for the carousel
let rad1 = document.getElementById('car1rad');
let rad2 = document.getElementById('car2rad');
let rad3 = document.getElementById('car3rad');
let rad4 = document.getElementById('car4rad');

// Container for the trending scroll
let scrollTrend = document.getElementById('scroll');

// Function to hide the current image
function hide(number) {
    if (number == 1) {
        img1.classList.add('hidden');
    } else if (number == 2) {
        img2.classList.add('hidden');
    } else if (number == 3) {
        img3.classList.add('hidden');
    } else if (number == 4) {
        img4.classList.add('hidden');
    }
}

// Function to show the next image in the carousel
function show(number) {
    if (number == 1) {
        img1.classList.remove('hidden');
        rad1.checked = true;
    } else if (number == 2) {
        img2.classList.remove('hidden');
        rad2.checked = true;
    } else if (number == 3) {
        img3.classList.remove('hidden');
        rad3.checked = true;
    } else if (number == 4) {
        img4.classList.remove('hidden');
        rad4.checked = true;
    }
}

// Function to uncheck all radio buttons
function uncheck() {
    rad1.checked = false;
    rad2.checked = false;
    rad3.checked = false;
    rad4.checked = false;
}

// Function to go to the next image in the carousel
function siguiente() {
    hide(carruselCurrent);
    if (carruselCurrent == 5) {
        carruselCurrent = 1;
    } else {
        carruselCurrent += 1;
    }
    uncheck();
    show(carruselCurrent);
}

// Function to go to the previous image in the carousel
function atras() {
    hide(carruselCurrent);
    if (carruselCurrent == 1) {
        carruselCurrent = 5;
    } else {
        carruselCurrent -= 1;
    }
    uncheck();
    show(carruselCurrent);
}

// Functions to handle radio button changes for the carousel images
function img1cambio() {
    hide(carruselCurrent);
    carruselCurrent = 1;
    img1.classList.remove('hidden');
}

function img2cambio() {
    hide(carruselCurrent);
    carruselCurrent = 2;
    img2.classList.remove('hidden');
}

function img3cambio() {
    hide(carruselCurrent);
    carruselCurrent = 3;
    img3.classList.remove('hidden');
}

function img4cambio() {
    hide(carruselCurrent);
    carruselCurrent = 4;
    img4.classList.remove('hidden');
}


// Functions to handle scrolling in the trending section
function scrollIzq() {
    scrollTrend.scrollBy({
        left: -480,
        behavior: 'smooth'
    });
}

function scrollDer() {
    scrollTrend.scrollBy({
        left: 480,
        behavior: 'smooth'
    });
}

// Function to handle user data and profile display
document.addEventListener('DOMContentLoaded', function () {
    const usuarioDataString = sessionStorage.getItem('usuarioData');
    const botonPerfil = document.getElementById('perfilUsuarioBtn');
    const imagenPerfil = document.getElementById('perfilUsuario');

    if (usuarioDataString) {
        const usuarioData = JSON.parse(usuarioDataString);
        botonPerfil.style.display = 'block';
        imagenPerfil.style.display = 'block';

        const usernamePlaceholder = document.getElementById('usernamePlaceholder');
        if (usernamePlaceholder) {
            usernamePlaceholder.innerText = `${usuarioData.nombre} ${usuarioData.apellido}`;
        }
    } else {
        botonPerfil.style.display = 'block';
        imagenPerfil.style.display = 'block';
    }
});

// Function to redirect to user profile
function irAPerfilUsuario() {
    const usuarioDataString = sessionStorage.getItem('usuarioData');

    if (usuarioDataString) {
        window.location.href = './perfil-usuario.html';
    } else {
        window.location.href = './inicio-sesion.html';
    }
}

// Function to handle user profile image
document.addEventListener('DOMContentLoaded', function () {
    const rutaImagenPerfil = localStorage.getItem('rutaImagenPerfil');

    const perfilUsuario = document.getElementById('perfilUsuario');
    if (perfilUsuario && rutaImagenPerfil) {
        perfilUsuario.src = rutaImagenPerfil;
    }
});

// Function to handle logout
const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
cerrarSesionBtn.addEventListener('click', function () {
    const fotoPerfil = document.getElementById('fotoperfil');
    const perfilUsuario = document.getElementById('perfilUsuario');
    fotoPerfil.src = './assets/icon/usuario.png';
    perfilUsuario.src = './assets/icon/usuario.png';

    sessionStorage.removeItem('usuarioData');
    localStorage.removeItem('rutaImagenPerfil');

    window.location.href = './home.html';
});


function cargarPeliculas() {
    const url = `${urlbase}/Cine/peliculas`;


    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar las películas: ${response.statusText}`);
            }
            return response.json();
        })
        .then(peliculas => {

            console.log('Peliculas cargadas:', peliculas);

            mostrarPeliculas(peliculas);
            

            mostrarPeliculasCartelera(peliculas);
        })
        .catch(error => {
            console.error('Error al cargar las películas:', error);
        });
}


function mostrarPeliculas(peliculas) {
    const listaPeliculas = document.getElementById('scroll');
    if (!listaPeliculas) {
        console.error('El contenedor de películas no se encuentra en el DOM.');
        return;
    }

    listaPeliculas.innerHTML = '';
    const peliculasAMostrar = peliculas.slice(41, 49);

    peliculasAMostrar.forEach((pelicula, index) => {
        const peliculaElemento = document.createElement('div');
        peliculaElemento.classList.add('relative', 'flex-shrink-0');

        const imagenPelicula = document.createElement('img');
        imagenPelicula.src = pelicula.fotoPoster;
        imagenPelicula.alt = pelicula.titulo;
        imagenPelicula.classList.add('mr-3', 'h-72', 'w-64', 'object-cover', 'max-sm:h-52', 'max-sm:w-28', 'rounded-lg');
        peliculaElemento.appendChild(imagenPelicula);

        const absoluteContainer = document.createElement('div');
        absoluteContainer.classList.add('absolute', 'top-0', 'left-0', 'flex', 'z-10', 'items-center', 'opacity-0', 'hover:opacity-100', 'flex-col', 'w-full', 'h-full', 'duration-500');

        const linkElement = document.createElement('a');
        linkElement.href = "#";
        linkElement.classList.add('mt-auto', 'w-full', 'max-sm:mb-3');

        linkElement.addEventListener('click', () => {
            sessionStorage.setItem('peliculaSeleccionada', JSON.stringify(pelicula));
            window.location.href = "./infoPeli.html";
        });

        const infoParagraph = document.createElement('p');
        infoParagraph.classList.add('text-white', 'font-bold', 'text-center', 'max-w-[16rem]', 'rounded-b-lg', 'max-h-[18rem]', 'bg-black', 'opacity-60', 'text-xl', 'cursor-pointer', 'max-sm:text-lg');
        infoParagraph.innerText = 'más info';

        linkElement.appendChild(infoParagraph);
        absoluteContainer.appendChild(linkElement);

        peliculaElemento.appendChild(absoluteContainer);

        listaPeliculas.appendChild(peliculaElemento);
    });
    
}
function mostrarPeliculasCartelera(peliculas) {
    const listaPeliculas = document.getElementById('cartelera');
    if (!listaPeliculas) {
        console.error('El contenedor de películas no se encuentra en el DOM.');
        return;
    }

    listaPeliculas.innerHTML = '';
    const peliculasAMostrar = peliculas.slice(50, 54);

    peliculasAMostrar.forEach((pelicula, index) => {
        const peliculaElemento = document.createElement('div');
        peliculaElemento.classList.add('relative', 'flex-shrink-0');

        const imagenPelicula = document.createElement('img');
        imagenPelicula.src = pelicula.fotoPoster;
        imagenPelicula.alt = pelicula.titulo;
        imagenPelicula.classList.add('mr-3', 'h-72', 'w-64', 'object-cover', 'max-sm:h-52', 'max-sm:w-28', 'rounded-lg');
        peliculaElemento.appendChild(imagenPelicula);

        const absoluteContainer = document.createElement('div');
        absoluteContainer.classList.add('absolute', 'top-0', 'left-0', 'flex', 'z-10', 'items-center', 'opacity-0', 'hover:opacity-100', 'flex-col', 'w-full', 'h-full', 'duration-500');

        const linkElement = document.createElement('a');
        linkElement.href = "#";
        linkElement.classList.add('mt-auto', 'w-full', 'max-sm:mb-3');

        linkElement.addEventListener('click', () => {
            sessionStorage.setItem('peliculaSeleccionada', JSON.stringify(pelicula));
            window.location.href = "./infoPeli.html";
        });

        const infoParagraph = document.createElement('p');
        infoParagraph.classList.add('text-white', 'font-bold', 'text-center', 'max-w-[16rem]', 'rounded-b-lg', 'max-h-[18rem]', 'bg-black', 'opacity-60', 'text-xl', 'cursor-pointer', 'max-sm:text-lg');
        infoParagraph.innerText = 'más info';

        linkElement.appendChild(infoParagraph);
        absoluteContainer.appendChild(linkElement);

        peliculaElemento.appendChild(absoluteContainer);

        listaPeliculas.appendChild(peliculaElemento);
    });

}
document.addEventListener('DOMContentLoaded', function () {

    cargarPeliculas();

    const siguienteBtn = document.getElementById('siguienteBtn');
    const atrasBtn = document.getElementById('atrasBtn');

    if (siguienteBtn && atrasBtn) {
        siguienteBtn.addEventListener('click', siguiente);
        atrasBtn.addEventListener('click', atras);
    }


    const scrollIzqBtn = document.getElementById('scrollIzqBtn');
    const scrollDerBtn = document.getElementById('scrollDerBtn');

    if (scrollIzqBtn && scrollDerBtn) {
        scrollIzqBtn.addEventListener('click', scrollIzq);
        scrollDerBtn.addEventListener('click', scrollDer);
    }

});

function obtenerPromocion(){
    fetch(`${urlbase}/Cine/obtenerOfertas`)
    .then(response => response.json())
            .then(json => {
                ofertas = json;
                imprimirPromo();
            })
            .catch(error => {
                console.error("Error al obtener las ofertas:", error);
        });
}

function imprimirPromo(){
    let contenedor=document.getElementById('carruselPromo');
    let contenedor2=document.getElementById('promo1');
    let contenedor3=document.getElementById('promo2');

    contenedor.innerHTML="";
    contenedor2.innerHTML="";
    contenedor3.innerHTML="";

    contenedor.innerHTML=`
            <img src="${ofertas[0].foto_inte}" alt=""
				class="block w-full h-full object-cover" id="car1img" />
			<img src="${ofertas[1].foto_inte}" alt=""
				class="hidden w-full h-full object-cover" id="car2img" />
			<img src="${ofertas[2].foto_inte}" alt=""
				class="hidden w-full h-full object-cover" id="car3img" />
			<img src="${ofertas[3].foto_inte}" alt=""
				class="hidden w-full h-full object-cover" id="car4img" />
    `;

    contenedor2.innerHTML=`
    <!--imagen promocion-->
						<img  class="w-full h-full object-cover max-sm:w-36"
							src="${ofertas[4].foto_inte}" alt="" />
						<div class="text-center max-sm:w-32 max-sm:whitespace-nowrap max-sm:text-ellipsis">
							<!--info promociom-->
							<p
								class="text-white max-h-[100px] mb-6 font-bold text-lg py-4 max-sm:text-sm text-ellipsis overflow-hidden max-sm:px-2">
								${ofertas[4].titulo} </br>
                                ${ofertas[4].detalles}
							</p>
							<!--boton de mas informacion-->
							<a href=""
								class="text-white font-bold text-lg bg-black rounded-lg cursor-pointer px-3 py-2 max-sm:text-sm">Más
								info</a>
						</div>
    `;

    contenedor3.innerHTML=`
    <!--imagen promocion-->
						<img  class="w-full h-full object-cover max-sm:w-36"
							src="${ofertas[5].foto_inte}" alt="" />
						<div class="text-center max-sm:w-32 max-sm:whitespace-nowrap max-sm:text-ellipsis">
							<!--info promociom-->
							<p
								class="text-white max-h-[100px] mb-6 font-bold text-lg py-4 max-sm:text-sm text-ellipsis overflow-hidden max-sm:px-2">
								${ofertas[5].titulo} </br>
                                ${ofertas[5].detalles}
							</p>
							<!--boton de mas informacion-->
							<a href=""
								class="text-white font-bold text-lg bg-black rounded-lg cursor-pointer px-3 py-2 max-sm:text-sm">Más
								info</a>
						</div>
    `;
}