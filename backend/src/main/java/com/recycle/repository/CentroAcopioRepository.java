package com.recycle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.recycle.entity.CentroAcopio;

public interface CentroAcopioRepository extends JpaRepository<CentroAcopio, Long> {

    /**
     * Devuelve los centros de acopio dentro de un radio (en km) de la
     * coordenada dada, ordenados por distancia ascendente.
     *
     * CORRECCIÓN (Fase 3 / hallazgo Fase 2 "Radio de búsqueda inconsistente"):
     * antes este query aplicaba LIMIT :limite (cantidad de centros, sin
     * filtrar por distancia), lo que contradecía RF-07 ("centros dentro de
     * 5 km"). Ahora filtra explícitamente por distancia <= :radioKm usando
     * una subconsulta, porque las columnas calculadas (distancia_km) no se
     * pueden referenciar directamente en un WHERE del mismo SELECT.
     */
    @Query(value = """
            SELECT * FROM (
                SELECT
                    id,
                    nombre,
                    direccion,
                    latitud,
                    longitud,
                    telefono,
                    horario,
                    capacidad,
                    (6371 * acos(
                        cos(radians(:lat)) * cos(radians(latitud)) *
                        cos(radians(longitud) - radians(:lng)) +
                        sin(radians(:lat)) * sin(radians(latitud))
                    )) AS distancia_km
                FROM centro_acopio
            ) sub
            WHERE distancia_km <= :radioKm
            ORDER BY distancia_km
            """, nativeQuery = true)
    List<Object[]> findCentrosCercanos(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radioKm") double radioKm);
}
