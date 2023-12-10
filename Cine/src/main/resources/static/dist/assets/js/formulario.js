const urlbase = 'http://localhost:8080';
let peliculas = [];
let editarPelis = [];
let actoresData = {
    "actores":[]
};
let actoresOriginales = [];
let directoresData = {
    "directores": []
};
let directoresOriginales = [];
let sucursales = [];
let sucursalesOriginales = [];
let contDirectorNuevo;
let contDirectorGuardado;
let contActorNuevo;
let contActorGuardado;
let accionDirector;

let titulo;
let duracion;
let sinopsis;
let clasificacion;
let genero;
let fotoPoster;
let calificacion;
let linkQR;
let linkInfo;

function scrollEditToBottom() {
    const containerEdit = document.getElementById("containerEdit");
    containerEdit.scrollTop = containerEdit.scrollHeight;
}
//Escucha para seleccionar todos los checkbox
document.getElementById('seleccionarTodos').addEventListener('change', function() {
    let checkboxes = document.getElementsByClassName('checkboxes');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = this.checked;
    }
});


//Escucha cuando le das click al boton y muestra el desplegable
document.getElementById('boton-flecha-abajo').addEventListener('click', function(){
    document.getElementById('dropdown').classList.remove('hidden');
    document.getElementById('bgDropdown').classList.remove('hidden');

    // Agregar un escucha al documento para cerrar el dropdown al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        let dropdown = document.getElementById('dropdown');

        // Verificar si el clic no ocurrió dentro del dropdown
        if (!dropdown.contains(event.target) && event.target !== document.getElementById('boton-flecha-abajo')) {
            dropdown.classList.add('hidden');
            document.getElementById('bgDropdown').classList.add('hidden');
        }
    });
});
function ocultarClickDropdwown(){
    document.getElementById('dropdown').classList.add('hidden');
    document.getElementById('bgDropdown').classList.add('hidden');
}
//Función para cargar todas las peliculas
function cargarPeliculas(filtro){
        
    if(filtro === 'all'){//Va a imprimir todas las peliculas cuando seleccione todas las sucursales
        fetch(`${urlbase}/Cine/peliculas`)
        .then((response) => {response.json()
        .then((json) => {
                peliculas = json;
                ImprimirPeliculas();
            });
        })
        .catch(error => {
            console.error("Error al obtener las películas:", error);
        });
    }else if(filtro === 'CVLS'){
        fetch(`${urlbase}/Cine/peliculasPorSucursal/${1}`)
            .then(response => response.json())
            .then(json => {
                peliculas = json;
                ImprimirPeliculas();
            })
            .catch(error => {
                console.error("Error al obtener las películas por sucursal:", error);
        });
    }else if(filtro === 'TOC'){
        fetch(`${urlbase}/Cine/peliculasPorSucursal/${2}`)
        .then(response => response.json())
        .then(json => {
            peliculas = json;
            ImprimirPeliculas();
        })
        .catch(error => {
            console.error("Error al obtener las películas por sucursal:", error);
        });
    }else if(filtro === 'HOW'){
        fetch(`${urlbase}/Cine/peliculasPorSucursal/${3}`)
            .then(response => response.json())
            .then(json => {
                peliculas = json;
                ImprimirPeliculas();
            })
            .catch(error => {
                console.error("Error al obtener las películas por sucursal:", error);
        });
    }else if(filtro === 'CPO'){
        fetch(`${urlbase}/Cine/peliculasPorSucursal/${4}`)
            .then(response => response.json())
            .then(json => {
                peliculas = json;
                ImprimirPeliculas();
            })
            .catch(error => {
                console.error("Error al obtener las películas por sucursal:", error);
        });
    }else if(filtro === 'CBT'){
        fetch(`${urlbase}/Cine/peliculasPorSucursal/${5}`)
            .then(response => response.json())
            .then(json => {
                peliculas = json;
                ImprimirPeliculas();
            })
            .catch(error => {
                console.error("Error al obtener las películas por sucursal:", error);
        });
    }else if(filtro === 'CHI'){
        fetch(`${urlbase}/Cine/peliculasPorSucursal/${6}`)
            .then(response => response.json())
            .then(json => {
                peliculas = json;
                ImprimirPeliculas();
            })
            .catch(error => {
                console.error("Error al obtener las películas por sucursal:", error);
        });
    }else if(filtro === 'COL'){
        fetch(`${urlbase}/Cine/peliculasPorSucursal/${7}`)
            .then(response => response.json())
            .then(json => {
                peliculas = json;
                ImprimirPeliculas();
            })
            .catch(error => {
                console.error("Error al obtener las películas por sucursal:", error);
        });
    }else if(filtro === 'VER'){
        fetch(`${urlbase}/Cine/peliculasPorSucursal/${8}`)
            .then(response => response.json())
            .then(json => {
                peliculas = json;
                ImprimirPeliculas();
            })
            .catch(error => {
                console.error("Error al obtener las películas por sucursal:", error);
        });
    }else{//Va a imprimir todas las peliculas al cargar la pagina
        fetch(`${urlbase}/Cine/peliculas`)
        .then((response) => {response.json()
        .then((json) => {
                peliculas = json;
                ImprimirPeliculas();
            });
        })
        .catch(error => {
            console.error("Error al obtener las películas:", error);
        });
    }
}

//ImprimirPeliculas
function ImprimirPeliculas(){
    let contenedor = document.getElementById('allMovies');
    contenedor.innerHTML = "";

    peliculas.forEach((pelicula) => {
        contenedor.innerHTML += MapearPeliculas(pelicula);
    });
}
//Mapear las peliculas
function MapearPeliculas(pelicula){
    return `
    <tr class="max-sm:relative">
        <td class="h-10 border-b border-gray-500 hover:border-black">
            <div class="table-row">
                <div class="table-cell w-8 h-5">
                    <label class="w-5 h-5 cursor-pointer overflow-hidden flex justify-center items-center rounded-sm bg-gray-600 max-sm:bg-gray-400">
                        <input type="checkbox" id="${pelicula.idPelicula}" class="checkboxes peer hidden">
                        <img 
							class="w-5 max-sm:w-4 h-5 max-sm:h-4 rounded-sm opacity-0 peer-checked:opacity-100 scale-0 transition-all z-20 duration-300 peer-checked:transition-all top-2 left-2 peer-checked:scale-100 peer-checked:duration-300"
							src="/Cine/src/main/resources/static/dist/assets/icon/cheque.png">
                    </label>
                </div>
                <div class="table-cell">
                    <p class="max-w-[400px] font-bold text-xl max-sm:text-base">${pelicula.titulo} #${pelicula.idPelicula}</p>
                </div>
                <div class="table-cell absolute left-[40%] max-sm:left-[90%]">
                    <button onclick="mostrarAddPeli('editarBtn', ${pelicula.idPelicula})" id="editarBtn" class="flex justify-center items-center">
                        <img class="w-5 h-5 hover:w-6 hover:h-6 max-sm:rotate-90 transition-all duration-300 "
                        src="/Cine/src/main/resources/static/dist/assets/icon/lapiz-editar.svg" alt="">
                        
                    </button>
                </div>
            </div>
        </td>
    </tr>
    `;
} 
//Cargar pelicula individual para editar
function cargarPeli(idPeli) {
    fetch(`${urlbase}/Cine/${idPeli}`)
        .then(response => {
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {

            editarPelis = data;
        })
        .catch(error => {
            console.error("Error al buscar la película:", error);
        });
}

//Logica para añadir la pelicula a la base de datos
function agregarPeli() {
    const peli = {
        "titulo": titulo,
        "sinopsis": sinopsis,
        "genero": genero,
        "linkQR": linkQR,
        "linkInfo": linkInfo,
        "clasificacion": clasificacion,
        "duracion": duracion,
        "fotoPoster": fotoPoster,
        "calificacion": calificacion
    };


    fetch(`${urlbase}/Cine/agregar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(peli),
    })
        .then(response => {
            const contentType = response.headers.get('Content-Type');
            if (response.ok && contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return null;
            }
        })
        .then(data => {
            if (data !== null) {
                console.log('Película guardada con éxito:', data);

                agregarActoresEnBaseDeDatos(data);
                agregarDirectoresEnBaseDeDatos(data);
                agregarSucursalesEnBaseDatosDeDatos(data);
            } else {
                console.log('Película guardada con éxito, pero la respuesta no es JSON o está vacía.');
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });

    setTimeout(() => {
        cargarPeliculas('all');
    }, 700);
}
 
//Logica para actualizar/modificar la pelicula en la base de datos
function actualizarPeli(){
    if (!editarPelis) {
        console.error("Error: No se ha cargado la información de la película a actualizar.");
        return;
    }

    const peliculaActualizada = {
        duracion: document.getElementById('duracion').value,
        sinopsis: document.getElementById('sinopsis').value,
        clasificacion: document.getElementById('clasificacion').value,
        genero: document.getElementById('genero').value,
        titulo: document.getElementById('titulo').value,
        linkQR: document.getElementById('linkQR').value,
        linkInfo: document.getElementById('linkInfo').value,
        calificacion: document.getElementById('calificacion').value,
        "fotoPoster": document.getElementById('foto_poster').value,
    };

    fetch(`${urlbase}/Cine/actualizarPelicula/${editarPelis.idPelicula}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(peliculaActualizada),
    })
    .then(response => {
        
        if (response.ok) {
            console.log('Película actualizada con éxito');
            
            console.error('Error al actualizar la película. Código de estado:', response.status);
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
    setTimeout(() => {
        cargarPeliculas('all');
    }, 700);
}

function verificarActores(){
    actoresData={
        "actores": []
    };
    
    for(let i = 0 ; i < contActorGuardado ; i++){
        let nombre = document.getElementById(`actorNombre${i+1}`).value;
        let apellido = document.getElementById(`actorApellido${i+1}`).value;
        let foto = document.getElementById(`foto${i+1}`).value;
        let nuevoActor = {
        "nombre": nombre || "" ,
        "apellido": apellido || "",
        "foto": foto || ""
        };
        actoresData.actores.push(nuevoActor);
    }
    
    for (let i = 0; i < actoresData.actores.length; i++) {
        if(actoresOriginales.length > i){
            actualizarActor(actoresOriginales[i].idActor, actoresData.actores[i]);
        }else{
            agregarActorIndividual(actoresOriginales[0].idPelicula, actoresData.actores[i]);
        }
    }
}

function actualizarActor(idActor, actorActualizado) {
    
    const url = `${urlbase}/Cine/actualizarActor/${idActor}`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(actorActualizado),
    })
        .then(response => {
            const contentType = response.headers.get('Content-Type');
            if (response.ok && contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return null;
            }
        })
        .then(data => {
            if (data !== null) {
                
                if (data.includes('Actor actualizado con éxito')) {
                    console.log('Actor actualizado con éxito');
                } else {
                    console.log('Error al actualizar el actor:', data);
                }
            } else {
                console.log('Error al actualizar el actor. La respuesta no es JSON o está vacía.');
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}

function verificarDirectores(){
    directoresData={
        "directores": []
    };
    for(let i = 0 ; i < contDirectorGuardado ; i++){
        let nombre = document.getElementById(`directorNombre${i+1}`).value;
        let apellido = document.getElementById(`directorApellido${i+1}`).value;
        let nuevoDirector = {
        "nombre": nombre || "" ,
        "apellido": apellido || ""
        };
        directoresData.directores.push(nuevoDirector);
    }
    
    for (let i = 0; i < directoresData.directores.length; i++) {
        if(directoresOriginales.length > i){
            actualizarDirector(directoresOriginales[i].idDirector, directoresData.directores[i]);
        }else{
            agregarDirectorIndividual(directoresOriginales[0].idPelicula, directoresData.directores[i]);
        }
    }
}

function actualizarDirector(idDirector, directorActualizado) {
    fetch(`${urlbase}/Cine/actualizarDirector/${idDirector}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(directorActualizado),
    })
    .then(response => {
        if (response.ok) {
            console.log('Director actualizado con éxito');
        } else {
            console.error('Error al actualizar el director:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
}


//Logica para eliminar la pelicula de la base de datos
function eliminarPelis(idPelicula) {
    fetch(`${urlbase}/Cine/eliminarPelicula/${idPelicula}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
    setTimeout(() => {
        cargarPeliculas('all'); 
    }, 700);
}

function botonEliminar(){
    const checkboxes = document.getElementsByClassName('checkboxes');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            const idPeliculaAEliminar = checkboxes[i].id;
            eliminarPelis(idPeliculaAEliminar);
        }
    }
}

function eliminarSucursal(){
    let idPelicula = sucursalesOriginales[0].idPelicula;
    
    fetch(`${urlbase}/Cine/eliminarSucursalPorPelicula/${idPelicula}`,{
        method: 'DELETE',
        headers:{
            'Content-Type':'application/json'
        },
    })
    .then(response =>{
        if(response.ok){
            console.log('Sucural eliminada con exito');
            agregarSucursalesEnBaseDatosDeDatos(idPelicula);
        }else{
            console.console.error('Error al eliminar sucursal:', response.statusText);
        }
        
    })
    .catch(error=>{
        console.error('Error al hacer la solicitud:', error);
    });
}

//Mostrar la ventana de añadir/editar peliculas
function mostrarAddPeli(accion, idPeli){
    if(document.getElementById('containerEliminar').classList.contains('hidden')){
        document.getElementById('editPeli').classList.remove('hidden');
    }else{
        document.getElementById('containerEliminar').classList.add('hidden');
        document.getElementById('editPeli').classList.remove('hidden');
    }
    let containerBtn = document.getElementById('containerBtn');
    let containerDirector = document.getElementById('containerFilmDirector');
    let containerActor = document.getElementById('containerActor');
    

    //Esto rellena el formulario dependiendo si es en añadir/editar
    if(accion === 'editarBtn'){
        accionDirector=accion;
        cargarPeli(idPeli);
        
        setTimeout(() => {
            document.getElementById('titulo').value = editarPelis.titulo;
            document.getElementById('duracion').value = editarPelis.duracion;
            document.getElementById('sinopsis').value = editarPelis.sinopsis;
            document.getElementById('clasificacion').value = editarPelis.clasificacion;
            document.getElementById('genero').value = editarPelis.genero;
            document.getElementById('foto_poster').value = editarPelis.fotoPoster;
            document.getElementById('calificacion').value = editarPelis.calificacion;
            document.getElementById('linkQR').value = editarPelis.linkQR;
            document.getElementById('linkInfo').value = editarPelis.linkInfo;
            //Directores
            directoresData ={
                "directores": []
            };
            containerDirector.innerHTML = "";
            contDirectorNuevo = 1;
            //Actores
            actoresData ={
                "actores": []
            };
            containerActor.innerHTML = "";
            contActorNuevo = 1;
            
            cargarActores(idPeli);
            cargarDirectores(idPeli);
            cargarSucursales(idPeli);
            
        }, 700);
    }else if(accion === 'agregarBtn'){
        accionDirector=accion;
        //Directores
        containerDirector.innerHTML = "";
        contDirectorNuevo = 1;
        directoresData ={
            "directores": []
        };
        containerDirector.innerHTML=`
            <input id="directorNombre${contDirectorNuevo}" onkeyup="agregarDirectoresEscribir(this.id)" type="text" placeholder="Nombre" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            <input id="directorApellido${contDirectorNuevo}" onkeyup="agregarDirectoresEscribir(this.id)" type="text" placeholder="Apellido" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
        `;
        //Actores
        containerActor.innerHTML = "";
        contActorNuevo = 1;
        actoresData ={
            "actores": []
        };
        containerActor.innerHTML = `
            <label for="actor" class="col-span-4 text-center text-white">Actor 1:</label>
            <input id ="actorNombre${contActorNuevo}" onkeyup="agregarActoresEscribir(this.id)" type="text" placeholder="Nombre" class="px-2 py-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            <input id ="actorApellido${contActorNuevo}" onkeyup="agregarActoresEscribir(this.id)" type="text" placeholder="Apellido" class="px-2 py-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            
            <label for="foto" class="col-span-4 text-center text-white">Foto:</label>
            <input id ="foto${contActorNuevo}" onkeyup="agregarActoresEscribir(this.id)" type="url" placeholder="URL" class="px-2 py-1 rounded-lg focus:outline-none  placeholder:font-bold col-span-4">
            <button onclick="agregarActores('agregarBtn')" type="button" class="w-20 px-2 py-1 relative top-[30%] left-[35%] col-span-4 rounded-lg text-white bg-Piano-Black">+ Añadir</button>
        `;
    }
    //Este es para mapear los botones de cancelar y añadir/editar
    containerBtn.innerHTML = "";
    containerBtn.innerHTML = realizarAccion(accion);
}

function cargarDirectores(idPeli) {
    fetch(`${urlbase}/Cine/directores/${idPeli}`)
        .then(response => response.json())
        .then(directores => {
            mostrarDirectores(directores);
            directoresOriginales = directores;
        })
        .catch(error => {
            console.error("Error al cargar los directores:", error);
        });
}

function mostrarDirectores(directores){
    let containerDirector = document.getElementById('containerFilmDirector');
    contDirectorGuardado = directores.length;

    containerDirector.innerHTML=`
        <input value="${directores[0].nombre}" id="directorNombre${contDirectorNuevo}" onkeyup="agregarDirectoresEscribir(this.id)" type="text" placeholder="Nombre" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
        <input value="${directores[0].apellido}" id="directorApellido${contDirectorNuevo}" onkeyup="agregarDirectoresEscribir(this.id)" type="text" placeholder="Apellido" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
    `;

    for(let i =  1 ; i < contDirectorGuardado ; i++){
        containerDirector.innerHTML+=`
            <input value="${directores[i].nombre}" id="directorNombre${i+1}" onkeyup="agregarDirectoresEscribir(this.id)" type="text" placeholder="Nombre" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            <input value="${directores[i].apellido}" id="directorApellido${i+1}" onkeyup="agregarDirectoresEscribir(this.id)" type="text" placeholder="Apellido" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            `;
    }
}



function cargarActores(idPeli) {
    fetch(`${urlbase}/Cine/actores/${idPeli}`)
        .then(response => response.json())
        .then(actores => {
            actoresOriginales = actores;
            mostrarActores(actores);
        })
        .catch(error => {
            console.error("Error al cargar los actores:", error);
        });
}

function mostrarActores(actores) {
    let containerActor = document.getElementById('containerActor');
    containerActor.innerHTML = "";
    contActorGuardado = actoresOriginales.length;
    for (let i = 0; i < actores.length; i++) {
        let actor = actores[i];
        
        containerActor.innerHTML += `
            <label for="actor" class="col-span-4 text-center text-white">Actor ${i + 1}:</label>
            <input value="${actor.nombre}" id="actorNombre${i + 1}" onkeyup="agregarActoresEscribir(this.id)" type="text" placeholder="Nombre" class="px-2 py-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            <input value="${actor.apellido}" id="actorApellido${i + 1}" onkeyup="agregarActoresEscribir(this.id)" type="text" placeholder="Apellido" class="px-2 py-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            
            <label for="foto" class="col-span-4 text-center text-white">Foto:</label>
            <input value="${actor.foto}" onkeyup="agregarActoresEscribir(this.id)" id="foto${i + 1}" type="url" placeholder="URL" class="px-2 py-1 rounded-lg focus:outline-none  placeholder:font-bold col-span-4">
            <button onclick="agregarActores('editarBtn')" type="button" class="w-20 px-2 py-1 relative top-[30%] left-[35%] col-span-4 rounded-lg text-white bg-Piano-Black">+ Añadir</button>
        `;
    }
}

function agregarTituloEscribir(idInputs){
    titulo=document.getElementById(idInputs).value;

}

function agregarDuracionEscribir(idInputs){
    duracion=document.getElementById(idInputs).value;
    
}

function agregarDescripcionEscribir(idInputs){
    sinopsis=document.getElementById(idInputs).value;
    
}
function agregarClasificacionEscribir(idInputs){
    clasificacion=document.getElementById(idInputs).value;
    
}
function agregarGeneroEscribir(idInputs){
    genero=document.getElementById(idInputs).value;
    
}
function agregarPosterEscribir(idInputs){
    fotoPoster=document.getElementById(idInputs).value;
    
}
function agregarCalificacionEscribir(idInputs){
    calificacion=document.getElementById(idInputs).value;
    
}
function agregarLinkQREscribir(idInputs){
    linkQR = document.getElementById(idInputs).value;
    
}
function agregarLinkInfoEscribir(idInputs){
    linkInfo = document.getElementById(idInputs).value;
    
}

function agregarDirectoresEscribir(idInputs){
    directoresData ={
        "directores": []
    };

    for(let i = 0 ; i < contDirectorNuevo ; i++){
        let nombre = document.getElementById(`directorNombre${i+1}`).value;
        let apellido = document.getElementById(`directorApellido${i+1}`).value;
        let nuevoDirector = {
        "nombre": nombre || "" ,
        "apellido": apellido || ""
        };
        directoresData.directores.push(nuevoDirector);
    }

}

function agregarActoresEscribir(idInputs){
    actoresData ={
        "actores": []
    };

    for(let i = 0 ; i < contActorNuevo ; i++){
        let nombre = document.getElementById(`actorNombre${i+1}`).value;
        let apellido = document.getElementById(`actorApellido${i+1}`).value;
        let foto = document.getElementById(`foto${i+1}`).value;
        let nuevoActor = {
        "nombre": nombre || "" ,
        "apellido": apellido || "",
        "foto": foto || ""
        };
        actoresData.actores.push(nuevoActor);
    }
}

function agregarDirectores(){
    let containerDirector = document.getElementById('containerFilmDirector');
    
    directoresData ={
      "directores": []
    };

    contDirectorGuardado = directoresOriginales.length;
    if(accionDirector === 'editarBtn'){
        for(let i = 0 ; i < contDirectorGuardado ; i++){
            let nombre = document.getElementById(`directorNombre${i+1}`).value;
            let apellido = document.getElementById(`directorApellido${i+1}`).value;
            let nuevoDirector = {
            "nombre": nombre || "" ,
            "apellido": apellido || ""
            };
            directoresData.directores.push(nuevoDirector);
        }

        for(let i = 0; i < 1 ; i++){
            containerDirector.innerHTML += `
                <input id="directorNombre${contDirectorGuardado+1}" onkeyup="agregarDirectoresEscribir(this.id)"  type="text" placeholder="Nombre" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
                <input id="directorApellido${contDirectorGuardado+1}" onkeyup="agregarDirectoresEscribir(this.id)"  type="text" placeholder="Apellido" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            `;
        }
        contDirectorGuardado++;
    }else{
        for(let i = 0 ; i < contDirectorNuevo ; i++){
            let nombre = document.getElementById(`directorNombre${i+1}`).value;
            let apellido = document.getElementById(`directorApellido${i+1}`).value;
            let nuevoDirector = {
            "nombre": nombre || "" ,
            "apellido": apellido || ""
            };
            directoresData.directores.push(nuevoDirector);
        }

        for(let i = 0; i < 1 ; i++){
            containerDirector.innerHTML += `
                <input id="directorNombre${contDirectorNuevo+1}" onkeyup="agregarDirectoresEscribir(this.id)"  type="text" placeholder="Nombre" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
                <input id="directorApellido${contDirectorNuevo+1}" onkeyup="agregarDirectoresEscribir(this.id)"  type="text" placeholder="Apellido" class="px-2 py-1 mx-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            `;
        }
    }

    for(let i = 0 ; i < directoresData.directores.length ; i++){
        document.getElementById(`directorNombre${i+1}`).value = directoresData.directores[i].nombre;
        document.getElementById(`directorApellido${i+1}`).value = directoresData.directores[i].apellido;
    }
    
    contDirectorNuevo++;
}

function agregarActores(accion){
    let containerActor = document.getElementById('containerActor');
    
    actoresData ={
      "actores": []
    };

    if(accion === 'editarBtn'){
        for(let i = 0 ; i < contActorGuardado ; i++){
            let nombre = document.getElementById(`actorNombre${i+1}`).value;
            let apellido = document.getElementById(`actorApellido${i+1}`).value;
            let foto = document.getElementById(`foto${i+1}`).value;
            let nuevoActor = {
                "nombre": nombre || "" ,
                "apellido": apellido || "",
                "foto": foto || ""
            };
            actoresData.actores.push(nuevoActor);
        }

        for(let i = 0; i < 1 ; i++){
            containerActor.innerHTML += `
            <label for="actor" class="col-span-4 text-center text-white">Actor ${contActorGuardado+1}:</label>
            <input id="actorNombre${contActorGuardado+1}" onkeyup="agregarActoresEscribir(this.id)" type="text" placeholder="Nombre" class="px-2 py-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            <input id="actorApellido${contActorGuardado+1}" onkeyup="agregarActoresEscribir(this.id)" type="text" placeholder="Apellido" class="px-2 py-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            
            <label for="foto" class="col-span-4 text-center text-white">Foto:</label>
            <input id="foto${contActorGuardado+1}" onkeyup="agregarActoresEscribir(this.id)" type="url" placeholder="URL" class="px-2 py-1 rounded-lg focus:outline-none  placeholder:font-bold col-span-4">
            <button onclick="agregarActores('editarBtn')" type="button" class="w-20 px-2 py-1 relative top-[30%] left-[35%] col-span-4 rounded-lg text-white bg-Piano-Black">+ Añadir</button>
            `;
        }
        contActorGuardado++;
    }else if(accion === 'agregarBtn'){
        for(let i = 0 ; i < contActorNuevo ; i++){
            let nombre = document.getElementById(`actorNombre${i+1}`).value;
            let apellido = document.getElementById(`actorApellido${i+1}`).value;
            let foto = document.getElementById(`foto${i+1}`).value;
            let nuevoActor = {
            "nombre": nombre || "" ,
            "apellido": apellido || "",
            "foto": foto || ""
            };
            actoresData.actores.push(nuevoActor);
        }

        for(let i = 0; i < 1 ; i++){
            containerActor.innerHTML += `
            <label for="actor" class="col-span-4 text-center text-white">Actor ${contActorNuevo+1}:</label>
            <input id="actorNombre${contActorNuevo+1}" onkeyup="agregarActoresEscribir(this.id)" type="text" placeholder="Nombre" class="px-2 py-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            <input id="actorApellido${contActorNuevo+1}" onkeyup="agregarActoresEscribir(this.id)" type="text" placeholder="Apellido" class="px-2 py-1 rounded-lg focus:outline-none placeholder:font-bold placeholder:text-center col-span-2">
            
            <label for="foto" class="col-span-4 text-center text-white">Foto:</label>
            <input id="foto${contActorNuevo+1}" onkeyup="agregarActoresEscribir(this.id)" type="url" placeholder="URL" class="px-2 py-1 rounded-lg focus:outline-none  placeholder:font-bold col-span-4">
            <button onclick="agregarActores('agregarBtn')" type="button" class="w-20 px-2 py-1 relative top-[30%] left-[35%] col-span-4 rounded-lg text-white bg-Piano-Black">+ Añadir</button>
            `;
        }
    }

    for(let i = 0 ; i < actoresData.actores.length ; i++){
        document.getElementById(`actorNombre${i+1}`).value = actoresData.actores[i].nombre;
        document.getElementById(`actorApellido${i+1}`).value = actoresData.actores[i].apellido;
        document.getElementById(`foto${i+1}`).value = actoresData.actores[i].foto;
    }
    contActorNuevo++;
    scrollEditToBottom();
}

function agregarActoresEnBaseDeDatos(nuevaPeli){

    for (let i = 0; i < actoresData.actores.length; i++) {
        let nombre = actoresData.actores[i].nombre;
        let apellido = actoresData.actores[i].apellido;
        let foto = actoresData.actores[i].foto;

        const actor ={
            "nombre": nombre,
            "apellido": apellido,
            "foto": foto,
            "idPelicula": nuevaPeli
        }
        
        fetch(`${urlbase}/Cine/agregarActor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actor),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            
            console.log('Respuesta del servidor:', data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
    }
    fetch(`${urlbase}/Cine/eliminarActoresPelicula/${nuevaPeli}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al eliminar asociaciones de actores: ${response.status}`);
        }
        for (let i = 0; i < actoresData.actores.length; i++) {
            let actor = actoresData.actores[i];
            
        }
    })
    .catch(error => {
        console.error('Error en la solicitud Fetch:', error);
    });
    
}
function agregarActorIndividual(idPeli, actor){
    
    const nuevoActor = {
        "nombre": actor.nombre,
        "apellido": actor.apellido,
        "foto": actor.foto,
        "idPelicula": idPeli
    }
    
    fetch(`${urlbase}/Cine/agregarActor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoActor),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    })

}
function agregarDirectoresEnBaseDeDatos(nuevaPeli){

    for (let i = 0; i < directoresData.directores.length; i++) {
        let nombreDirector = directoresData.directores[i].nombre;
        let apellidoDirector = directoresData.directores[i].apellido;

        const director ={
            "nombre": nombreDirector,
            "apellido": apellidoDirector,
            "idPelicula": nuevaPeli
        }
        
        fetch(`${urlbase}/Cine/agregarDirector`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(director),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            
            console.log('Respuesta del servidor:', data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
    }
    fetch(`${urlbase}/Cine/eliminarDirectoresPelicula/${nuevaPeli}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al eliminar asociaciones de directores: ${response.status}`);
        }
        for (let i = 0; i < directoresData.directores.length; i++) {
            let director = directoresData.directores[i];
        }
    })
    .catch(error => {
        console.error('Error en la solicitud Fetch:', error);
    });
    
}

function agregarDirectorIndividual(nuevaPeli, director){

    
    const nuevodirector ={
        "nombre": director.nombre,
        "apellido": director.apellido,
        "idPelicula": nuevaPeli
    }
    
    fetch(`${urlbase}/Cine/agregarDirector`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevodirector),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

}

function agregarSucursalesEnBaseDatosDeDatos(nuevaPeli) {
    for (let i = 0; i < sucursales.length; i++) {
        let id_sucursal = sucursales[i].idSucursal;

        const enviarSucursal = {
            "idSucursal": id_sucursal,
            "idPelicula": nuevaPeli
        };

        fetch(`${urlbase}/Cine/agregarSucursalesPelicula`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enviarSucursal)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al agregar SucursalesPelicula: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
        })
        .catch(error => {
            console.error('Error en la solicitud Fetch:', error);
        });
    }
    fetch(`${urlbase}/Cine/eliminarSucursalesPelicula/${nuevaPeli}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al eliminar asociaciones de sucursales: ${response.status}`);
        }
        for (let i = 0; i < sucursales.length; i++) {
            let id_sucursal = sucursales[i].idSucursal;
            const enviarSucursal = {
                "idSucursal": id_sucursal,
                "idPelicula": nuevaPeli
            };
        }
    })
    .catch(error => {
        console.error('Error en la solicitud Fetch:', error);
    });

}

//Ocultar la ventana de añadir/editar peliculas
function ocultarEditPeli(){
    document.getElementById('editPeli').classList.add('hidden');
    let formPeli = document.querySelectorAll('#formPeli input');
    document.getElementById('sinopsis').value="";
    //Limpiamos todos los input al cancelar
    formPeli.forEach(input => {
        input.value = "";
    });
    setTimeout(() => {
        sucursales=[];
    }, 1000);
    let buttonSucursal = document.getElementsByClassName('buttonSucursal');
    Array.from(buttonSucursal).forEach(boton => {
        boton.classList.add('hidden');
    });
}

//Escucha cuando un checkbox cambia
let checkSucursales = document.querySelectorAll('.checkSucursales');
// Itera sobre cada checkbox y agrega el eventListener
Array.from(checkSucursales).forEach(check => {
    check.addEventListener('change', function() {
        let buttonSucursal = document.getElementsByClassName('buttonSucursal');

            if (check.checked) {//Cuando un checbox esta marcado busca cual y lo muestra
                Array.from(buttonSucursal).forEach(button => {
                    if (check.getAttribute('name') === button.getAttribute('name')) {
                        button.classList.remove('hidden');
                    }
                });
            } else {//Cuando un checbox esta desmarcado busca cual y lo oculta
                Array.from(buttonSucursal).forEach(button => {
                    if (check.getAttribute('name') === button.getAttribute('name')) {
                        button.classList.add('hidden');
                    }
                });
            }
    });
});
//Funcion para mostrar las sucursales

function cargarSucursales(idPeli) {
    fetch(`${urlbase}/Cine/sucursales/${idPeli}`)
        .then(response => response.json())
        .then(sucursal => {
            sucursales=sucursal;
            sucursalesOriginales=sucursal;
            mostrarSucursales('editarBtn');
        })
        .catch(error => {
            console.error("Error al cargar las sucursales:", error);
        });
}

function mostrarSucursales(accion){
    document.getElementById('editSucursales').classList.remove('hidden');
    let checkSucursales = document.getElementsByClassName('checkSucursales');
    
    if (accion === 'editarBtn') {
        document.getElementById('editSucursales').classList.add('hidden');
        sucursales.forEach(sucursal => {
            const checkSucursal = Array.from(checkSucursales).find(element => element.getAttribute('name') === sucursal.idSucursal.toString());
            
            if (checkSucursal) {
                mostrarBtnSucursal(sucursal);
            }
        });
    } else{
        Array.from(checkSucursales).forEach(check => {
            check.checked = false;
        });
    }
    
    //Carga las sucursales
    for(let i = 0; i < sucursales.length;i++){
        for(let j = 0; j < checkSucursales.length;j++){
            if(checkSucursales[j].getAttribute('name') === sucursales[i].idSucursal.toString()){
                checkSucursales[j].checked = true;
            }
        }

    }
}
function mostrarBtnSucursal(data){
    checkSucursales.forEach(check => {
        if(check.getAttribute('name') === data.idSucursal.toString()){
            check.checked = true;
            ocultarSucursales();
            let buttonSucursal = document.getElementsByClassName('buttonSucursal');
            Array.from(buttonSucursal).forEach(button => {
                if (check.getAttribute('name') === button.getAttribute('name')) {
                    button.classList.remove('hidden');
                }
            });
        }
    });
}
//Funcion para ocultar las sucursales
function ocultarSucursales(){
    document.getElementById('editSucursales').classList.add('hidden');
    sucursales=[];
    let checkSucursales = document.getElementsByClassName('checkSucursales');
    for (let i = 0; i < checkSucursales.length; i++) {
        if(checkSucursales[i].checked){
            const sucur={
                "idSucursal": checkSucursales[i].getAttribute('name')
            }
            sucursales.push(sucur);
        }else{
            sucursales = sucursales.filter((eliminar) => eliminar !== checkSucursales[i].getAttribute('name'));
        }
    }
}
//Funcion para ocultar el boton de las sucursales por individual
function ocultarBtnSucursal(data){
    checkSucursales.forEach(check => {
        if(check.getAttribute('name') === data){
            check.checked = false;
            ocultarSucursales();
            let buttonSucursal = document.getElementsByClassName('buttonSucursal');
            Array.from(buttonSucursal).forEach(button => {
                if (check.getAttribute('name') === button.getAttribute('name')) {
                    button.classList.add('hidden');
                }
            });
        }
    });
}

//Dependiendo si le da al boton de agregar o editar llama a una funcion diferente
function realizarAccion(accion){
    if (accion === 'agregarBtn') {
        return `
        <div class="w-full h-[50%] flex justify-around relative">
            <button onclick="ocultarEditPeli(), scrollASeccion('containerPeliculas')" type="button" class="w-36 px-2 py-1 mx-1 relative top-8 rounded-2xl font-bold text-white bg-Buckeye-brown hover:bg-Brown-Sugar">Cancelar</button>
            <button onclick="agregarPeli(), ocultarEditPeli(), scrollASeccion('containerPeliculas')" type="button" class="w-36 px-2 py-1 mx-1 relative top-8 rounded-2xl font-bold text-white bg-Buckeye-brown hover:bg-Brown-Sugar">Añadir</button>
        </div>
        `;
      } else if (accion === 'editarBtn') {
        return `
        <div class="w-full h-[50%] flex justify-around relative">
            <button onclick="ocultarEditPeli(), scrollASeccion('containerPeliculas')" type="button" class="w-36 px-2 py-1 mx-1 relative top-8 rounded-2xl font-bold text-white bg-Buckeye-brown hover:bg-Brown-Sugar">Cancelar</button>
            <button onclick="actualizarPeli(), verificarActores(), verificarDirectores(), eliminarSucursal(), ocultarEditPeli(), scrollASeccion('containerPeliculas')" type="button" class="w-36 px-2 py-1 mx-1 relative top-8 rounded-2xl font-bold text-white bg-Buckeye-brown hover:bg-Brown-Sugar">Editar</button>
        </div>
        `;
      };
}

function mostrarContainerEliminar(){
    document.getElementById('containerEliminar').classList.remove('hidden');
}
function ocultarContainerEliminar(){
    document.getElementById('containerEliminar').classList.add('hidden');
}

function scrollASeccion(idSeccion) {
    const section = document.getElementById(idSeccion);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
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