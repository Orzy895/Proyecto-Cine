package com.example.Cine.Controllers;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Cine.Services.CineDb;
import com.example.Cine.modelos.*;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "*")
public class CineController {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private  CineDb cineDb = new CineDb(); 
    public CineController(CineDb cineDb) {
        this.cineDb = cineDb;
    }

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

    
    @PostMapping("/Cine/enviarCorreoCompra")
public ResponseEntity<String> enviarCorreoCompra(@RequestBody Map<String, Object> data) {
    try {
        String correoUsuario = (String) data.get("correoUsuario");
        // Obtén la información de la compra
        PasoQr compra = objectMapper.convertValue(data.get("compra"), PasoQr.class);
        
        // Llama a la función existente que envía correos HTML
        cineDb.enviarCorreoHtml(correoUsuario, "Detalles de la compra", generarContenidoHTMLCompra(compra));
        
        return ResponseEntity.ok("Correo enviado exitosamente");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al enviar el correo");
    }
}

private String generarContenidoHTMLCompra(PasoQr compra) {
    return "<html><head>"
            + "<style>"
            + "body { background: linear-gradient(to bottom, #9C6D46, #684A31); color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 18px; } "
            + "img { max-width: 100%; height: auto; display: block; margin: 20px auto; }"
            + ".container { max-width: 600px; margin: 0 auto; }"
            + "h2, p { text-align: center; font-size: 24px; }"
            + "</style>"
            + "<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\">"
            + "</head><body style=\"background: linear-gradient(to bottom, #9C6D46, #684A31); color: white;\">"
            + "<div class=\"container\">"
            + "<h2 class=\"mt-5 text-white\">Detalles de tu compra en Filmania</h2>"
            + "<p class=\"bg-dark p-3 text-white\">Sede: <strong>" + compra.getSede() + "</strong></p>"
            + "<p class=\"bg-dark p-3 text-white\">Película: <strong>" + compra.getPelicula() + "</strong></p>"
            + "<p class=\"bg-dark p-3 text-white\">Sala: <strong>" + compra.getSala() + "</strong></p>"
            + "<p class=\"bg-dark p-3 text-white\">Fecha: <strong>" + compra.getFecha() + "</strong></p>"
            + "<p class=\"bg-dark p-3 text-white\">Hora: <strong>" + compra.getHora() + "</strong></p>"
            + "<p class=\"bg-dark p-3 text-white\">Boletos: <strong>" + compra.getBoletos() + "</strong></p>"
            + "<img src=\"https://i.postimg.cc/qqcJKxF4/zyro-image-2.png\" class=\"img-fluid\" alt=\"\">"
            + "</div>"
            + "</body></html>";
}



    // Registro
    @PostMapping("/Cine/registro")
    public ResponseEntity<String> registrarUsuario(@RequestBody Usuarios usuario) {
        try {
            String resultado = cineDb.registro(usuario);

            // Si el registro es exitoso, envía el correo de confirmación
            if ("Registro exitoso".equals(resultado)) {
                enviarCorreoConfirmacion(usuario.getCorreo(), usuario.getNombre(), usuario.getApellido());  
            }

            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar usuario");
        }
    }
    // Método para enviar correo de confirmación
    private void enviarCorreoConfirmacion(String correoUsuario, String nombre, String apellido) {
        String subject = "Registro exitoso";
        String body = "<html><head>"
        + "<style>body { background: linear-gradient(to bottom, #9C6D46, #684A31); color: white; font-family: Arial, sans-serif; } "
        + "img { max-width: 100%; height: auto; display: block; background-color: black; } "
        + ".container { max-width: 600px; margin: 0 auto; } "
        + "h2 { text-align: center; font-size: 24px; } "
        + "p { text-align: center; font-size: 18px; padding: 10px; background-color: #333; } "
        + "</style>"
        + "<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\">"
        + "</head><body style=\"background: linear-gradient(to bottom, #9C6D46, #684A31); color: white;\">"
        + "<div class=\"container\">"
        + "<h2 class=\"mt-5 text-white\">¡Bienvenido a tu cuenta en Filmania!</h2>"
        + "<p><strong>Gracias por Registrarte, " + nombre + " " + apellido + ".</strong></p>"
        + "</div>"
        + "<img src=\"https://i.postimg.cc/qqcJKxF4/zyro-image-2.png\" class=\"img-fluid\" alt=\"\">"
        + "</body></html>";
    
        cineDb.enviarCorreoHtml(correoUsuario, subject, body);
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

    @GetMapping("/Cine/peliculas")
    public List<Pelicula> cargarTodasLasPeliculas() {
        CineDb cineDb = new CineDb();
        return cineDb.obtenerTodasLasPeliculas();
    }

    @GetMapping("/Cine/{id_pelicula}")
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
    public ResponseEntity<String> actualizarPelicula(@PathVariable int idPeli,
            @RequestBody Pelicula peliculaActualizada) {
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
    public ResponseEntity<String> actualizarDirector(@PathVariable int idDirector,
            @RequestBody Director directorActualizado) {
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
    public List<Cartelera> getCartelera() {
        CineDb cineDb = new CineDb();
        return cineDb.getCartelera();
    }

    @GetMapping("/Cine/filtrarCarteleraPorID/{id}")
    public List<Cartelera> filtrarCarteleraPorTitulo(@PathVariable int ID) {
        CineDb cineDb = new CineDb();
        return cineDb.filtrarCarteleraPorID(ID);
    }

    @GetMapping("/Cine/filtrarCarteleraPorSucursal/{idSucursal}")
    public List<Cartelera> filtrarCarteleraPorSucursal(@PathVariable int idSucursal) {
        CineDb cineDb = new CineDb();
        return cineDb.filtrarCarteleraPorSucursal(idSucursal);
    }

    @GetMapping("/Cine/filtrarCarteleraPorGenero/{genero}")
    public List<Cartelera> filtrarCarteleraPorGenero(@PathVariable String genero) {
        CineDb cineDb = new CineDb();
        return cineDb.filtrarCarteleraPorGenero(genero);
    }

    @GetMapping("/Cine/filtrarCarteleraPorSucursalYGenero/{idSucursal}/{genero}")
    public List<Cartelera> filtrarCarteleraPorSucursalYGenero(@PathVariable int idSucursal,
            @PathVariable String genero) {
        CineDb cineDb = new CineDb();
        return cineDb.filtrarCarteleraPorSucursalYGenero(idSucursal, genero);
    }

    // Obtener información de paso 1
    @PostMapping("/Cine/crearTicket")
    public ResponseEntity<String> crearTicket(@RequestBody PasoQr obj) {
        CineDb cineDb = new CineDb();
        String resultado = cineDb.crearTicket(obj);

        if (resultado != null) {
            return ResponseEntity.ok(resultado);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while creating a ticket");
        }
    }

    // Obtener información de paso 21
    @GetMapping("/asientos/disponibilidad")
    public List<Asientos> obtenerAsientos() {
        return new CineDb().obtenerAsientos();
    }

    @PostMapping("/asientos/ocupar")
    public int insertarAsientos(@RequestBody List<Asientos> asientos) {
        int resultado = new CineDb().guardarAsientos(asientos);
        return resultado;
    }

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

    // Obtener Boletos x mes
    @GetMapping("/Cine/boletosXMes")
    public List<Boletos> BoletosXMes() {
        CineDb cineDb = new CineDb();
        return cineDb.BoletosXMes();
    }

    // Obtener Boletos x Mes x Sucursal
    @GetMapping("/Cine/boletosXMesXSucursal/{idSucursal}")
    public List<Boletos> BoletosXMesXSucursal(@PathVariable int idSucursal) {
        CineDb cineDb = new CineDb();
        return cineDb.BoletosXMesXSucursal(idSucursal);
    }

    // Obtener Boletos Totales
    @GetMapping("/Cine/BoletosTotales/{idSucursal}")
    public List<Boletos2> BoletosTotales(@PathVariable int idSucursal) {
        CineDb cineDb = new CineDb();
        return cineDb.BoletosTotales(idSucursal);
    }

    @GetMapping("/Cine/IngresosTotales")
    public List<Ingresos> IngresosTotales() {
        CineDb cineDb = new CineDb();
        return cineDb.IngresosTotales();
    }

    @GetMapping("/Cine/IngresosXMes")
    public List<Ingresos2> IngresosXMes() {
        CineDb cineDb = new CineDb();
        return cineDb.IngresosXMes();
    }

    @GetMapping("/Cine/IngresosTotalesXSucursal")
    public List<Ingresos3> IngresosTotalesXSucursal() {
        CineDb cineDb = new CineDb();
        return cineDb.IngresosTotalesXSucursal();
    }
    @GetMapping("/Cine/obtenerOfertas")
    public List<Oferta> obtenerOfertas(){
        CineDb cineDb = new CineDb();
        return cineDb.obtenerOfertas();
    }
}
