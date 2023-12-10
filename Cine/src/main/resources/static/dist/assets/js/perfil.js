const urlbase="http://127.0.0.1:8080";
document.addEventListener('DOMContentLoaded', function () {
    const usuarioDataString = sessionStorage.getItem('usuarioData');

    if (usuarioDataString) {
        const usuarioData = JSON.parse(usuarioDataString);

        document.getElementById('nombreNavBar').innerText = usuarioData.nombre;
        document.getElementById('apellidoNavBar').innerText = usuarioData.apellido;

        document.getElementById('nombreDatos').innerText = usuarioData.nombre;
        document.getElementById('apellidoDatos').innerText = usuarioData.apellido;
        document.getElementById('fechaNacimiento').innerText = usuarioData.fechaNacimiento;

        if (usuarioData.email) {
            document.getElementById('email').innerText = usuarioData.email;
        } else {
            console.error('Error: El campo "email" en usuarioData está vacío o undefined.');
        }

        document.getElementById('telefono').innerText = usuarioData.telefono;

        console.log('Datos del usuario:', usuarioData);


        if (usuarioData.tipoUsuario === "Admin") {

            document.getElementById('reporte').style.display = 'block';
            document.getElementById('Peliculas').style.display = 'none';
        } else {

            document.getElementById('Peliculas').style.display = 'block';
        }

    } else {
        console.error('Error: Datos del usuario no encontrados en sessionStorage');
    }

    const fotoPerfil = document.getElementById('fotoperfil');
    const perfilUsuario = document.getElementById('perfilUsuario');
    const rutaImagenAlmacenada = localStorage.getItem('rutaImagenPerfil');

    if (fotoPerfil && perfilUsuario && rutaImagenAlmacenada) {
        fotoPerfil.src = rutaImagenAlmacenada;
        perfilUsuario.src = rutaImagenAlmacenada;
    }


    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    cerrarSesionBtn.addEventListener('click', function () {

        sessionStorage.removeItem('usuarioData');

        window.location.href = './home.html';
    });
});


let spanNombre = document.getElementById('nombreDatos');
let spanApellido = document.getElementById('apellidoDatos');
let spanFecha = document.getElementById('fechaNacimiento');
let spanEmail = document.getElementById('email')
let spanTel = document.getElementById('telefono')
let cambiado = false;

function Cambios(span) {
    let currentSpan;
    let input = document.createElement("input");
    if (span == 1) {
        currentSpan = spanNombre;
        input.setAttribute("type", "text");
        input.setAttribute("id", "nombreDatos")
    }
    else if (span == 2) {
        currentSpan = spanApellido;
        input.setAttribute("type", "text");
        input.setAttribute("id", "apellidoDatos")
    }
    else if (span == 3) {
        currentSpan = spanFecha;
        input.setAttribute("type", "date");
        input.setAttribute("id", "fechaNacimiento")
    }
    else if (span == 4) {
        currentSpan = spanEmail;
        input.setAttribute("type", "email");
        input.setAttribute("id", "email")
    }
    else if (span == 5) {
        currentSpan = spanTel
        input.setAttribute("type", "tel");
        input.setAttribute("id", "telefono")
    }
    input.value = currentSpan.textContent;
    input.required = true;
    currentSpan.parentNode.replaceChild(input, currentSpan)
    cambiado = true;
}

function deshacerCambios(input, text) {
    if (input.tagName === "INPUT") {
        let spanElement = document.createElement("span");
        spanElement.textContent = input.value;
        spanElement.setAttribute("id", text)
        input.parentNode.replaceChild(spanElement, input);
    }
}
function obtenerDatosDelUsuario() {
    const usuarioDataString = sessionStorage.getItem('usuarioData');

    if (!usuarioDataString) {
        console.error('Error: Datos del usuario no encontrados en sessionStorage');
        return null; // Otra opción podría ser devolver un objeto vacío ({}) o algún valor predeterminado
    }

    return JSON.parse(usuarioDataString);
}
async function actualizar() {
    // Obtener datos del usuario desde sessionStorage
    const usuarioData = obtenerDatosDelUsuario();

    if (!usuarioData) {
        // Aquí puedes manejar el caso en el que no se encuentren datos del usuario
        console.error('Error: Datos del usuario no encontrados.');
        return;
    }

    const usuarioId = usuarioData.id_usuario;
    const dataActualizada = { ...usuarioData };

    // Actualizar todos los campos con los valores actuales del formulario
    dataActualizada.nombre = document.getElementById('nombreDatos').value;
    dataActualizada.apellido = document.getElementById('apellidoDatos').value;
    dataActualizada.fechaNacimiento = document.getElementById('fechaNacimiento').value;
    dataActualizada.email = document.getElementById('email').value;
    dataActualizada.telefono = document.getElementById('telefono').value;

    // Verificar si algún campo ha cambiado
    const camposCambiados = Object.keys(dataActualizada).filter(campo => dataActualizada[campo] !== usuarioData[campo]);

    if (camposCambiados.length === 0) {
        alert('No se han realizado cambios.');
        return;
    }

    try {
        const response = await fetch(`${urlbase}/Cine/actualizarUsuario`, {
            method: 'PATCH', // Utiliza el método PATCH para actualizaciones parciales
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataActualizada),
        });

        
        if (response.ok) {
            
            sessionStorage.setItem('usuarioData', JSON.stringify(dataActualizada));

            alert('Datos del usuario actualizados correctamente.');

            // Recargar la página después de una actualización exitosa
            window.location.reload();
        } else {
            // Manejar errores
            try {
                const jsonResponse = await response.json();
                console.error('Error al actualizar los datos del usuario:', jsonResponse.error);
                alert('Error al actualizar los datos del usuario. Por favor, inténtelo de nuevo.');
            } catch (error) {
                console.error('Error al actualizar los datos del usuario:', await response.text());
                alert('Error al actualizar los datos del usuario. Por favor, inténtelo de nuevo.');
            }
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red. Por favor, inténtelo de nuevo.');
    }
}


function obtenerUsuarioId() {
    const usuarioDataString = sessionStorage.getItem('usuarioData');
    if (usuarioDataString) {
        const usuarioData = JSON.parse(usuarioDataString);
        return usuarioData.id_usuario || null;  // Asegúrate de manejar el caso donde id_usuario puede ser nulo
    }
    return null;
}

function restaurarFotoPerfilOriginal() {
    const perfilUsuario = document.getElementById('perfilUsuario');
    if (perfilUsuario) {
        perfilUsuario.src = "./assets/icon/usuario.png";
    }

    // Reset selector image to default
    const selectorImage = document.getElementById('selectorImage');
    if (selectorImage) {
        selectorImage.src = "./assets/icon/usuario.png";
    }
}

function cambiarFotoPerfil(imagenSeleccionada) {
    const nuevaRutaImagen = imagenSeleccionada.src;

    const fotoPerfil = document.getElementById('fotoperfil');
    if (fotoPerfil) {
        fotoPerfil.src = nuevaRutaImagen;
    }

    sessionStorage.setItem('rutaImagenPerfil', nuevaRutaImagen);

    const perfilUsuario = document.getElementById('perfilUsuario');
    if (perfilUsuario) {
        perfilUsuario.src = nuevaRutaImagen;
    }

    // Update selector image
    const selectorImage = document.getElementById('selectorImage');
    if (selectorImage) {
        selectorImage.src = nuevaRutaImagen;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const rutaImagenPerfil = sessionStorage.getItem('rutaImagenPerfil');
    const perfilUsuario = document.getElementById('perfilUsuario');

    if (perfilUsuario && rutaImagenPerfil) {
        perfilUsuario.src = rutaImagenPerfil;
    } else {
        restaurarFotoPerfilOriginal();
    }
});
function redirectToReporte() {
    window.location.href = 'reporte.html';
}

function redirectToFormulario() {
    window.location.href = 'formulario.html';
}