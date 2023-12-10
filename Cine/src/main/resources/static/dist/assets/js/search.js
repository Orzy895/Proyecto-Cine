const urlbase = "http://127.0.0.1:8080";
const peliculasPorContenedor = [];

async function cargarPeliculas() {
    try {
        const response = await fetch(`${urlbase}/Cine/peliculas`);
        
        if (!response.ok) {
            throw new Error(`Error al cargar las películas. Código de estado: ${response.status}`);
        }

        const peliculas = await response.json();

        console.log("Películas cargadas:", peliculas);

        peliculasPorContenedor.length = 0;

        for (let i = 0; i < peliculas.length; i += 4) {
            peliculasPorContenedor.push(peliculas.slice(i, i + 4));
        }

        peliculasPorContenedor.forEach((peliculasContenedor, index) => {
            cargarPeliculasEnHTML(peliculasContenedor, `movie-container${index + 1}`);
        });
    } catch (error) {
        console.error("Error al cargar las películas:", error.message);
    }
}
async function mostrarPeliculaAleatoria() {
    try {
        // Obtener todas las películas
        const todasLasPeliculas = await obtenerTodasLasPeliculas();

        // Función para actualizar la película actual
        let posicionActual = 0;
        async function actualizarPeliculaActual() {
            // Obtener la película actual
            const peliculaActual = todasLasPeliculas[posicionActual];

            // Incrementar la posición para la próxima vez
            posicionActual = (posicionActual + 1) % todasLasPeliculas.length;

            // Actualizar la imagen y detalles en el HTML
            const imgPeliculaActual = document.getElementById('pelicula-aleatoria');
            if (imgPeliculaActual) {
                imgPeliculaActual.src = peliculaActual.fotoPoster;
                imgPeliculaActual.alt = peliculaActual.titulo;
                imgPeliculaActual.classList.add('object-scale-down', 'h-[600px]', 'w-[600px]', 'mb-4', 'rounded-lg');
            }

            const generoDuracion = document.getElementById('genero-duracion');
            if (generoDuracion) {
                generoDuracion.innerHTML = `${peliculaActual.titulo}<br>${peliculaActual.genero}<br>${peliculaActual.duracion}`;
            }

            // Update the href in the <a> tag to linkInfo
            const linkInfo = document.getElementById('linkInfo');
            if (linkInfo) {
                linkInfo.href = peliculaActual.linkInfo;
            }
        }

        // Mostrar la primera película
        await actualizarPeliculaActual();

        // Establecer un intervalo para cambiar la película cada 3 segundos
        setInterval(async () => {
            await actualizarPeliculaActual();
        }, 3000);

        // Add event listener to the "Más Información" button
        const masInformacionBtn = document.getElementById('masInformacionBtn');
        if (masInformacionBtn) {
            masInformacionBtn.addEventListener('click', () => {
                // Acceder a la película actual después de la actualización
                const peliculaActual = todasLasPeliculas[(posicionActual - 1 + todasLasPeliculas.length) % todasLasPeliculas.length];
                sessionStorage.setItem('peliculaSeleccionada', JSON.stringify(peliculaActual));
                // Redirect to infoPeli.html
                window.location.href = './infoPeli.html';
            });
        }

    } catch (error) {
        console.error('Error al mostrar película actual:', error);
    }
}

document.addEventListener('DOMContentLoaded', mostrarPeliculaAleatoria);


async function realizarBusqueda() {
    const formularioBusqueda = document.getElementById('search-form');
    const inputBusqueda = document.getElementById('busqueda');
    const generoSelect = document.getElementById('Genero');
    const categoriaSelect = document.getElementById('Categorias');
    const contenedorResultados = document.getElementById('resultados-busqueda');

    let resultadosAnteriores = []; // Almacena los resultados de la búsqueda anterior

    const buscarPeliculas = async () => {
        const terminoBusqueda = inputBusqueda.value.trim();
        const generoSeleccionado = generoSelect.value;
        const categoriaSeleccionada = categoriaSelect.value;
    
        if (terminoBusqueda !== '' || generoSeleccionado !== '' || categoriaSeleccionada !== '') {
            try {
                // Limpiar resultados anteriores solo si hay nuevos resultados
                if (contenedorResultados.firstChild) {
                    limpiarResultadosAnteriores();
                }
    
                ocultarContenedoresPeliculas();
                const todasLasPeliculas = await obtenerTodasLasPeliculas();
    
                // Filtrar por término de búsqueda
                let resultadosBusqueda = todasLasPeliculas;
                if (terminoBusqueda !== '') {
                    resultadosBusqueda = resultadosBusqueda.filter(pelicula =>
                        pelicula.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase())
                    );
                }
    
                // Filtrar por género
                if (generoSeleccionado.toLowerCase() !== 'all' && generoSeleccionado !== '') {
                    resultadosBusqueda = resultadosBusqueda.filter(pelicula =>
                        pelicula.genero.split('/').some(genero =>
                            genero.toLowerCase() === generoSeleccionado.toLowerCase()
                        )
                    );
                }
    
                // Filtrar por categoría
                if (categoriaSeleccionada.toLowerCase() !== 'all' && categoriaSeleccionada !== '') {
                    resultadosBusqueda = resultadosBusqueda.filter(pelicula =>
                        pelicula.clasificacion.toLowerCase() === categoriaSeleccionada.toLowerCase()
                    );
                }
    
                if (resultadosBusqueda.length > 0) {
                    contenedorResultados.style.display = 'flex';
    
                    const encabezado = document.createElement('h4');
                    encabezado.classList.add('px-6', 'py-2', 'bg-transparent', 'hover:bg-Mulled-Cider', 'focus:bg-Mulled-Cider', 'opacity-80', 'focus:text-black', 'text-white', 'rounded-xl', 'text-2xl', 'right-150', 'mb-20', 'text-left');
                    encabezado.textContent = 'Resultados de Búsqueda:';
                    contenedorResultados.appendChild(encabezado);
    
                    // Variable contador para identificar contenedores
                    let contadorContenedor = 1;
    
                    for (let i = 0; i < resultadosBusqueda.length; i += 4) {
                        // Crear un nuevo contenedor para el grupo de películas
                        const contenedorPeliculas = document.createElement('div');
                        contenedorPeliculas.classList.add('contenedor-grupo-peliculas');
    
                        // Obtener el grupo de hasta 4 películas
                        const grupoPeliculas = resultadosBusqueda.slice(i, i + 4);
    
                        // Cargar las películas en el nuevo contenedor
                        cargarPeliculasEnHTML(grupoPeliculas, `resultados-busqueda${contadorContenedor}`);
    
                        // Incrementar el contador solo si hay películas en el grupo
                        if (grupoPeliculas.length > 0) {
                            contadorContenedor++;
                            mostrarContenedoresBusqueda();
                        }
    
                        // Agregar el contenedor al resultado
                        contenedorResultados.appendChild(contenedorPeliculas);
                    }
    
                    // Almacenar los resultados de la búsqueda actual
                    resultadosAnteriores = resultadosBusqueda;
                } else {
                    contenedorResultados.style.display = 'none';
                    resultadosAnteriores = []; // Limpiar resultados anteriores si no hay resultados
                }
    
                // Limpiar el contenido del campo de búsqueda
                inputBusqueda.value = '';
            } catch (error) {
                console.error('Error al realizar la búsqueda:', error);
            }
        }
    };

    // Agregar eventos change
    generoSelect.addEventListener('change', buscarPeliculas);
    categoriaSelect.addEventListener('change', buscarPeliculas);

    // Agregar evento submit al formulario
    formularioBusqueda.addEventListener('submit', async function (event) {
        event.preventDefault();
        buscarPeliculas();
    });
}
document.addEventListener('DOMContentLoaded', realizarBusqueda);
document.addEventListener('DOMContentLoaded', cargarPeliculas);
document.addEventListener('DOMContentLoaded', ocultarContenedoresBusqueda);

function limpiarResultadosAnteriores() {
    for (let i = 1; i <= 15; i++) {
        const contenedorResultados2 = document.getElementById(`resultados-busqueda`);
        const contenedorResultados = document.getElementById(`resultados-busqueda${i}`);
        if (contenedorResultados) {
            limpiarContenedor(contenedorResultados);
            limpiarContenedor(contenedorResultados2);
        }
    }
}

function limpiarContenedor(contenedor) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}



function ocultarContenedoresPeliculas() {
    const numeroDeContenedores = 15; // Ajusta según la cantidad de contenedores que tienes

    for (let i = 1; i <= numeroDeContenedores; i++) {
        const contenedorPeliculas = document.getElementById(`movie-container${i}`);
        
        if (contenedorPeliculas) {
            contenedorPeliculas.style.display = 'none';
        }
    }
}

function ocultarContenedoresBusqueda() {
    const numeroDeContenedores = 15; // Ajusta según la cantidad de contenedores que tienes

    for (let i = 1; i <= numeroDeContenedores; i++) {
        const contenedorPeliculas = document.getElementById(`resultados-busqueda${i}`);
        
        if (contenedorPeliculas) {
            contenedorPeliculas.style.display = 'none';
        }
    }
}
function mostrarContenedoresPeliculas() {
    const numeroDeContenedores = 15; // Ajusta según la cantidad de contenedores que tienes

    for (let i = 1; i <= numeroDeContenedores; i++) {
        const contenedorPeliculas = document.getElementById(`movie-container${i}`);
        
        if (contenedorPeliculas) {
            contenedorPeliculas.style.display = 'flex';
        }
    }
}
function mostrarContenedoresBusqueda() {
    const numeroDeContenedores = 15; // Ajusta según la cantidad de contenedores que tienes

    for (let i = 1; i <= numeroDeContenedores; i++) {
        const contenedorPeliculas = document.getElementById(`resultados-busqueda${i}`);
        
        if (contenedorPeliculas) {
            contenedorPeliculas.style.display = 'flex';
        }
    }
}
async function obtenerTodasLasPeliculas() {
    try {
        const response = await fetch(`${urlbase}/Cine/peliculas`);

        if (!response.ok) {
            throw new Error(`Error al obtener todas las películas. Código de estado: ${response.status}`);
        }

        const peliculas = await response.json();

        return peliculas || [];
    } catch (error) {
        console.error('Error al obtener todas las películas:', error.message);
        return [];
    }
}

function cargarPeliculasEnHTML(peliculas, contenedor) {
    const contenedorPeliculas = document.getElementById(contenedor);

    // Verificar si contenedorPeliculas es nulo
    if (!contenedorPeliculas) {
        console.error(`Contenedor ${contenedor} no encontrado.`);
        return;
    }

    peliculas.forEach((pelicula) => {
        // Crear el contenedor para cada película
        const divPelicula = document.createElement("div");
        divPelicula.classList.add("relative", "mb-20", "flex", "justify-center", "items-center", "w-52", "h-80"); // Definir un tamaño fijo

        // Crear la imagen de la película
        const imgPelicula = document.createElement("img");
        imgPelicula.src = pelicula.fotoPoster;
        imgPelicula.alt = pelicula.titulo;
        imgPelicula.classList.add("object-cover", "w-full", "h-full"); // Definir un tamaño fijo

        // Crear el contenedor para detalles
        const divDetalles = document.createElement("div");
        divDetalles.classList.add("absolute", "-top-1", "left-2", "flex", "z-10", "items-center", "opacity-0", "hover:opacity-100", "flex-col", "w-52", "h-full", "duration-500");

        // Crear el enlace y el botón
        const enlace = document.createElement("a");
        enlace.href = "#"; // Usamos # para evitar que la página se recargue
        enlace.classList.add("mt-auto", "w-full");

        // Agregamos un evento de clic al enlace
        enlace.addEventListener('click', () => {
            // Al hacer clic, almacenamos los datos de la película en sessionStorage
            sessionStorage.setItem('peliculaSeleccionada', JSON.stringify(pelicula));
            // Redirigimos a infoPeli.html
            window.location.href = "./infoPeli.html";
        });

        const botonVerAhora = document.createElement("button");
        botonVerAhora.classList.add("flex", "font-mono", "text-white", "text-xl", "ml-7", "transform", "-translate-x-1/1", "-translate-y-16", "bg-gradient-to-b", "from-[#9C6D46]", "to-[#684A31]", "p-2", "pr-4", "pl-4", "rounded-3xl", "opacity-80", "transition-opacity", "hover:opacity-75", "focus:opacity-75", "active:opacity-75", "z-50", "hover:text-white", "py-2", "px-4", "border-black-500", "hover:border-transparent");
        botonVerAhora.textContent = "Ver ahora";

        // Crear el párrafo de detalles
        const parrafoDetalles = document.createElement("p");
        parrafoDetalles.classList.add(
            "text-white",
            "font-mono",
            "text-left",
            "max-w-[16rem]", 
            "ml-0", 
            "p-0", 
            "overflow-x-hidden", 
            "whitespace-nowrap", 
            "rounded-b-lg",
            "max-h-[18rem]",
            "mb-3", 
            "bg-transparent",
            "opacity-60",
            "text-xl",
            "cursor-pointer",
            "max-sm:text-lg"
        );
        parrafoDetalles.innerHTML = `${pelicula.titulo}<br>${pelicula.genero}`;

        // Agregar elementos al DOM
        enlace.appendChild(botonVerAhora);
        enlace.appendChild(parrafoDetalles);
        divDetalles.appendChild(enlace);
        divPelicula.appendChild(imgPelicula);
        divPelicula.appendChild(divDetalles);

        // Aplicar clases para que coincidan con movie-container
        divPelicula.classList.add("mr-10", "max-w-xs");

        // Asignar películas al contenedor
        contenedorPeliculas.appendChild(divPelicula);
    });
}


async function ordenarAleatorio() {
    try {
        const todasLasPeliculas = await obtenerTodasLasPeliculas();

        // Ordenar de manera aleatoria
        const peliculasAleatorias = todasLasPeliculas.sort(() => Math.random() - 0.5);

        // Mostrar un máximo de 12 películas
        const peliculasMostradas = peliculasAleatorias.slice(0, 12);

        // Limpiar resultados anteriores
        limpiarResultadosAnteriores();

        // Ocultar movie-container del 5 en adelante
        ocultarContenedoresPeliculas(5);

        // Mostrar las películas en el contenedor
        const contenedorResultados = document.getElementById('resultados-busqueda');
        contenedorResultados.style.display = 'flex';

        // Variable contador para identificar contenedores
        let contadorContenedor = 1;

        for (let i = 0; i < peliculasMostradas.length; i += 4) {
            // Crear un nuevo contenedor para el grupo de películas
            const contenedorPeliculas = document.createElement('div');
            contenedorPeliculas.classList.add('contenedor-grupo-peliculas');

            // Obtener el grupo de hasta 4 películas
            const grupoPeliculas = peliculasMostradas.slice(i, i + 4);

            // Cargar las películas en el nuevo contenedor
            cargarPeliculasEnHTML(grupoPeliculas, `resultados-busqueda${contadorContenedor}`);

            // Incrementar el contador solo si hay películas en el grupo
            if (grupoPeliculas.length > 0) {
                contadorContenedor++;
                mostrarContenedoresBusqueda();
            }

            // Agregar el contenedor al resultado
            contenedorResultados.appendChild(contenedorPeliculas);
        }
    } catch (error) {
        console.error('Error al ordenar de manera aleatoria:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Agregar evento de clic al botón
    const btnOrdenarAleatorio = document.getElementById('comingsoon');
    if (btnOrdenarAleatorio) {
        btnOrdenarAleatorio.addEventListener('click', ordenarAleatorio);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Agregar evento de clic al botón
    const btnOrdenarAleatorio = document.getElementById('estreno');
    if (btnOrdenarAleatorio) {
        btnOrdenarAleatorio.addEventListener('click', ordenarAleatorio);
    }
});
document.addEventListener('DOMContentLoaded', realizarBusqueda);
document.addEventListener('DOMContentLoaded', cargarPeliculas);
document.addEventListener('DOMContentLoaded', ocultarContenedoresBusqueda);

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
