package com.example.Cine.modelos;


public class SucursalesPelicula {


    private int idSucursal;
    private int idPelicula;
    private int activo;


    public SucursalesPelicula() {
        
    }

    public SucursalesPelicula(int idSucursal, int idPelicula, int activo) {
        this.idSucursal = idSucursal;
        this.idPelicula = idPelicula;
        this.activo = activo;
    }

    public SucursalesPelicula(boolean b) {
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    public int getIdPelicula() {
        return idPelicula;
    }

    public void setIdPelicula(int idPelicula) {
        this.idPelicula = idPelicula;
    }

    public int getActivo() {
        return activo;
    }

    public void setActivo(int activo) {
        this.activo = activo;
    }

}