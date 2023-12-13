package com.example.Cine.modelos;

public class Oferta {
    private String id_oferta;
    private String feInicio;
    private String feFinal;
    private String titulo;
    private String detalles;
    private int id_cartelera;
    private String foto_inte;
    
    public Oferta() {
    }

    public Oferta(String id_oferta, String feInicio, String feFinal, String titulo, String detalles, int id_cartelera,
            String foto_inte) {
        this.id_oferta = id_oferta;
        this.feInicio = feInicio;
        this.feFinal = feFinal;
        this.titulo = titulo;
        this.detalles = detalles;
        this.id_cartelera = id_cartelera;
        this.foto_inte = foto_inte;
    }
    public String getId_oferta() {
        return id_oferta;
    }
    public String getFeInicio() {
        return feInicio;
    }
    public String getFeFinal() {
        return feFinal;
    }
    public String getTitulo() {
        return titulo;
    }
    public String getDetalles() {
        return detalles;
    }
    public int getId_cartelera() {
        return id_cartelera;
    }
    public String getFoto_inte() {
        return foto_inte;
    }

    
}
