const urlbase="http://127.0.0.1:8080";
let rutaOriginalImagenPerfil;
document.addEventListener('DOMContentLoaded', function () {
    const usuarioDataString = sessionStorage.getItem('usuarioData');

    if (usuarioDataString) {
        const usuarioData = JSON.parse(usuarioDataString);
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

    rutaOriginalImagenPerfil = './assets/icon/usuario.png';

    if (fotoPerfil && perfilUsuario && rutaImagenAlmacenada) {
        fotoPerfil.src = rutaImagenAlmacenada;
        perfilUsuario.src = rutaImagenAlmacenada;
    }

    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    cerrarSesionBtn.addEventListener('click', function () {
        sessionStorage.removeItem('usuarioData');

        
        localStorage.setItem('rutaImagenPerfil', rutaOriginalImagenPerfil);
        fotoPerfil.src = rutaOriginalImagenPerfil;
        perfilUsuario.src = rutaOriginalImagenPerfil;

        window.location.href = './home.html';
    });
});


let spanNombre = document.getElementById('nombreDatos');
let spanApellido = document.getElementById('apellidoDatos');
let spanFecha = document.getElementById('fechaNacimiento');
let spanEmail = document.getElementById('email')
let spanTel = document.getElementById('telefono')
let cambiado = false;

function Cambios() {
    let inputNombre = document.createElement("input");
    inputNombre.setAttribute("type", "text");
    inputNombre.setAttribute("id", "nombreDatos")
    inputNombre.required = true;
    let inputApellido = document.createElement("input");
    inputApellido.setAttribute("type", "text");
    inputApellido.setAttribute("id", "apellidoDatos")
    inputApellido.required = true;
    let inputDOB = document.createElement("input");
    inputDOB.setAttribute("type", "date");
    inputDOB.setAttribute("id", "fechaNacimiento")
    inputDOB.required = true;
    let inputEmail = document.createElement("input");
    inputEmail.setAttribute("type", "email");
    inputEmail.setAttribute("id", "email")
    inputEmail.required = true;
    let inputTel = document.createElement("input");
    inputTel.setAttribute("type", "tel");
    inputTel.setAttribute("id", "telefono")
    inputTel.required = true;
    inputNombre.value = spanNombre.textContent;
    inputApellido.value = spanApellido.textContent;
    inputDOB.value = spanFecha.textContent;
    inputEmail.value = spanEmail.textContent;
    inputTel.value = spanTel.textContent;
    spanNombre.parentNode.replaceChild(inputNombre, spanNombre)
    spanApellido.parentNode.replaceChild(inputApellido, spanApellido)
    spanFecha.parentNode.replaceChild(inputDOB, spanFecha)
    spanEmail.parentNode.replaceChild(inputEmail, spanEmail)
    spanTel.parentNode.replaceChild(inputTel, spanTel)
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
            method: 'PATCH', 
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
        return usuarioData.id_usuario;
    }
    return null;
}


function cambiarFotoPerfil(imagenSeleccionada) {
    const nuevaRutaImagen = imagenSeleccionada.src;

    
    const fotoPerfil = document.getElementById('fotoperfil');
    if (fotoPerfil) {
        fotoPerfil.src = nuevaRutaImagen;
    }

    
    localStorage.setItem('rutaImagenPerfil', nuevaRutaImagen);

   
    const perfilUsuario = document.getElementById('perfilUsuario');
    if (perfilUsuario) {
        perfilUsuario.src = nuevaRutaImagen;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const rutaImagenPerfil = localStorage.getItem('rutaImagenPerfil');
    
    const perfilUsuario = document.getElementById('perfilUsuario');
    if (perfilUsuario && rutaImagenPerfil) {
        perfilUsuario.src = rutaImagenPerfil;
    }
});
}