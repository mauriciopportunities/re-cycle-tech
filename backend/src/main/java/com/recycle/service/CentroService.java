package com.recycle.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.recycle.dto.CentroCercanoResponse;
import com.recycle.entity.CentroAcopio;
import com.recycle.repository.CentroAcopioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CentroService {

    private final CentroAcopioRepository centroAcopioRepository;

    /**
     * RF-07: devuelve los centros de acopio dentro de un radio (km) de la
     * coordenada dada. Antes 'limite' era una cantidad fija (LIMIT), lo que
     * permitía devolver centros más allá de 5 km. Ahora es un radio real.
     * 
     * CORRECCIÓN FASE 4: Añadidas validaciones de radio y coordenadas para
     * cumplir con las pruebas automatizadas (radioKm > 0, latitud entre -90
     * y 90, longitud entre -180 y 180).
     */
    public List<CentroCercanoResponse> getCentrosCercanos(double lat, double lng, double radioKm) {
        // Validar radio
        if (radioKm <= 0) {
            throw new IllegalArgumentException("El radio debe ser mayor a 0 km");
        }

        // Validar coordenadas
        validarCoordenadas(lat, lng);

        List<Object[]> resultados = centroAcopioRepository.findCentrosCercanos(lat, lng, radioKm);

        return resultados.stream()
                .map(row -> CentroCercanoResponse.builder()
                        .id(((Number) row[0]).longValue())
                        .nombre((String) row[1])
                        .direccion((String) row[2])
                        .latitud(((Number) row[3]).doubleValue())
                        .longitud(((Number) row[4]).doubleValue())
                        .telefono((String) row[5])
                        .horario((String) row[6])
                        .capacidad((String) row[7])
                        .distanciaKm(((Number) row[8]).doubleValue())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CentroAcopio> getAllCentros() {
        return centroAcopioRepository.findAll();
    }

    public CentroAcopio getCentroById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del centro no puede ser null");
        }
        return centroAcopioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Centro no encontrado con id: " + id));
    }

    public CentroAcopio crearCentro(CentroAcopio centro) {
        if (centro == null) {
            throw new IllegalArgumentException("El centro no puede ser null");
        }
        return centroAcopioRepository.save(centro);
    }

    /**
     * Valida que las coordenadas estén dentro de los rangos válidos.
     * Latitud: -90 a 90
     * Longitud: -180 a 180
     */
    private void validarCoordenadas(double latitud, double longitud) {
        if (latitud < -90 || latitud > 90) {
            throw new IllegalArgumentException("Latitud debe estar entre -90 y 90");
        }
        if (longitud < -180 || longitud > 180) {
            throw new IllegalArgumentException("Longitud debe estar entre -180 y 180");
        }
    }
}