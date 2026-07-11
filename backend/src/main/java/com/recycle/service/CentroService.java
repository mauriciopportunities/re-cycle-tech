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

    public List<CentroCercanoResponse> getCentrosCercanos(double lat, double lng, int limite) {
        List<Object[]> resultados = centroAcopioRepository.findCentrosCercanos(lat, lng, limite);

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
}