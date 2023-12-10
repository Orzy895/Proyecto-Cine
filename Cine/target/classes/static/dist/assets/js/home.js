//variable para saber la imagen actual
let carruselCurrent = 1;
//imagenes del carrusel
let img1 = document.getElementById('car1img')
let img2 = document.getElementById('car2img')
let img3 = document.getElementById('car3img')
let img4 = document.getElementById('car4img')
let img5 = document.getElementById('car5img')
//radio del carrusel
let rad1 = document.getElementById('car1rad')
let rad2 = document.getElementById('car2rad')
let rad3 = document.getElementById('car3rad')
let rad4 = document.getElementById('car4rad')
let rad5 = document.getElementById('car5rad')
//contenedor del scroll de trending
let scrollTrend = document.getElementById('scroll')
//funcion para ocultar imagen actual
function hide(number) {
    if (number == 1) {
        img1.classList.add('hidden')
    }
    else if (number == 2) {
        img2.classList.add('hidden')
    }
    else if (number == 3) {
        img3.classList.add('hidden')
    }
    else if (number == 4) {
        img4.classList.add('hidden')
    }
    else if (number == 5) {
        img5.classList.add('hidden')
    }
}
//funcion para mostrar imagen siguiente
function show(number) {
    if (number == 1) {
        img1.classList.remove('hidden')
        rad1.checked = true
    }
    else if (number == 2) {
        img2.classList.remove('hidden')
        rad2.checked = true
    }
    else if (number == 3) {
        img3.classList.remove('hidden')
        rad3.checked = true
    }
    else if (number == 4) {
        img4.classList.remove('hidden')
        rad4.checked = true
    }
    else if (number == 5) {
        img5.classList.remove('hidden')
        rad5.checked = true
    }
}
//funcion para quitarle el check a todos los radio
function uncheck() {
    rad1.checked = false;
    rad2.checked = false;
    rad3.checked = false;
    rad4.checked = false;
    rad5.checked = false;
}
//funcion para ir a la siguiente imagen del carrusel
function siguiente() {
    hide(carruselCurrent)
    if (carruselCurrent == 5) {
        carruselCurrent = 1
    }
    else {
        carruselCurrent += 1;
    }
    uncheck()
    show(carruselCurrent)
}
//funcion para ir al anterior imagen del carrusel
function atras() {
    hide(carruselCurrent)
    if (carruselCurrent == 1) {
        carruselCurrent = 5
    }
    else {
        carruselCurrent -= 1;
    }
    uncheck()
    show(carruselCurrent)
}

//funcionidad para los radio(cambiar imagen) del carrusel
function img1cambio() {
    hide(carruselCurrent)
    carruselCurrent = 1;
    img1.classList.remove('hidden')
}
function img2cambio() {
    hide(carruselCurrent)
    carruselCurrent = 2;
    img2.classList.remove('hidden')
}
function img3cambio() {
    hide(carruselCurrent)
    carruselCurrent = 3;
    img3.classList.remove('hidden')
}
function img4cambio() {
    hide(carruselCurrent)
    carruselCurrent = 4;
    img4.classList.remove('hidden')
}
function img5cambio() {
    hide(carruselCurrent)
    carruselCurrent = 5;
    img5.classList.remove('hidden')
}

//funcionalid del boton izquierdo del scroll en trending
function scrollIzq() {
    scrollTrend.scrollBy({
        left: -480,
        behavior: 'smooth'
    })
}
//funcionalidad del boton derecho del scroll en trending
function scrollDer() {
    scrollTrend.scrollBy({
        left: 480,
        behavior: 'smooth'
    })
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
