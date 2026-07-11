package com.recycle.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResiduoResponse {
    private Long id;
    private String tipo;
    private String descripcion;
    private String estado;
    private LocalDateTime fechaRegistro;
    private String centroNombre;
    private Long usuarioId;
}