package com.example.Cine.Services;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.Cine.modelos.Actor;
import com.example.Cine.modelos.Asientos;
import com.example.Cine.modelos.Boletos;
import com.example.Cine.modelos.Boletos2;
import com.example.Cine.modelos.Pelicula;
import com.example.Cine.modelos.SucursalesPelicula;
import com.example.Cine.modelos.Usuarios;
import com.example.Cine.modelos.PasoQr;
import com.example.Cine.modelos.QrLink;
import com.example.Cine.modelos.Cartelera;
import com.example.Cine.modelos.Director;
import com.example.Cine.modelos.Ingresos;
import com.example.Cine.modelos.Ingresos2;
import com.example.Cine.modelos.Ingresos3;
import com.example.Cine.modelos.Oferta;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
public class CineDb {
    Connection cn;

    public CineDb() {
        cn = new Conexion().openDb();
    }

    // Pantalla de inicio de sesion
    public String login(String correo, String contrasena) {
        String resultado = "Iniciando Sesion...";
        try {
            Statement stmt = cn.createStatement();
            String query = "SELECT * FROM Usuario";
            ResultSet result = stmt.executeQuery(query);
            boolean usuarioEncontrado = false;

            while (result.next()) {
                Usuarios usuario = new Usuarios(result.getString("email"), result.getString("contrasena"));

                if (correo != null && correo.equals(usuario.getEmail())) {
                    usuarioEncontrado = true;

                    if (contrasena.equals(usuario.getContrasena())) {

                        return "Inicio de sesión exitoso";
                    } else {
                        return "Error de contraseña";
                    }
                }
            }

            // Verificar si se encontró un usuario con el correo proporcionado
            if (!usuarioEncontrado) {
                return "El correo no está registrado";
            }

            result.close();
            stmt.close();

        } catch (SQLException e) {
            resultado = "Error en el inicio de sesión";
        }
        return resultado;
    }

    // Obtener datos del usuario por email y contraseña
    public Usuarios obtenerDatosUsuario(String email, String contrasena) {
        String query = "SELECT id_usuario, nombre, apellido, email, telefono, tipoUsuario, fechaNacimiento FROM Usuario WHERE email = ? AND contrasena = ?";
        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setString(1, email);
            pstmt.setString(2, contrasena);

            try (ResultSet resultSet = pstmt.executeQuery()) {
                if (resultSet.next()) {
                    Usuarios usuario = new Usuarios();
                    usuario.setId_usuario(resultSet.getInt("id_usuario"));
                    usuario.setNombre(resultSet.getString("nombre"));
                    usuario.setApellido(resultSet.getString("apellido"));
                    usuario.setEmail(resultSet.getString("email"));
                    usuario.setTelefono(resultSet.getString("telefono"));
                    usuario.setTipoUsuario(resultSet.getString("tipoUsuario"));
                    usuario.setFechaNacimiento(resultSet.getString("fechaNacimiento"));

                    return usuario;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // Pantalla de registro
    public String registro(Usuarios usuario) {
        String resultado = "Registrando cuenta de usuario...";
        try {
            String query = "CALL InsertarUsuario(?, ?, ?, ?, ?, ?, ?, ?)";

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setString(1, usuario.getNombre());
                pstmt.setString(2, usuario.getApellido());
                pstmt.setString(3, usuario.getEmail());
                pstmt.setString(4, usuario.getTelefono());
                pstmt.setString(5, usuario.getTipoUsuario());
                pstmt.setString(6, usuario.getContrasena());
                pstmt.setString(7, usuario.getConfirmarContrasena());
                pstmt.setString(8, usuario.getFechaNacimiento());

                pstmt.executeUpdate();
                cn.commit();
            }

            return "Registro exitoso";
        } catch (SQLException e) {
            e.printStackTrace();
            resultado = "Error en el inicio de sesión: " + e.getMessage();
        }
        return resultado;
    }

    // Obtener lista de usuarios
    public List<Usuarios> obtenerUsuarios() {
        List<Usuarios> usuarios = new ArrayList<>();
        try {
            Statement stmt = cn.createStatement();
            String query = "SELECT * FROM Usuario";
            ResultSet result = stmt.executeQuery(query);

            while (result.next()) {
                Usuarios usuario = new Usuarios(result.getInt("id_usuario"), result.getString("nombre"),
                        result.getString("apellido"), result.getString("email"), result.getString("telefono"),
                        result.getString("tipoUsuario"), result.getString("contrasena"),
                        result.getString("confirmarContrasena"), result.getString("fechaNacimiento"),
                        result.getBytes("peliculas_Vistas"));
                usuarios.add(usuario);
            }

            result.close();
            stmt.close();

        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener información de registro");
        }
        return usuarios;
    }

    // Obtener usuario por correo
    public Usuarios obtenerUsuarioPorCorreo(String correo) {
        String query = "SELECT * FROM Usuario WHERE email = ?";
        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setString(1, correo);
            ResultSet result = pstmt.executeQuery();

            if (result.next()) {
                return new Usuarios(result.getInt("id_usuario"), result.getString("nombre"),
                        result.getString("apellido"), result.getString("email"), result.getString("telefono"),
                        result.getString("tipoUsuario"), result.getString("contrasena"),
                        result.getString("confirmarContrasena"), result.getString("fechaNacimiento"),
                        result.getBytes("peliculas_Vistas"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void actualizarDatosUsuario(Usuarios usuario) {
        try {
            String query = "UPDATE Usuario SET nombre = ?, apellido = ?, fechaNacimiento = ?, email = ?, telefono = ? WHERE id_usuario = ?";
            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setString(1, usuario.getNombre());
                pstmt.setString(2, usuario.getApellido());
                pstmt.setString(3, usuario.getFechaNacimiento());
                pstmt.setString(4, usuario.getEmail());
                pstmt.setString(5, usuario.getTelefono());
                pstmt.setInt(6, usuario.getId_usuario());

                pstmt.executeUpdate();
                cn.commit();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al actualizar los datos del usuario");
        }
    }

    public int agregarPelicula(Pelicula pelicula) {
        try {
            String query = "INSERT INTO Pelicula(titulo, sinopsis, genero, linkQR, linkInfo, clasificacion, duracion, foto_poster, calificacion) "
                    +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            try (PreparedStatement pstmt = cn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
                pstmt.setString(1, pelicula.getTitulo());
                pstmt.setString(2, pelicula.getSinopsis());
                pstmt.setString(3, pelicula.getGenero());
                pstmt.setString(4, pelicula.getLinkQR());
                pstmt.setString(5, pelicula.getLinkInfo());
                pstmt.setString(6, pelicula.getClasificacion());
                pstmt.setString(7, pelicula.getDuracion());
                pstmt.setString(8, pelicula.getFotoPoster());
                Float calificacion = pelicula.getCalificacion();
                pstmt.setFloat(9, calificacion != null ? calificacion.floatValue() : 0.0f);

                int rowsAffected = pstmt.executeUpdate();
                if (rowsAffected > 0) {
                    ResultSet rs = pstmt.getGeneratedKeys();
                    if (rs.next()) {
                        int idPelicula = rs.getInt(1);
                        return idPelicula;
                    }
                }
                return -1; // Indicar que no se pudo obtener el id_pelicula
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al agregar la película a la base de datos: " + e.getMessage());
            return -1;
        }
    }

    public List<Pelicula> obtenerTodasLasPeliculas() {
        List<Pelicula> peliculas = new ArrayList<>();
        try (Statement stmt = cn.createStatement()) {
            String query = "SELECT * FROM Pelicula";
            try (ResultSet result = stmt.executeQuery(query)) {
                while (result.next()) {
                    Pelicula pelicula = new Pelicula(
                            result.getInt("id_pelicula"),
                            result.getString("titulo"),
                            result.getString("sinopsis"),
                            result.getString("genero"),
                            result.getString("linkQR"),
                            result.getString("linkInfo"),
                            result.getString("clasificacion"),
                            result.getString("duracion"),
                            result.getString("foto_poster"),
                            result.getFloat("calificacion"));
                    peliculas.add(pelicula);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener todas las películas: " + e.getMessage());
        }
        return peliculas;
    }

    public Pelicula buscarPelicula(int idPelicula) {
        try {
            String query = "SELECT * FROM Pelicula WHERE id_pelicula = ?";
            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setInt(1, idPelicula);
                try (ResultSet resultSet = pstmt.executeQuery()) {
                    if (resultSet.next()) {
                        return new Pelicula(
                                resultSet.getInt("id_pelicula"),
                                resultSet.getString("titulo"),
                                resultSet.getString("sinopsis"),
                                resultSet.getString("genero"),
                                resultSet.getString("linkQR"),
                                resultSet.getString("linkInfo"),
                                resultSet.getString("clasificacion"),
                                resultSet.getString("duracion"),
                                resultSet.getString("foto_poster"),
                                resultSet.getFloat("calificacion"));
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al buscar la película en la base de datos: " + e.getMessage());
        }
        return null;
    }

    public boolean agregarActor(Actor actor) {
        try {
            String query = "INSERT INTO Actores(nombre, apellido, foto, id_pelicula) VALUES (?, ?, ?,?)";

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setString(1, actor.getNombre());
                pstmt.setString(2, actor.getApellido());
                pstmt.setString(3, actor.getFoto());
                pstmt.setInt(4, actor.getIdPelicula());
                int rowsAffected = pstmt.executeUpdate();
                cn.commit();

                return rowsAffected > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al agregar el actor a la base de datos: " + e.getMessage());
            return false;
        }
    }

    public List<Actor> obtenerActoresPorPelicula(int idPelicula) {
        List<Actor> actores = new ArrayList<>();
        try (PreparedStatement pstmt = cn.prepareStatement("SELECT * FROM Actores WHERE id_pelicula = ?")) {
            pstmt.setInt(1, idPelicula);
            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Actor actor = new Actor(
                            result.getInt("id_actor"),
                            result.getString("nombre"),
                            result.getString("apellido"),
                            result.getString("foto"),
                            result.getInt("id_pelicula"));
                    actores.add(actor);
                }
                pstmt.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener actores por película: " + e.getMessage());
        }
        return actores;
    }

    public void eliminarPelicula(String idPelicula) {
        System.out.println("ID de película a eliminar: " + idPelicula);
        try {
            String query = "DELETE FROM Pelicula WHERE id_pelicula = ?";

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setString(1, idPelicula);
                pstmt.executeUpdate();
                pstmt.close();
            }

            System.out.println("Película eliminada exitosamente");
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al eliminar la película: " + e.getMessage());
        }
    }

    public boolean actualizarPelicula(int idPeli, Pelicula peliculaActualizada) {
        try {
            if (existePelicula(idPeli)) {

                String query = "UPDATE Pelicula SET duracion=?, sinopsis=?, clasificacion=?, genero=?, "
                        + "titulo=?, linkQR=?, linkInfo=?, foto_poster=? WHERE id_pelicula=?";

                try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                    pstmt.setString(1, peliculaActualizada.getDuracion());
                    pstmt.setString(2, peliculaActualizada.getSinopsis());
                    pstmt.setString(3, peliculaActualizada.getClasificacion());
                    pstmt.setString(4, peliculaActualizada.getGenero());
                    pstmt.setString(5, peliculaActualizada.getTitulo());
                    pstmt.setString(6, peliculaActualizada.getLinkQR());
                    pstmt.setString(7, peliculaActualizada.getLinkInfo());
                    pstmt.setString(8, peliculaActualizada.getFotoPoster());
                    pstmt.setInt(9, idPeli);

                    int rowsAffected = pstmt.executeUpdate();

                    return rowsAffected > 0;
                }
            } else {
                return false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al actualizar la película en la base de datos: " + e.getMessage());
            return false;
        }
    }

    public boolean existePelicula(int idPeli) throws SQLException {
        String query = "SELECT COUNT(*) AS count FROM Pelicula WHERE id_pelicula=?";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setInt(1, idPeli);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    int count = rs.getInt("count");
                    return count > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out
                    .println("Error al verificar la existencia de la película en la base de datos: " + e.getMessage());
            throw e; // Re-throw the exception to the calling method
        }

        return false;
    }

    public boolean agregarDirector(Director director) {
        try {
            String query = "INSERT INTO Directores (nombre, apellido, id_pelicula) VALUES (?, ?,?)";

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setString(1, director.getNombre());
                pstmt.setString(2, director.getApellido());
                pstmt.setInt(3, director.getIdPelicula());

                int rowsAffected = pstmt.executeUpdate();
                cn.commit();

                return rowsAffected > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al agregar el director a la base de datos: " + e.getMessage());
            return false;
        }
    }

    public List<Director> obtenerDirectoresPorPelicula(int idPelicula) {
        List<Director> directores = new ArrayList<>();
        try (PreparedStatement pstmt = cn.prepareStatement("SELECT * FROM Directores  WHERE id_pelicula = ?")) {
            pstmt.setInt(1, idPelicula);
            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Director director = new Director(
                            result.getInt("id_director"),
                            result.getString("nombre"),
                            result.getString("apellido"),
                            result.getInt("id_pelicula"));
                    directores.add(director);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener directores por película: " + e.getMessage());
        }
        return directores;
    }

    public boolean agregarSucursalesPelicula(SucursalesPelicula sucursalesPelicula) {
        try {
            String query = "INSERT INTO Sucursales_Pelicula (id_sucursal, id_pelicula, activo) VALUES (?, ?, ?)";

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setInt(1, sucursalesPelicula.getIdSucursal());
                pstmt.setInt(2, sucursalesPelicula.getIdPelicula());
                pstmt.setInt(3, sucursalesPelicula.getActivo());

                int rowsAffected = pstmt.executeUpdate();
                cn.commit();

                return rowsAffected > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al agregar SucursalesPelicula a la base de datos: " + e.getMessage());
            return false;
        }
    }

    public List<SucursalesPelicula> obtenerSucursalesPorPelicula(int idPelicula) throws SQLException {
        List<SucursalesPelicula> sucursales = new ArrayList<>();
        try (PreparedStatement pstmt = cn
                .prepareStatement("SELECT * FROM Sucursales_Pelicula WHERE id_pelicula = ? AND activo = 1")) {
            pstmt.setInt(1, idPelicula);
            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    SucursalesPelicula sucursal = new SucursalesPelicula(
                            result.getInt("id_sucursal"),
                            result.getInt("id_pelicula"),
                            result.getInt("activo"));
                    sucursales.add(sucursal);
                }
            } catch (SQLException e) {
                e.printStackTrace();
                System.out.println("Error al obtener sucursales por película: " + e.getMessage());
            }
        }
        return sucursales;
    }

    public boolean actualizarActor(int idActor, Actor actorActualizado) {
        try {
            if (existeActor(idActor)) {

                String query = "UPDATE Actores SET nombre=?, apellido=?, foto=? WHERE id_actor=?";

                try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                    pstmt.setString(1, actorActualizado.getNombre());
                    pstmt.setString(2, actorActualizado.getApellido());
                    pstmt.setString(3, actorActualizado.getFoto());
                    pstmt.setInt(4, idActor);

                    int rowsAffected = pstmt.executeUpdate();

                    return rowsAffected > 0;
                }
            } else {
                return false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al actualizar el actor en la base de datos: " + e.getMessage());
            return false;
        }
    }

    public boolean existeActor(int idActor) {
        try {
            String query = "SELECT COUNT(*) FROM Actores WHERE id_actor = ?";

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setInt(1, idActor);

                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        int count = rs.getInt(1);
                        return count > 0;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al verificar si existe el actor en la base de datos: " + e.getMessage());
        }

        return false;
    }

    public boolean actualizarDirector(int idDirector, Director directorActualizado) {
        try {
            if (existeDirector(idDirector)) {

                String query = "UPDATE Directores SET nombre=?, apellido=? WHERE id_director=?";

                try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                    pstmt.setString(1, directorActualizado.getNombre());
                    pstmt.setString(2, directorActualizado.getApellido());
                    pstmt.setInt(3, idDirector);

                    int rowsAffected = pstmt.executeUpdate();
                    return rowsAffected > 0;
                }
            } else {
                return false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al actualizar el director en la base de datos: " + e.getMessage());
            return false;
        }
    }

    public boolean existeDirector(int idDirector) {
        try {
            String query = "SELECT COUNT(*) FROM Directores WHERE id_director = ?";

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setInt(1, idDirector);

                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        int count = rs.getInt(1);
                        return count > 0;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al verificar si existe el director en la base de datos: " + e.getMessage());
        }

        return false;
    }

    public boolean actualizarEstadoSucursalPorPelicula(SucursalesPelicula sucursalesPelicula) {
        try {
            String query = "UPDATE Sucursales_Pelicula SET activo = ? WHERE id_pelicula = ? AND id_sucursal = ?";

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setInt(1, sucursalesPelicula.getActivo());
                pstmt.setInt(2, sucursalesPelicula.getIdPelicula());
                pstmt.setInt(3, sucursalesPelicula.getIdSucursal());

                int rowsAffected = pstmt.executeUpdate();
                return rowsAffected > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al actualizar el estado de la sucursal de la base de datos: " + e.getMessage());
            return false;
        }
    }

    public List<Pelicula> obtenerPeliculasPorSucursal(int idSucursal) {
        List<Pelicula> peliculas = new ArrayList<>();

        try (PreparedStatement pstmt = cn.prepareStatement(
                "SELECT P.* FROM Pelicula P JOIN Sucursales_Pelicula SP ON P.id_pelicula = SP.id_pelicula WHERE SP.id_sucursal = ?")) {
            pstmt.setInt(1, idSucursal);

            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Pelicula pelicula = new Pelicula(
                            result.getInt("id_pelicula"),
                            result.getString("titulo"),
                            result.getString("sinopsis"),
                            result.getString("genero"),
                            result.getString("linkQR"),
                            result.getString("linkInfo"),
                            result.getString("clasificacion"),
                            result.getString("duracion"),
                            result.getString("foto_poster"),
                            result.getFloat("calificacion"));
                    peliculas.add(pelicula);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener películas por sucursal: " + e.getMessage());
        }

        return peliculas;
    }

    // Servicios para PasosQr
    public PasoQr getDatosqr(String codigoConfirmacion) {
        PasoQr qr = new PasoQr();

        String query = "SELECT\n" +
                "Sucursales.cine,\n" +
                "Ticket.NombrePelicula,\n" +
                "Ticket.id_sala,\n" +
                "Ticket.fechaTicket,\n" +
                "Ticket.horaTicket,\n" +
                "Ticket.cantidadTicket\n" +
                // "Ticket.montoIngreso\n" +//
                "FROM Ticket\n" +
                "JOIN Sucursales ON Ticket.idSucursales = Sucursales.id_sucursal \n" +
                // "JOIN Pelicula ON Ticket.ID_PELICULA = Pelicula.ID_PELICULA " +
                "WHERE Ticket.id_boleto = ?";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setString(1, codigoConfirmacion);
            ResultSet result = pstmt.executeQuery();

            if (result.next()) {
                qr = new PasoQr(
                        result.getString("Sucursales.cine"),
                        result.getString("Ticket.NombrePelicula"),
                        result.getInt("Ticket.id_sala"),
                        result.getString("Ticket.fechaTicket"),
                        result.getString("Ticket.horaTicket"),
                        result.getInt("Ticket.cantidadTicket"),
                        // result.getFloat("Ticket.montoIngreso"),//
                        "nombreSala");
            }

            result.close();
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener información de registro");
        }
        return qr;
    }

    // Servicio de la pagina destino (cuando escanean el QR)
    // cambia estacanjeado a true
    public QrLink getQrLink(String codigoConfirmacion) {
        QrLink qrlink = new QrLink();
        String linkPeli ="ups";
        String videoId="";

        String query = "SELECT Ticket.estacanjeado, Ticket.cantidadTicket, Ticket.NombrePelicula\n" //
                +"FROM Ticket WHERE Ticket.id_boleto = ?";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {

            pstmt.setString(1, codigoConfirmacion);
            ResultSet result = pstmt.executeQuery();

            if (result.next()) {

                String query1 = "SELECT Pelicula.linkQR FROM Pelicula WHERE titulo = ?";
                PreparedStatement preparedStatement = cn.prepareStatement(query1);
                preparedStatement.setString(1, result.getString("NombrePelicula"));
                
                ResultSet res = preparedStatement.executeQuery();

                if (res.next()) {
                    linkPeli = res.getString("linkQR");
                }

                String originalString = linkPeli;
                String modifiedString = originalString;

                // Ver si contiene 'watch?v='
                if (originalString.contains("watch?v=")) {
                    // Reemplazar 'watch?v=' con 'embed/'
                    modifiedString = originalString.replace("watch?v=", "embed/");
                } else if(originalString.contains("?si=")){
                    int startIndex = originalString.lastIndexOf("/") + 1;
                    int endIndex = originalString.indexOf("?");
            
                    if (endIndex == -1) {
                        endIndex = originalString.length();
                    }
            
                    videoId = originalString.substring(startIndex, endIndex);
                    modifiedString = "https://www.youtube.com/embed/" + videoId;
                } 

                qrlink = new QrLink(
                        result.getBoolean("estacanjeado"),
                        modifiedString,
                        result.getInt("cantidadTicket"));

                // Actualiza a TRUE cuando el ticket no ha sido canjeado
                if (!qrlink.getFlag()) {
                    query = "UPDATE Ticket SET estacanjeado = true WHERE id_boleto = ?";
                    try (PreparedStatement updateStmt = cn.prepareStatement(query)) {
                        updateStmt.setString(1, codigoConfirmacion);
                        updateStmt.executeUpdate();
                    }
                }
            }

            result.close();
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener información de registro");
        }
        return qrlink;
    }

    // Necesita que los registros de Horario, Cartelera y Sucursal sean validos
    // y sus ids coincidan
    // Retorna una lista de objetos Cartelera
    public List<Cartelera> getCartelera() {
        List<Cartelera> peliculas = new ArrayList<>();
        try (Statement stmt = cn.createStatement()) {
            String query = "SELECT Cartelera.id_cartelera, Cartelera.estado, Cartelera.fechaEstreno,\n" +
                    "Pelicula.titulo, Pelicula.foto_poster,\n" +
                    "Pelicula.duracion, Sucursales.Provincia,\n" +
                    "Sucursales.cine, Horario.tandas, \n" +
                    "Pelicula.genero, Sala.nombre_sala, \n" +
                    "Cartelera.id_cartelera, Pelicula.clasificacion, Cartelera.id_pelicula\n" +
                    "FROM Cartelera \n" +
                    "JOIN Pelicula ON Pelicula.id_pelicula = Cartelera.id_pelicula \n" +
                    "JOIN Horario ON Horario.Id_horario = Cartelera.Id_horario \n" +
                    "JOIN Sucursales_Pelicula ON Sucursales_Pelicula.id_pelicula = Pelicula.id_pelicula\n" +
                    "JOIN Sucursales ON Sucursales.id_sucursal = Sucursales_Pelicula.id_sucursal\n" +
                    "JOIN Sala ON Sala.id_sala = Horario.id_sala \n" +
                    "WHERE Sucursales_Pelicula.activo = 1;";
            try (ResultSet result = stmt.executeQuery(query)) {
                while (result.next()) {
                    Cartelera cartelera = new Cartelera(
                            result.getString("Sucursales.Provincia"),
                            result.getString("Horario.tandas"),
                            result.getString("Pelicula.titulo"),
                            result.getString("Pelicula.genero"),
                            result.getString("Sucursales.cine"),
                            result.getString("Sala.nombre_sala"),
                            result.getString("Pelicula.duracion"),
                            result.getBoolean("Cartelera.estado"),
                            result.getString("Pelicula.foto_poster"),
                            result.getString("Cartelera.fechaEstreno"),
                            result.getInt("Cartelera.id_cartelera"),
                            result.getString("Pelicula.clasificacion"),
                            result.getInt("Cartelera.id_pelicula"));
                    peliculas.add(cartelera);

                }
                result.close();
                stmt.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener todas las películas: " + e.getMessage());
        }
        return peliculas;
    }

    public List<Cartelera> filtrarCarteleraPorID(int id) {
        List<Cartelera> peliculas = new ArrayList<>();

        String query = "SELECT Cartelera.id_cartelera, Cartelera.estado, Cartelera.fechaEstreno,\n" +
                "Pelicula.titulo, Pelicula.foto_poster,\n" +
                "Pelicula.duracion, Sucursales.Provincia,\n" +
                "Sucursales.cine, Horario.tandas, \n" +
                "Pelicula.genero, Sala.nombre_sala, \n" +
                "Cartelera.id_cartelera, Pelicula.clasificacion, Cartelera.id_pelicula\n" +
                "FROM Cartelera \n" +
                "JOIN Pelicula ON Pelicula.id_pelicula = Cartelera.id_pelicula \n" +
                "JOIN Horario ON Horario.Id_horario = Cartelera.Id_horario \n" +
                "JOIN Sucursales_Pelicula ON Sucursales_Pelicula.id_pelicula = Pelicula.id_pelicula\n" +
                "JOIN Sucursales ON Sucursales.id_sucursal = Sucursales_Pelicula.id_sucursal\n" +
                "JOIN Sala ON Sala.id_sala = Horario.id_sala \n" +
                "WHERE Sucursales_Pelicula.activo = 1 \n" +
                "AND Pelicula.id = ? ;";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setInt(1, id);

            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Cartelera cartelera = new Cartelera(
                            result.getString("Sucursales.Provincia"),
                            result.getString("Horario.tandas"),
                            result.getString("Pelicula.titulo"),
                            result.getString("Pelicula.genero"),
                            result.getString("Sucursales.cine"),
                            result.getString("Sala.nombre_sala"),
                            result.getString("Pelicula.duracion"),
                            result.getBoolean("Cartelera.estado"),
                            result.getString("Pelicula.foto_poster"),
                            result.getString("Cartelera.fechaEstreno"),
                            result.getInt("Cartelera.id_cartelera"),
                            result.getString("Pelicula.clasificacion"),
                            result.getInt("Cartelera.id_pelicula"));
                    peliculas.add(cartelera);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener todas las películas: " + e.getMessage());
        }
        return peliculas;
    }

    public List<Cartelera> filtrarCarteleraPorSucursal(int idSucursal) {
        List<Cartelera> peliculas = new ArrayList<>();

        String query = "SELECT Cartelera.id_cartelera, Cartelera.estado, Cartelera.fechaEstreno,\n" +
                "Pelicula.titulo, Pelicula.foto_poster,\n" +
                "Pelicula.duracion, Sucursales.Provincia,\n" +
                "Sucursales.cine, Horario.tandas, \n" +
                "Pelicula.genero, Sala.nombre_sala, \n" +
                "Cartelera.id_cartelera, Pelicula.clasificacion, Cartelera.id_pelicula\n" +
                "FROM Cartelera \n" +
                "JOIN Pelicula ON Pelicula.id_pelicula = Cartelera.id_pelicula \n" +
                "JOIN Horario ON Horario.Id_horario = Cartelera.Id_horario \n" +
                "JOIN Sucursales_Pelicula ON Sucursales_Pelicula.id_pelicula = Pelicula.id_pelicula\n" +
                "JOIN Sucursales ON Sucursales.id_sucursal = Sucursales_Pelicula.id_sucursal\n" +
                "JOIN Sala ON Sala.id_sala = Horario.id_sala \n" +
                "WHERE Sucursales_Pelicula.activo = 1 \n" +
                "AND Sucursales_Pelicula.id_sucursal = ? ;";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setInt(1, idSucursal);

            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Cartelera cartelera = new Cartelera(
                            result.getString("Sucursales.Provincia"),
                            result.getString("Horario.tandas"),
                            result.getString("Pelicula.titulo"),
                            result.getString("Pelicula.genero"),
                            result.getString("Sucursales.cine"),
                            result.getString("Sala.nombre_sala"),
                            result.getString("Pelicula.duracion"),
                            result.getBoolean("Cartelera.estado"),
                            result.getString("Pelicula.foto_poster"),
                            result.getString("Cartelera.fechaEstreno"),
                            result.getInt("Cartelera.id_cartelera"),
                            result.getString("Pelicula.clasificacion"),
                            result.getInt("Cartelera.id_pelicula"));
                    peliculas.add(cartelera);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener todas las películas: " + e.getMessage());
        }
        return peliculas;
    }

    public List<Cartelera> filtrarCarteleraPorGenero(String genero) {
        List<Cartelera> peliculas = new ArrayList<>();

        String query = "SELECT Cartelera.id_cartelera, Cartelera.estado, Cartelera.fechaEstreno,\n" +
                "Pelicula.titulo, Pelicula.foto_poster,\n" +
                "Pelicula.duracion, Sucursales.Provincia,\n" +
                "Sucursales.cine, Horario.tandas, \n" +
                "Pelicula.genero, Sala.nombre_sala, \n" +
                "Cartelera.id_cartelera, Pelicula.clasificacion, Cartelera.id_pelicula\n" +
                "FROM Cartelera \n" +
                "JOIN Pelicula ON Pelicula.id_pelicula = Cartelera.id_pelicula \n" +
                "JOIN Horario ON Horario.Id_horario = Cartelera.Id_horario \n" +
                "JOIN Sucursales_Pelicula ON Sucursales_Pelicula.id_pelicula = Pelicula.id_pelicula\n" +
                "JOIN Sucursales ON Sucursales.id_sucursal = Sucursales_Pelicula.id_sucursal\n" +
                "JOIN Sala ON Sala.id_sala = Horario.id_sala \n" +
                "WHERE Sucursales_Pelicula.activo = 1 \n" +
                "AND Pelicula.genero LIKE ? ;";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setString(1, "%" + genero + "%");

            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Cartelera cartelera = new Cartelera(
                            result.getString("Sucursales.Provincia"),
                            result.getString("Horario.tandas"),
                            result.getString("Pelicula.titulo"),
                            result.getString("Pelicula.genero"),
                            result.getString("Sucursales.cine"),
                            result.getString("Sala.nombre_sala"),
                            result.getString("Pelicula.duracion"),
                            result.getBoolean("Cartelera.estado"),
                            result.getString("Pelicula.foto_poster"),
                            result.getString("Cartelera.fechaEstreno"),
                            result.getInt("Cartelera.id_cartelera"),
                            result.getString("Pelicula.clasificacion"),
                            result.getInt("Cartelera.id_pelicula"));
                    peliculas.add(cartelera);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener todas las películas: " + e.getMessage());
        }
        return peliculas;
    }

    public List<Cartelera> filtrarCarteleraPorSucursalYGenero(int idSucursal, String genero) {
        List<Cartelera> peliculas = new ArrayList<>();

        String query = "SELECT Cartelera.id_cartelera, Cartelera.estado, Cartelera.fechaEstreno,\n" +
                "Pelicula.titulo, Pelicula.foto_poster,\n" +
                "Pelicula.duracion, Sucursales.Provincia,\n" +
                "Sucursales.cine, Horario.tandas, \n" +
                "Pelicula.genero, Sala.nombre_sala, \n" +
                "Cartelera.id_cartelera, Pelicula.clasificacion, Cartelera.id_pelicula\n" +
                "FROM Cartelera \n" +
                "JOIN Pelicula ON Pelicula.id_pelicula = Cartelera.id_pelicula \n" +
                "JOIN Horario ON Horario.Id_horario = Cartelera.Id_horario \n" +
                "JOIN Sucursales_Pelicula ON Sucursales_Pelicula.id_pelicula = Pelicula.id_pelicula\n" +
                "JOIN Sucursales ON Sucursales.id_sucursal = Sucursales_Pelicula.id_sucursal\n" +
                "JOIN Sala ON Sala.id_sala = Horario.id_sala \n" +
                "WHERE Sucursales_Pelicula.activo = 1 \n" +
                "AND Sucursales_Pelicula.id_sucursal = ? \n" +
                "AND Pelicula.genero LIKE ?;";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setInt(1, idSucursal);
            pstmt.setString(2, "%" + genero + "%");

            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Cartelera cartelera = new Cartelera(
                            result.getString("Sucursales.Provincia"),
                            result.getString("Horario.tandas"),
                            result.getString("Pelicula.titulo"),
                            result.getString("Pelicula.genero"),
                            result.getString("Sucursales.cine"),
                            result.getString("Sala.nombre_sala"),
                            result.getString("Pelicula.duracion"),
                            result.getBoolean("Cartelera.estado"),
                            result.getString("Pelicula.foto_poster"),
                            result.getString("Cartelera.fechaEstreno"),
                            result.getInt("Cartelera.id_cartelera"),
                            result.getString("Pelicula.clasificacion"),
                            result.getInt("Cartelera.id_pelicula"));
                    peliculas.add(cartelera);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener todas las películas: " + e.getMessage());
        }
        return peliculas;
    }

    public List<Asientos> obtenerAsientos() {
        try {
            String query = "SELECT * FROM Asientos;";
            Statement stmt = cn.createStatement();
            List<Asientos> asientos = new ArrayList<Asientos>();
            ResultSet result = stmt.executeQuery(query);
            while (result.next()) {
                Asientos asiento = new Asientos(
                        result.getString("id_Asiento"),
                        result.getInt("Estado"));
                asientos.add(asiento);
            }

            result.close();
            stmt.close();
            return asientos;

        } catch (Exception e) {
            int x = 1;
        }
        return null;
    }

    public int guardarAsientos(List<Asientos> asientosList) {
        int insertados = 0;
        try {
            Statement stmt = cn.createStatement();
            for (Asientos asiento : asientosList) {
                String query = "INSERT INTO Asientos (id_Asiento, Estado) VALUES ('"
                        + asiento.getid_Asiento() + "',"
                        + asiento.getEstado() + ")";

                int resultado = stmt.executeUpdate(query);
                // Verifica si la inserción fue exitosa
                if (resultado > 0) {
                    insertados++;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            insertados = 0; // Se produjo un error
        }
        return insertados;
    }

    // Crear un registro en Ticket, y retornar el codigo de confirmacion
    public String crearTicket(PasoQr obj) {
        String codigoConfirmacion = "knbl";
        System.out.println(obj.getSede());
        System.out.println(obj.getNombreSala());
        System.out.println(obj.getBoletos());
        System.out.println(obj.getFecha());
        System.out.println(obj.getHora());
        System.out.println(obj.getPelicula());
        System.out.println(obj.getSala());
        try {
            String query0 = "SELECT id_sucursal FROM Sucursales WHERE cine = ?";
            int id_sucursal = -1; // Default value if no data is returned

            try (PreparedStatement pstmt = cn.prepareStatement(query0)) {
                pstmt.setString(1, obj.getSede());

                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        id_sucursal = rs.getInt(1);
                    } else {
                        // Handle the case where no data is returned
                        throw new SQLException("No data returned for id_sucursal");
                    }
                }
            }
            System.out.println("id_sucursal: " + id_sucursal);

            String query1 = "select id_sala from Sala where nombre_sala = ?;";
            int id_sala;
            try (PreparedStatement pstmt = cn.prepareStatement(query1)) {
                pstmt.setString(1, obj.getNombreSala());
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        id_sala = rs.getInt(1);
                    } else {
                        // Handle the case where no data is returned
                        throw new SQLException("No data returned for id_sala");
                    }
                }
            }
            System.out.println("id_sala: " + id_sala);

            String query = "INSERT INTO Ticket(NombrePelicula, id_sala, fechaTicket, horaTicket, "
                    + "cantidadTicket, estaCanjeado, Id_Boleto, IDSucursales) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

            UUID uuid = UUID.randomUUID();
            codigoConfirmacion = uuid.toString().replaceAll("-", "");
            int longitudDeseada = 24;
            codigoConfirmacion = codigoConfirmacion.substring(0, longitudDeseada);

            try (PreparedStatement pstmt = cn.prepareStatement(query)) {
                pstmt.setString(1, obj.getPelicula());
                pstmt.setInt(2, id_sala);
                pstmt.setString(3, obj.getFecha());
                pstmt.setString(4, obj.getHora());
                pstmt.setInt(5, obj.getBoletos());
                pstmt.setInt(6, 0);
                pstmt.setString(7, codigoConfirmacion);
                pstmt.setInt(8, id_sucursal);

                pstmt.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al agregar la película a la base de datos: " + e.getMessage());
        }
        System.out.println(codigoConfirmacion);
        return codigoConfirmacion;
    }

    public List<Boletos> BoletosXMes() {
        List<Boletos> boletos = new ArrayList<>();
        try (Statement stmt = cn.createStatement()) {
            String query = "SELECT distinct count(*) as cantidad, MONTH(fechaTicket) as Mes,\n" +
                    "sum(Ticket.cantidadTicket) as CantidadTickets \n" +
                    "FROM Ticket \n" +
                    "JOIN Sucursales ON Sucursales.id_sucursal = Ticket.Idsucursales\n" +
                    "GROUP BY Mes, Ticket.NombrePelicula\n" +
                    "ORDER BY CantidadTickets DESC;";

            try (ResultSet result = stmt.executeQuery(query)) {
                while (result.next()) {
                    Boletos boleto = new Boletos(
                            result.getInt("cantidad"),
                            result.getInt("Mes"),
                            result.getInt("CantidadTickets"));
                    boletos.add(boleto);
                }
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los datos de boletos x mes: " + e.getMessage());
        }
        return boletos;
    }

    public List<Boletos> BoletosXMesXSucursal(int idSucursal) {
        List<Boletos> boletos = new ArrayList<>();
        String query = "SELECT distinct count(*) as cantidad, MONTH(fechaTicket) as Mes,\n" +
                "sum(Ticket.cantidadTicket) as CantidadTickets \n" +
                "From Ticket \n" +
                "JOIN Sucursales ON Sucursales.id_sucursal = Ticket.Idsucursales\n" +
                "WHERE Sucursales.id_sucursal = ? \n GROUP BY Mes, Ticket.NombrePelicula\n" +
                "ORDER BY  CantidadTickets DESC;";
        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setInt(1, idSucursal);

            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Boletos boleto = new Boletos(
                            result.getInt("cantidad"),
                            result.getInt("Mes"),
                            result.getInt("CantidadTickets"));
                    boletos.add(boleto);
                }
                result.close();
                pstmt.close();
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los datos de Boletos x Mes filtro por sucursal: " + e.getMessage());
        }
        return boletos;
    }

    public List<Boletos2> BoletosTotales(int idSucursal) {
        List<Boletos2> boletos = new ArrayList<>();
        String query = "SELECT COUNT(*) AS cantidad_total, MONTH(fechaTicket) AS Mes,\n" +
                "SUM(Ticket.cantidadTicket) AS CantidadTickets_total,\n" +
                "SUM(CASE WHEN Sucursales.id_sucursal = ? THEN Ticket.cantidadTicket ELSE 0 END) AS CantidadTickets_sucursal\n"
                +
                "FROM Ticket JOIN Sucursales ON Sucursales.id_sucursal = Ticket.Idsucursales\n" +
                "GROUP BY Mes, Ticket.NombrePelicula\n" +
                "ORDER BY CantidadTickets_total DESC;\n";
        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setInt(1, idSucursal);

            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    Boletos2 boleto = new Boletos2(
                            result.getInt("cantidad_total"),
                            result.getInt("Mes"),
                            result.getInt("CantidadTickets_total"),
                            result.getInt("CantidadTickets_sucursal"));
                    boletos.add(boleto);
                }
                result.close();
                pstmt.close();
            }

            return boletos;
        } catch (Exception e) {
            System.out.println("Error al obtener los datos de BoletosXTotales: " + e.getMessage());
        }
        return null;

    }

    public List<Ingresos> IngresosTotales() {
        List<Ingresos> ingresos = new ArrayList<>();
        try {
            String setQuery = "SET @totVentas:=0;";
            String query = " \n SELECT @totVentas:= @totVentas + SUM(Ticket.montoIngreso) AS totVentas FROM Ticket;";
            Statement stmt = cn.createStatement();
            stmt.execute(setQuery);
            ResultSet result = stmt.executeQuery(query);

            while (result.next()) {
                Ingresos ingreso = new Ingresos(
                        result.getInt("totVentas"));
                ingresos.add(ingreso);
            }
            result.close();
            stmt.close();

            return ingresos;
        } catch (Exception e) {
            System.out.println("Error al obtener los datos de IngresosTotales: " + e.getMessage());
        }
        return null;

    }

    public List<Ingresos2> IngresosXMes() {
        List<Ingresos2> ingresos = new ArrayList<>();
        try {
            String query = "SELECT MONTH(fechaTicket) AS Mes, \n" +
                    "SUM(Ticket.montoIngreso) AS Ingresos FROM Ticket\n" +
                    "GROUP BY  Mes ORDER BY  Mes;\n";
            Statement stmt = cn.createStatement();
            ResultSet result = stmt.executeQuery(query);

            while (result.next()) {
                Ingresos2 ingreso = new Ingresos2(
                        result.getInt("Mes"),
                        result.getInt("Ingresos"));
                ingresos.add(ingreso);
            }

            result.close();
            stmt.close();
        } catch (Exception e) {
            System.out.println("Error al obtener los datos de IngresosXMes: " + e.getMessage());
        }
        return ingresos;

    }

    public List<Ingresos3> IngresosTotalesXSucursal() {
        List<Ingresos3> ingresos = new ArrayList<>();
        try {
            String setQuery = "SET @totVentas:=0;";
            String query = "SELECT Sucursales.id_sucursal,\n" +
                    "@totVentas:= @totVentas + SUM(Ticket.montoIngreso) AS totVentas FROM Ticket\n" +
                    "JOIN Sucursales ON Sucursales.id_sucursal = Ticket.idSucursales\n" +
                    "GROUP BY Sucursales.id_sucursal;\n";
            Statement stmt = cn.createStatement();
            stmt.execute(setQuery);
            ResultSet result = stmt.executeQuery(query);

            while (result.next()) {
                Ingresos3 ingreso = new Ingresos3(
                        result.getInt("Sucursales.id_sucursal"),
                        result.getInt("totVentas"));
                ingresos.add(ingreso);
            }

            result.close();
            stmt.close();
        } catch (Exception e) {
            System.out.println("Error al obtener los datos de IngresosTotalesXSucursal: " + e.getMessage());
        }
        return ingresos;

    }
    public List<Oferta> obtenerOfertas(){
        List<Oferta> ofertas = new ArrayList<>();
        try {
            String query = "SELECT * FROM Oferta";

            Statement stmt = cn.createStatement();
            ResultSet result = stmt.executeQuery(query);

            while (result.next()) {
                Oferta oferta = new Oferta(
                        result.getString("id_oferta"),
                        result.getString("feInicio"),
                        result.getString("feFinal"),
                        result.getString("titulo"),
                        result.getString("detalles"),
                        result.getInt("id_cartelera"),
                        result.getString("foto_inte"));
                ofertas.add(oferta);
            }

            result.close();
            stmt.close();
        } catch (Exception e) {
            System.out.println("Error al obtener las ofertas" + e.getMessage());
        }
        return ofertas;
    }

       @Autowired
    private JavaMailSender javaMailSender;

    public void enviarCorreoHtml(String to, String subject, String htmlBody) {
        MimeMessage mensaje = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            javaMailSender.send(mensaje);
            System.out.println("Correo enviado exitosamente.");
        }catch (MessagingException e) {
            e.printStackTrace();  // Imprime la excepción en la consola
            throw new RuntimeException(e);
        }

}
}
