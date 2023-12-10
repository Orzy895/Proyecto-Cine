package com.example.Cine.modelos;


public class PasoQr {
    private String Sede;
    private String Pelicula;
    private int Sala;
    private String Fecha;
    private String Hora;
    private int Boletos;    


    // CONSTRUCTORES//
    public PasoQr(String Sede, String Pelicula, int Sala, String Fecha, String Hora,
            int Boletos) {

        this.Sede = Sede;
        this.Pelicula = Pelicula;
        this.Sala = Sala;
        this.Fecha = Fecha;
        this.Hora = Hora;
        this.Boletos = Boletos;        
    }

    public PasoQr() {}

    // getter//

    public String getSede() {
        return Sede;
    }

    public String getPelicula() {
        return Pelicula;
    }

    public int getSala() {
        return Sala;
    }

    public String getFecha() {
        return Fecha;
    }

    public String getHora() {
        return Hora;
    }

    public int getBoletos() {
        return Boletos;
    }

}
