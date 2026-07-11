package com.recycle.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.recycle.entity.Residuo;
import com.recycle.entity.Usuario;
import com.recycle.repository.ResiduoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResiduoService {

    private final ResiduoRepository residuoRepository;

    public Residuo registrarResiduo(Residuo residuo) {
        // Validar que el residuo no sea null
        if (residuo == null) {
            throw new IllegalArgumentException("El residuo no puede ser null");
        }

        // Validar que el tipo no esté vacío
        if (residuo.getTipo() == null || residuo.getTipo().isEmpty()) {
            throw new RuntimeException("El tipo de residuo es obligatorio");
        }

        // Estado inicial por defecto
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