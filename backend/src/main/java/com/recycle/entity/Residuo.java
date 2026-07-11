package com.recycle.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "residuo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Residuo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "centro_id")
    private CentroAcopio centro;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Double latitud;
    private Double longitud;

    @Builder.Default
    @Column(length = 30)
    private String estado = "REGISTRADO";

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @OneToMany(mappedBy = "residuo", cascade = CascadeType.ALL)
    private List<Trazabilidad> trazabilidades;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
} 