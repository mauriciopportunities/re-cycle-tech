package com.recycle.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trazabilidad")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trazabilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "residuo_id", nullable = false)
    @JsonIgnore // ✅ Evita el bucle infinito con Residuo
    private Residuo residuo;

    @Column(name = "estado_anterior", length = 30)
    private String estadoAnterior;

    @Column(name = "estado_nuevo", nullable = false, length = 30)
    private String estadoNuevo;

    @ManyToOne
    @JoinColumn(name = "responsable_id")
    private Usuario responsable;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_cambio")
    private LocalDateTime fechaCambio;

    @PrePersist
    protected void onCreate() {
        fechaCambio = LocalDateTime.now();
    }
}