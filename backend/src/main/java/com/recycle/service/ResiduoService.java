package com.recycle.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.recycle.entity.Residuo;
import com.recycle.entity.Usuario;
import com.recycle.repository.ResiduoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResiduoService {

    private final ResiduoRepository residuoRepository;

    public Residuo registrarResiduo(Residuo residuo) {
        if (residuo == null) {
            throw new IllegalArgumentException("El residuo no puede ser null");
        }

        if (residuo.getTipo() == null || residuo.getTipo().isEmpty()) {
            throw new RuntimeException("El tipo de residuo es obligatorio");
        }

        if (residuo.getEstado() == null) {
            residuo.setEstado("REGISTRADO");
        }

        return residuoRepository.save(residuo);
    }

    public List<Residuo> getResiduosByUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("El usuario no puede ser null");
        }
        return residuoRepository.findByUsuario(usuario);
    }

    public Residuo getResiduoById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del residuo no puede ser null");
        }
        return residuoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Residuo no encontrado con id: " + id));
    }

    public List<Residuo> getAllResiduos() {
        return residuoRepository.findAll();
    }

    /**
     * FASE 4: Actualizar residuo.
     * Solo permitido si el residuo está en estado REGISTRADO.
     * Solo el dueño del residuo puede editarlo.
     */
    @Transactional
    public Residuo actualizarResiduo(Long id, Long usuarioId, Residuo datosActualizados) {
        Residuo residuo = getResiduoById(id);

        // Verificar que el usuario es el dueño
        if (!residuo.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalStateException("No tienes permiso para editar este residuo");
        }

        // Verificar que el residuo está en estado REGISTRADO
        if (!"REGISTRADO".equals(residuo.getEstado())) {
            throw new IllegalStateException("Solo se pueden editar residuos en estado REGISTRADO");
        }

        // Actualizar campos permitidos
        if (datosActualizados.getTipo() != null && !datosActualizados.getTipo().isEmpty()) {
            residuo.setTipo(datosActualizados.getTipo());
        }
        if (datosActualizados.getDescripcion() != null) {
            residuo.setDescripcion(datosActualizados.getDescripcion());
        }
        if (datosActualizados.getLatitud() != null) {
            residuo.setLatitud(datosActualizados.getLatitud());
        }
        if (datosActualizados.getLongitud() != null) {
            residuo.setLongitud(datosActualizados.getLongitud());
        }

        return residuoRepository.save(residuo);
    }

    /**
     * FASE 4: Eliminar residuo.
     * Solo permitido si el residuo está en estado REGISTRADO.
     * Solo el dueño del residuo puede eliminarlo.
     */
    @Transactional
    public void eliminarResiduo(Long id, Long usuarioId) {
        Residuo residuo = getResiduoById(id);

        // Verificar que el usuario es el dueño
        if (!residuo.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalStateException("No tienes permiso para eliminar este residuo");
        }

        // Verificar que el residuo está en estado REGISTRADO
        if (!"REGISTRADO".equals(residuo.getEstado())) {
            throw new IllegalStateException("Solo se pueden eliminar residuos en estado REGISTRADO");
        }

        residuoRepository.deleteById(id);
    }

    public Residuo actualizarEstado(Long id, String nuevoEstado) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del residuo no puede ser null");
        }
        if (nuevoEstado == null || nuevoEstado.isEmpty()) {
            throw new IllegalArgumentException("El nuevo estado no puede ser null o vacío");
        }
        Residuo residuo = getResiduoById(id);
        residuo.setEstado(nuevoEstado);
        return residuoRepository.save(residuo);
    }
}