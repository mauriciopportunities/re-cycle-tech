package com.recycle.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
     * coordenada dada.
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

    // ============ CRUD COMPLETO (FASE 4) ============

    @Transactional
    public CentroAcopio crearCentro(CentroAcopio centro) {
        validarCentro(centro);
        return centroAcopioRepository.save(centro);
    }

    @Transactional
    public CentroAcopio actualizarCentro(Long id, CentroAcopio centroActualizado) {
        CentroAcopio centroExistente = getCentroById(id);
        validarCentro(centroActualizado);

        centroExistente.setNombre(centroActualizado.getNombre());
        centroExistente.setDireccion(centroActualizado.getDireccion());
        centroExistente.setLatitud(centroActualizado.getLatitud());
        centroExistente.setLongitud(centroActualizado.getLongitud());
        centroExistente.setTelefono(centroActualizado.getTelefono());
        centroExistente.setHorario(centroActualizado.getHorario());
        centroExistente.setCapacidad(centroActualizado.getCapacidad());

        return centroAcopioRepository.save(centroExistente);
    }

    @Transactional
    public void eliminarCentro(Long id) {
        CentroAcopio centro = getCentroById(id);

        // Verificar que no tenga residuos asociados
        if (centro.getResiduos() != null && !centro.getResiduos().isEmpty()) {
            throw new IllegalStateException(
                    "No se puede eliminar el centro porque tiene residuos asociados. " +
                            "Reasigne los residuos antes de eliminar.");
        }

        centroAcopioRepository.deleteById(id);
    }

    // ============ VALIDACIONES ============

    private void validarCentro(CentroAcopio centro) {
        if (centro == null) {
            throw new IllegalArgumentException("El centro no puede ser null");
        }
        if (centro.getNombre() == null || centro.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del centro es obligatorio");
        }
        if (centro.getDireccion() == null || centro.getDireccion().trim().isEmpty()) {
            throw new IllegalArgumentException("La dirección del centro es obligatoria");
        }
        validarCoordenadas(centro.getLatitud(), centro.getLongitud());
    }

    private void validarCoordenadas(Double latitud, Double longitud) {
        if (latitud == null || longitud == null) {
            throw new IllegalArgumentException("Latitud y longitud son obligatorias");
        }
        if (latitud < -90 || latitud > 90) {
            throw new IllegalArgumentException("Latitud debe estar entre -90 y 90");
        }
        if (longitud < -180 || longitud > 180) {
            throw new IllegalArgumentException("Longitud debe estar entre -180 y 180");
        }
    }
}