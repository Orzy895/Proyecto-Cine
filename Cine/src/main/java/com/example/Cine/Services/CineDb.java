package com.example.Cine.Services;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.example.Cine.modelos.Actor;
import com.example.Cine.modelos.Pelicula;
import com.example.Cine.modelos.SucursalesPelicula;
import com.example.Cine.modelos.Usuarios;
import com.example.Cine.modelos.PasoQr;
import com.example.Cine.modelos.QrLink;
import com.example.Cine.modelos.Cartelera;
import com.example.Cine.modelos.Director;


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
            String query = "INSERT INTO Pelicula(titulo, sinopsis, genero, linkQR, linkInfo, clasificacion, duracion, foto_poster, calificacion) " +
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
                            result.getFloat("calificacion")
                    );
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
                                resultSet.getFloat("calificacion")
                        );
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
                pstmt.setInt(4,actor.getIdPelicula());
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
                            result.getInt("id_pelicula")
                    );
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
            System.out.println("Error al verificar la existencia de la película en la base de datos: " + e.getMessage());
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
                    pstmt.setInt(3,director.getIdPelicula());

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
                                result.getInt("id_pelicula")
                        );
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
        try (PreparedStatement pstmt = cn.prepareStatement("SELECT * FROM Sucursales_Pelicula WHERE id_pelicula = ? AND activo = 1")) {
            pstmt.setInt(1, idPelicula);
            try (ResultSet result = pstmt.executeQuery()) {
                while (result.next()) {
                    SucursalesPelicula sucursal = new SucursalesPelicula(
                            result.getInt("id_sucursal"),
                            result.getInt("id_pelicula"),
                            result.getInt("activo")
                    );
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
                                result.getFloat("calificacion")
                        );
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
                "Pelicula.titulo,\n" +
                "Ticket.id_sala,\n" +
                "Ticket.fechaTicket,\n" +
                "Ticket.horaTicket,\n" +
                "Ticket.cantidadTicket\n" +
                "FROM Ticket\n" +
                "JOIN Sucursales ON Ticket.idSucursales = Sucursales.id_sucursal \n" +
                "JOIN Pelicula ON Ticket.ID_PELICULA = Pelicula.ID_PELICULA " +
                "WHERE Ticket.id_boleto = ?";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setString(1, codigoConfirmacion);
            ResultSet result = pstmt.executeQuery();

            if (result.next()) {
                qr = new PasoQr(
                        result.getString("Sucursales.cine"),
                        result.getString("Pelicula.titulo"),
                        result.getInt("Ticket.id_sala"),
                        result.getString("Ticket.fechaTicket"),
                        result.getString("Ticket.horaTicket"),
                        result.getInt("Ticket.cantidadTicket"));
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

        String query = "SELECT Ticket.estacanjeado, Pelicula.linkInfo, Ticket.cantidadTicket FROM Ticket "
                + "JOIN Pelicula ON Ticket.ID_PELICULA = Pelicula.ID_PELICULA "
                + "WHERE Ticket.id_boleto = ?";

        try (PreparedStatement pstmt = cn.prepareStatement(query)) {
            pstmt.setString(1, codigoConfirmacion);
            ResultSet result = pstmt.executeQuery();

            if (result.next()) {
                String originalString = result.getString("linkInfo");
                String modifiedString = originalString;

                // Ver si contiene 'watch?v='
                if (originalString.contains("watch?v=")) {
                    // Reemplazar 'watch?v=' con 'embed/'
                    modifiedString = originalString.replace("watch?v=", "embed/");
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



    //getCartelera()
    public List<Cartelera> getCartelera() {
        List<Cartelera> peliculas = new ArrayList<>();        
        try (Statement stmt = cn.createStatement()) {
            String query = "SELECT Cartelera.estado, Cartelera.fechaEstreno"+//
                    "    Pelicula.titulo, Pelicula.foto_poster,\n" + //
                    "    Pelicula.duracion, Sucursales.Provincia,\n" + //
                    "    Sucursales.cine, Horario.tandas, "+//
                    "    Pelicula.genero Sala.nombre_sala\n" + //
                    "FROM \n" + //
                    "    Cartelera\n" + //
                    "JOIN \n" + //
                    "    Pelicula ON Pelicula.ID_PELICULA = Cartelera.ID_PELICULA \n" + //
                    "JOIN \n" + //
                    "    Horario ON Horario.ID_horario = Cartelera.ID_horario  \n" + //
                    "JOIN \n" + //
                    "    Sucursal ON Sucursal.id_cartelera = Cartelera.id_cartelera  \n" + //
                    "JOIN \n" + //
                    "    Sucursales ON Sucursales.id_sucursal = Sucursal.id_sucursal \n" + //
                    "JOIN \n" + //
                    "    Sala ON Sala.id_sala = Horario.id_sala;";
            try (ResultSet result = stmt.executeQuery(query)) {
                while (result.next()) {
                    Cartelera cartelera = new Cartelera(
                            result.getBoolean("Cartelera.estado"),
                            result.getString("Pelicula.titulo"),
                            result.getString("Pelicula.genero"),
                            result.getString("Pelicula.duracion"),
                            result.getString("Pelicula.foto_poster"),
                            result.getString("Sucursales.Provincia"),
                            result.getString("Sucursales.cine"),
                            result.getString("Sala.nombre_sala"),
                            result.getString("Horario.tandas"),
                            result.getString("Cartelera.fechaEstreno")
                    );
                    peliculas.add(cartelera);                    
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error al obtener todas las películas: " + e.getMessage());
        }
        return peliculas;
    }
}