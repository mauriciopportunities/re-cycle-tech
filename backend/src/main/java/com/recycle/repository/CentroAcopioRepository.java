package com.recycle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.recycle.entity.CentroAcopio;

public interface CentroAcopioRepository extends JpaRepository<CentroAcopio, Long> {

    @Query(value = """
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
            ORDER BY distancia_km
            LIMIT :limite
            """, nativeQuery = true)
    List<Object[]> findCentrosCercanos(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("limite") int limite);
}