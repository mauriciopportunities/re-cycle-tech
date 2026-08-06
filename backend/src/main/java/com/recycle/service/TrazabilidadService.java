package com.recycle.service;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.recycle.entity.Residuo;
import com.recycle.entity.Trazabilidad;
import com.recycle.entity.Usuario;
import com.recycle.repository.ResiduoRepository;
import com.recycle.repository.TrazabilidadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrazabilidadService {

    private final TrazabilidadRepository trazabilidadRepository;
    private final ResiduoRepository residuoRepository;

    public List<Trazabilidad> getTrazabilidadByResiduo(@NonNull Long residuoId) {
        Residuo residuo = residuoRepository.findById(residuoId)
                .orElseThrow(() -> new RuntimeException("Residuo no encontrado con id: " + residuoId));

        return trazabilidadRepository.findByResiduoOrderByFechaCambioAsc(residuo);
    }

    /**
     * Registra un cambio de estado como un nuevo evento de trazabilidad.
     * RNF-05: siempre se construye un Trazabilidad SIN id (nuevo), nunca se
     * reutiliza ni modifica un registro existente, para que quede como un
     * historial de solo-inserción (append-only).
     */
    public Trazabilidad registrarCambioEstado(@NonNull Long residuoId, @NonNull String nuevoEstado,
            @NonNull Usuario responsable, String observaciones) {

        if (nuevoEstado.isEmpty()) {
            throw new IllegalArgumentException("El nuevo estado no puede ser vacío");
        }

        Residuo residuo = residuoRepository.findById(residuoId)
                .orElseThrow(() -> new RuntimeException("Residuo no encontrado con id: " + residuoId));

        Trazabilidad trazabilidad = Trazabilidad.builder()
                .residuo(residuo)
                .estadoAnterior(residuo.getEstado())
                .estadoNuevo(nuevoEstado)
                .responsable(responsable)
                .observaciones(observaciones)
                .build();

        residuo.setEstado(nuevoEstado);
        residuoRepository.save(residuo);

        return trazabilidadRepository.save(trazabilidad);
    }
}
