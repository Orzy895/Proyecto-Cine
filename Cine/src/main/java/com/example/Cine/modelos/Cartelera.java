package com.example.Cine.modelos;

public class Cartelera {
    private String Provincia;
    private String hora;
    private String titulo;
    private String genero;
    private String cine;
    private String sala;
    private String duracion;
    private boolean estado;
    private String foto_poster;
    private String fechaEstreno;

    //CONSTRUCTORES//
    public Cartelera(boolean estado, String Provincia, String hora, String titulo, String cine, String sala,
     String duracion, String foto_poster, String genero, String fechaEstreno) {
        
        this.Provincia = Provincia;
        this.hora = hora;
        this.titulo = titulo;
        this.cine = cine;
        this.sala = sala;
        this.duracion = duracion;
        this.estado = estado;
        this.foto_poster = foto_poster;
        this.genero = genero;
        this.fechaEstreno = fechaEstreno;
        
    }
   
    public Cartelera() {

    }
        
    public String getProvincia() {
        return this.Provincia;
    }
    
    public String getHora() {
        return this.hora;
    }
    
    public String gettitulo() {
        return this.titulo;
    }
    
    public String getcine() {
        return this.cine;
    }
    
    public String getsala() {
        return this.sala;
    }
    
    public String getDuracion() {
        return this.duracion;
    }
       
    public boolean getEstado() {
        return this.estado;
    }
    
    public String getFoto_poster() {
        return this.foto_poster;
    }

    public String getgenero() {
        return this.genero;
    }

    public String getfechaEstreno() {
        return this.fechaEstreno;
    }
}