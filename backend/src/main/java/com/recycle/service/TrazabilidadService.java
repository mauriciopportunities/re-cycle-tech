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

        // ✅ @NonNull en residuoId
        public List<Trazabilidad> getTrazabilidadByResiduo(@NonNull Long residuoId) {
                Residuo residuo = residuoRepository.findById(residuoId)
                                .orElseThrow(() -> new RuntimeException("Residuo no encontrado con id: " + residuoId));
                return trazabilidadRepository.findByResiduoOrderByFechaCambioAsc(residuo);
        }

        // ✅ @NonNull en residuoId y nuevoEstado
        public Trazabilidad registrarCambioEstado(@NonNull Long residuoId, @NonNull String nuevoEstado,
                        Usuario responsable, String observaciones) {
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

                // ✅ @NonNull en trazabilidad
                return guardarTrazabilidad(trazabilidad);
        }

        // ✅ @NonNull en trazabilidad
        public Trazabilidad guardarTrazabilidad(@NonNull Trazabilidad trazabilidad) {
                return trazabilidadRepository.save(trazabilidad);
        }
}