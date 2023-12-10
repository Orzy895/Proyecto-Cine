const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });

    const handleSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "flex";
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "flex";
    };

    handleSlideButtons();

    imageList.addEventListener("scroll", () => {
        handleSlideButtons();
    });
};

window.addEventListener("load", initSlider);


document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay datos de película almacenados en sessionStorage
    const peliculaSeleccionada = sessionStorage.getItem('peliculaSeleccionada');


    if (peliculaSeleccionada) {
        // Parsear los datos de la película
        const datosPelicula = JSON.parse(peliculaSeleccionada);

        // Mostrar detalles de la película
        mostrarDetallesPelicula(datosPelicula);

        // Inicializar el slider después de cargar la página
        initSlider();
    } else {
        console.error('No se encontraron datos de la película seleccionada.');
    }
});

function mostrarDetallesPelicula(datosPelicula) {
    // Ejemplo: Actualizar el título de la película
    const tituloElemento = document.querySelector('#titulo-pelicula');
    if (tituloElemento) {
        tituloElemento.textContent = datosPelicula.titulo;
    }

    // Ejemplo: Actualizar la sinopsis de la película
    const sinopsisElemento = document.querySelector('#informacion-pelicula p');
    if (sinopsisElemento) {
        sinopsisElemento.textContent = datosPelicula.sinopsis;
    }

    // Ejemplo: Actualizar la imagen de la película y aplicar estilos adicionales
    const imagenElemento = document.querySelector('#imagen-pelicula');
    if (imagenElemento) {
        // Actualizar la ruta de la imagen
        imagenElemento.src = datosPelicula.fotoPoster;

        // Establecer dimensiones máximas para limitar el tamaño de la imagen
        const anchoMaximo = 309; // Ajusta según tus requisitos
        const altoMaximo = 406; // Ajusta según tus requisitos

        // Calcular dimensiones proporcionales para mantener la relación de aspecto
        let anchoProporcional = anchoMaximo;
        let altoProporcional = (anchoMaximo / datosPelicula.anchoOriginal) * datosPelicula.altoOriginal;

        // Verificar si la altura proporcional supera el límite máximo
        if (altoProporcional > altoMaximo) {
            altoProporcional = altoMaximo;
            anchoProporcional = (altoMaximo / datosPelicula.altoOriginal) * datosPelicula.anchoOriginal;
        }

        // Aplicar estilos adicionales y establecer dimensiones máximas
        imagenElemento.style.width = `${anchoProporcional}px`;
        imagenElemento.style.height = `${altoProporcional}px`;

        // Agregar otras clases de estilo si es necesario
        imagenElemento.classList.add('-mt-3', 'z-10', 'sm:-mt-20', 'sm:ml-7', 'md:max-w-[400px]');
    }
    // Ejemplo: Actualizar la duración de la película
    const duracionElemento = document.querySelector('#duracion-pelicula');
    if (duracionElemento) {
        duracionElemento.textContent = `${datosPelicula.duracion}`;
    }

    const playButton = document.getElementById('play-button');

    playButton.addEventListener('click', () => {
        const linkInfo = datosPelicula.linkInfo;

        if (linkInfo) {
            playButton.href= linkInfo, '_blank';
        } else {
            console.error('El parámetro linkInfo no está definido en los datos de la película.');
        }

        console.log('Detalles de la película:', datosPelicula);
    });
    const backgroundImage = document.getElementById('backgroundImage');
    if (backgroundImage) {
        backgroundImage.src = datosPelicula.fotoPoster;
    }
    const calificacionElemento = document.getElementById('calificacion');
    if (calificacionElemento) {
        calificacionElemento.textContent = datosPelicula.calificacion;
    }
    const genero = document.getElementById('genero');
    if (genero) {
        genero.textContent = datosPelicula.genero;
    }

    
    

    console.log('Detalles de la película:', datosPelicula);
}

document.addEventListener('DOMContentLoaded', async () => {
    const peliculaSeleccionada = sessionStorage.getItem('peliculaSeleccionada');

    if (peliculaSeleccionada) {
        const datosPelicula = JSON.parse(peliculaSeleccionada);

        mostrarDetallesPelicula(datosPelicula);

        if (datosPelicula.idPelicula !== undefined) {
            await mostrarDirectores(datosPelicula.idPelicula);
            await mostrarActores(datosPelicula.idPelicula); 
        } else {
            console.error('El id de la película no está definido.');
        }
    } else {
        console.error('No se encontraron datos de la película seleccionada.');
    }
});

async function mostrarDirectores(idPelicula) {
    const containerDirectores = document.getElementById('container-directores');

    try {
        const response = await fetch(`http://127.0.0.1:8080/Cine/directores/${idPelicula}`);

        if (!response.ok) {
            throw new Error(`Error al obtener los directores. Código de estado: ${response.status}`);
        }

        const directores = await response.json();

        if (directores.length > 0) {
            // Clear existing content
            containerDirectores.innerHTML = '';

            // Create and append director elements
            directores.forEach(director => {
                const pElement = document.createElement('p');
                pElement.textContent = `${director.nombre} ${director.apellido} `;
                containerDirectores.appendChild(pElement);
            });
        } else {
            console.log('No se encontraron directores para esta película.');
        }
    } catch (error) {
        console.error('Error al obtener los directores:', error.message);
    }
}
async function mostrarActores(idPelicula) {
    const containerActores = document.getElementById('container-actores');

    try {
        const response = await fetch(`http://127.0.0.1:8080/Cine/actores/${idPelicula}`);

        if (!response.ok) {
            throw new Error(`Error al obtener los actores. Código de estado: ${response.status}`);
        }

        const actores = await response.json();

        if (actores.length > 0) {
            // Crear un contenedor para los actores
            const actoresContainer = document.createElement('section');
            actoresContainer.id = 'container-actores';
            actoresContainer.classList.add('flex', 'items-center', 'justify-center', 'h-full', 'mt-6');

            // Crear un contenedor interno
            const container = document.createElement('div');
            container.classList.add('max-w-[1200px]', 'w-[75%]');

            // Agregar el contenedor interno al contenedor de actores
            actoresContainer.appendChild(container);

            // Crear un contenedor para el slider
            const sliderContainer = document.createElement('div');
            sliderContainer.classList.add('slider-wrapper', 'relative');

            // Agregar botones de navegación al slider
            sliderContainer.innerHTML = `
            <button id="prev-slide" class="material-symbols-rounded slide-button absolute left-[-35px] top-2/4 outline-none border-none scale-150 z-[5] text-white text-[2.2rem] items-center justify-center">chevron_left</button>
            <ul class="image-list flex space-x-4 overflow-x-auto " ></ul>
            <button id="next-slide" class="material-symbols-rounded slide-button absolute right-[-35px] top-2/4 outline-none border-none scale-150 z-[5] text-white flex text-[2.2rem] items-center justify-center">chevron_right</button>
        `;

            // Agregar el contenedor del slider al contenedor interno
            container.appendChild(sliderContainer);

            // Obtener la lista de imágenes del slider
            const imageList = sliderContainer.querySelector('.image-list');

            // Agregar elementos de actor al slider
            actores.forEach(actor => {
                const actorElement = document.createElement('li');
                actorElement.innerHTML = `
                    <img src="${actor.foto}" alt="${actor.nombre} ${actor.apellido}" class="image-item max-w-none w-[120px] h-[180px] object-cover md:w-[200px] md:h-[260px] lg:w-[220px] lg:h-[280px]">
                    <p>${actor.nombre} ${actor.apellido}</p>
                `;
                imageList.appendChild(actorElement);
            });

            // Limpiar el contenido existente
            containerActores.innerHTML = '';

            // Agregar el contenedor de actores al contenedor principal
            containerActores.appendChild(actoresContainer);

            // Inicializar el slider después de cargar los actores
            initSlider();
        } else {
            console.log('No se encontraron actores para esta película.');
        }
    } catch (error) {
        console.error('Error al obtener los actores:', error.message);
    }
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
