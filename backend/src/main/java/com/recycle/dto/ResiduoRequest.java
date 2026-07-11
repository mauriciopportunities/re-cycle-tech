package com.recycle.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResiduoRequest {

    @NotBlank(message = "El tipo de residuo es obligatorio")
    private String tipo;

    private String descripcion;

    private Double latitud;
    private Double longitud;

    private String estadoEquipo;
}