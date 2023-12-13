package com.example.Cine.modelos;

public class Usuarios {
    private int id_usuario; 
    private String nombre; 
    private String apellido;  
    private String email;  
    private String telefono;  
    private String tipoUsuario;  
    private String contrasena;  
    private String confirmarContrasena;   
    private String fechaNacimiento; 
    private byte[] peliculas_Vistas;
    
    public Usuarios(){
    }
    
    //Constructor para iniciar sesiÃ³n
    public Usuarios(String email, String contrasena) {
        this.email = email;
        this.contrasena = contrasena;
    }
    
    public int getId_usuario() {
        return id_usuario;
    }
    public void setId_usuario(int id_usuario) {
        this.id_usuario = id_usuario;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getApellido() {
        return apellido;
    }
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getTipoUsuario() {
        return tipoUsuario;
    }
    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }
    public String getContrasena() {
        return contrasena;
    }
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    public String getConfirmarContrasena() {
        return confirmarContrasena;
    }
    public void setConfirmarContrasena(String confirmarContrasena) {
        this.confirmarContrasena = confirmarContrasena;
    }
    public String getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    public byte[] getPeliculas_Vistas() {
        return peliculas_Vistas;
    }
    public void setPeliculas_Vistas(byte[] peliculas_Vistas) {
        this.peliculas_Vistas = peliculas_Vistas;
    }  
    public Usuarios(int id_usuario, String nombre, String apellido, String email, String telefono, String tipoUsuario,
    String contrasena, String confirmarContrasena, String fechaNacimiento, byte[] peliculas_Vistas) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.telefono = telefono;
    this.tipoUsuario = tipoUsuario;
    this.contrasena = contrasena;
    this.confirmarContrasena = confirmarContrasena;
    this.fechaNacimiento = fechaNacimiento;
    this.peliculas_Vistas = peliculas_Vistas;
}

	public String getCorreo() {
		return email; 
	} 
}