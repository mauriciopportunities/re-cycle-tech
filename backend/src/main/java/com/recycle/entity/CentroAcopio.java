package com.recycle.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "centro_acopio")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CentroAcopio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String direccion;

    @Column(nullable = false)
    private Double latitud;

    @Column(nullable = false)
    private Double longitud;

    @Column(length = 20)
    private String telefono;

    @Column(length = 100)
    private String horario;

    @Column(length = 50)
    private String capacidad;

    @OneToMany(mappedBy = "centro")
    private List<Residuo> residuos;
} 