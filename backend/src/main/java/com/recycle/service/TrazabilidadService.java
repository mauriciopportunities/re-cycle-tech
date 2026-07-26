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
                System.out.println("🔍 DEBUG: getTrazabilidadByResiduo llamado con ID: " + residuoId);

                Residuo residuo = residuoRepository.findById(residuoId)
                                .orElseThrow(() -> new RuntimeException("Residuo no encontrado con id: " + residuoId));

                List<Trazabilidad> resultado = trazabilidadRepository.findByResiduoOrderByFechaCambioAsc(residuo);
                System.out.println("🔍 DEBUG: getTrazabilidadByResiduo devuelve " + resultado.size() + " registros");

                return resultado;
        }

        public Trazabilidad registrarCambioEstado(@NonNull Long residuoId, @NonNull String nuevoEstado,
                        Usuario responsable, String observaciones) {

                System.out.println("🔍 DEBUG: registrarCambioEstado llamado con residuoId=" + residuoId
                                + ", nuevoEstado=" + nuevoEstado);
                System.out.println("🔍 DEBUG: responsable=" + (responsable != null ? responsable.getNombre() : "null")
                                + ", observaciones=" + observaciones);

                if (nuevoEstado.isEmpty()) {
                        throw new IllegalArgumentException("El nuevo estado no puede ser vacío");
                }

                Residuo residuo = residuoRepository.findById(residuoId)
                                .orElseThrow(() -> new RuntimeException("Residuo no encontrado con id: " + residuoId));

                System.out.println("🔍 DEBUG: Residuo encontrado, estado actual=" + residuo.getEstado() + ", tipo="
                                + residuo.getTipo());

                Trazabilidad trazabilidad = Trazabilidad.builder()
                                .residuo(residuo)
                                .estadoAnterior(residuo.getEstado())
                                .estadoNuevo(nuevoEstado)
                                .responsable(responsable)
                                .observaciones(observaciones)
                                .build();

                System.out.println("🔍 DEBUG: Trazabilidad creada: estadoAnterior=" + trazabilidad.getEstadoAnterior() +
                                ", estadoNuevo=" + trazabilidad.getEstadoNuevo());

                residuo.setEstado(nuevoEstado);
                residuoRepository.save(residuo);
                System.out.println("🔍 DEBUG: Residuo actualizado en BD");

                // Guardar trazabilidad
                Trazabilidad saved = trazabilidadRepository.save(trazabilidad);
                System.out.println("🔍 DEBUG: Trazabilidad guardada con ID: " + saved.getId());

                return saved;
        }

        public Trazabilidad guardarTrazabilidad(@NonNull Trazabilidad trazabilidad) {
                System.out.println("🔍 DEBUG: guardarTrazabilidad llamado");
                return trazabilidadRepository.save(trazabilidad);
        }
}