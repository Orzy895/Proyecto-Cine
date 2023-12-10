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
