package com.example.Cine.modelos;

public class QrLink {
    private boolean flag;
    private String url;
    private int cantidad;

    // CONSTRUCTORES//
    public QrLink(boolean flag, String url, int cantidad) {

        this.flag = flag;
        this.url = url;
        this.cantidad = cantidad;
    }

    public QrLink() {

    }

    // getter//
    public boolean getFlag() {
        return flag;
    }

    public String getUrl() {
        return url;
    }

    public int getCantidad() {
        return cantidad;
    }

}