package com.recycle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recycle.entity.Residuo;
import com.recycle.entity.Trazabilidad;

public interface TrazabilidadRepository extends JpaRepository<Trazabilidad, Long> {
    List<Trazabilidad> findByResiduoOrderByFechaCambioAsc(Residuo residuo);
}