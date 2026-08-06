package com.recycle.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.recycle.entity.Residuo;
import com.recycle.entity.Trazabilidad;

/**
 * RNF-05 (trazabilidad inmutable): a propósito NO extiende JpaRepository ni
 * CrudRepository. Solo se declaran los métodos que el negocio necesita
 * (crear y consultar). Como la interfaz nunca expone deleteById/delete/
 * deleteAll ni un update explícito, no hay forma de borrar o reemplazar un
 * registro de trazabilidad a través del repositorio: solo se puede insertar
 * (save con un objeto sin id) y leer. Esto se refuerza además a nivel de
 * base de datos con un trigger en database/schema.sql.
 */
public interface TrazabilidadRepository extends Repository<Trazabilidad, Long> {

    Trazabilidad save(Trazabilidad trazabilidad);

    Optional<Trazabilidad> findById(Long id);

    List<Trazabilidad> findByResiduoOrderByFechaCambioAsc(Residuo residuo);
}
