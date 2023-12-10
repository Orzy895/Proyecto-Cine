package com.example.Cine.Controllers;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.Cine.Services.CineDb;
import com.example.Cine.modelos.Actor;
import com.example.Cine.modelos.Pelicula;
import com.example.Cine.modelos.SucursalesPelicula;
import com.example.Cine.modelos.Usuarios;
import com.example.Cine.modelos.Cartelera;
import com.example.Cine.modelos.Director;
import com.example.Cine.modelos.PasoQr;
import com.example.Cine.modelos.QrLink;
import com.fasterxml.jackson.databind.ObjectMapper;



@RestController
public class CineController {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final CineDb cineDb = new CineDb(); // Instantiate CineDb

    // Inicio de sesion
    @PostMapping("/Cine/login")
    public ResponseEntity<String> login(@RequestBody Usuarios usuario) {
        try {
            Usuarios userData = cineDb.obtenerDatosUsuario(usuario.getEmail(), usuario.getContrasena());

            if (userData != null) {
                String jsonResponse = objectMapper.writeValueAsString(userData);
                return ResponseEntity.ok(jsonResponse);
            } else {
                String jsonResponse = objectMapper.writeValueAsString(Map.of("error", "Usuario no encontrado"));
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(jsonResponse);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error durante el inicio de sesión: " + e.getMessage());
        }
    }

    // Registro
    @PostMapping("/Cine/registro")
    public ResponseEntity<String> registrarUsuario(@RequestBody Usuarios usuario) {
        try {
            String resultado = cineDb.registro(usuario);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar usuario");
        }
    }

    // Obtener información de registro
    @GetMapping("/Cine/registro")
    public ResponseEntity<List<Usuarios>> obtenerInformacionRegistro() {
        List<Usuarios> usuarios = cineDb.obtenerUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @PatchMapping("/Cine/actualizarUsuario")
    public ResponseEntity<String> actualizarUsuario(@RequestBody Usuarios nuevoUsuario) {
        try {
            cineDb.actualizarDatosUsuario(nuevoUsuario);
            return ResponseEntity.ok("Actualización exitosa");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar usuario");
        }
    }

    @PostMapping("Cine/agregar")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Integer> agregarPelicula(@RequestBody Pelicula pelicula) {
        CineDb cineDb = new CineDb();
        int id;
        id = cineDb.agregarPelicula(pelicula);
        return ResponseEntity.ok(id);
    }

    @GetMapping("Cine/peliculas")
    public List<Pelicula> cargarTodasLasPeliculas() {
        CineDb cineDb = new CineDb();
        return cineDb.obtenerTodasLasPeliculas();
    }

    @GetMapping("Cine/{id_pelicula}")
    public Pelicula buscarPeli(@PathVariable("id_pelicula") int idPelicula) {
        CineDb cineDb = new CineDb();
        return cineDb.buscarPelicula(idPelicula);
    }

    @PostMapping("/Cine/agregarActor")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Void> agregarActor(@RequestBody Actor actor) {
        CineDb cineDb = new CineDb();
        boolean resultado = cineDb.agregarActor(actor);

        if (resultado) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/Cine/actores/{idPelicula}")
    public List<Actor> cargarActoresPorPelicula(@PathVariable int idPelicula) {
        CineDb cineDb = new CineDb();
        return cineDb.obtenerActoresPorPelicula(idPelicula);
    }

    @GetMapping("/Cine/directores/{idPelicula}")
    public List<Director> cargarDirectoresPorPelicula(@PathVariable int idPelicula) {
        CineDb cineDb = new CineDb();
        return cineDb.obtenerDirectoresPorPelicula(idPelicula);
    }

    @GetMapping("/Cine/sucursales/{idPelicula}")
    public List<SucursalesPelicula> cargarSucursalesPorPelicula(@PathVariable int idPelicula) throws SQLException {
        CineDb cineDb = new CineDb();
        return cineDb.obtenerSucursalesPorPelicula(idPelicula);
    }

    @DeleteMapping("/Cine/eliminarPelicula/{idPelicula}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> eliminarPelicula(@PathVariable String idPelicula) {
        CineDb cineDb = new CineDb();
        cineDb.eliminarPelicula(idPelicula);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/Cine/agregarDirector")
    public ResponseEntity<String> agregarDirector(@RequestBody Director director) {
        boolean resultado = cineDb.agregarDirector(director);

        if (resultado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Director agregado exitosamente");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al agregar el director");
        }
    }

    @PostMapping("/Cine/agregarSucursalesPelicula")
    public String agregarSucursalesPelicula(@RequestBody SucursalesPelicula sucursalesPelicula) {
        if (cineDb.agregarSucursalesPelicula(sucursalesPelicula)) {
            return "SucursalesPelicula agregada correctamente";
        } else {
            return "Error al agregar SucursalesPelicula";
        }
    }

    @PutMapping("/Cine/actualizarPelicula/{idPeli}")
    public ResponseEntity<String> actualizarPelicula(@PathVariable int idPeli, @RequestBody Pelicula peliculaActualizada) {
        CineDb cineDb = new CineDb();
        boolean resultado = cineDb.actualizarPelicula(idPeli, peliculaActualizada);

        if (resultado) {
            return new ResponseEntity<>("Película actualizada con éxito", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Error: Película no encontrada", HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/Cine/actualizarActor/{idActor}")
    public ResponseEntity<String> actualizarActor(@PathVariable int idActor, @RequestBody Actor actorActualizado) {
        CineDb cineDb = new CineDb();
        boolean resultado = cineDb.actualizarActor(idActor, actorActualizado);

        if (resultado) {
            return new ResponseEntity<>("Actor actualizado con éxito", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Error: Actor no encontrado", HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/Cine/actualizarDirector/{idDirector}")
    public ResponseEntity<String> actualizarDirector(@PathVariable int idDirector, @RequestBody Director directorActualizado) {
        CineDb cineDb = new CineDb();
        boolean resultado = cineDb.actualizarDirector(idDirector, directorActualizado);

        if (resultado) {
            return new ResponseEntity<>("Director actualizado con éxito", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Error: Director no encontrado", HttpStatus.NOT_FOUND);
        }
    }

     @PutMapping("/Cine/actualizarEstadoSucursal/")
    public ResponseEntity<String> actualizarEstadoSucursal(@RequestBody SucursalesPelicula Sucursales_Pelicula) {

        boolean result = cineDb.actualizarEstadoSucursalPorPelicula(Sucursales_Pelicula);

        if (result) {
            return ResponseEntity.ok("Estado de sucursales actualizado con éxito");
        } else {
            return ResponseEntity.badRequest().body("Error al actualizar el estado de las sucursales");
        }
    }

     @GetMapping("/Cine/peliculasPorSucursal/{idSucursal}")
    public List<Pelicula> obtenerPeliculasPorSucursal(@PathVariable int idSucursal) {
        return cineDb.obtenerPeliculasPorSucursal(idSucursal);
    }
    // Obtener información de cartelera

    @GetMapping("/Cine/cartelera")
    public List<Cartelera> getCartelera(){
        CineDb cineDb = new CineDb();
        return cineDb.getCartelera();
    }

    // Obtener información de paso 1

    // Obtener información de paso 2

    // Obtener información de paso 3

    // Obtener información de paso 4 compra-finalqr


    @GetMapping("/Cine/datosQr/{codigoConfirmacion}")
    public PasoQr getDatosqr(@PathVariable("codigoConfirmacion") String codigoConfirmacion) {
        CineDb cineDb = new CineDb();
        return cineDb.getDatosqr(codigoConfirmacion);
    }

    // Para la pagina destino cuando escaneen el qr
    @GetMapping("/Cine/qr_target/{codigoConfirmacion}")
    public QrLink getObjLink(@PathVariable("codigoConfirmacion") String codigoConfirmacion) {
        CineDb cineDb = new CineDb();
        return cineDb.getQrLink(codigoConfirmacion);
    }




}