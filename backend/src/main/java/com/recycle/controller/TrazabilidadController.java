package com.recycle.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recycle.entity.Trazabilidad;
import com.recycle.entity.Usuario;
import com.recycle.service.TrazabilidadService;
import com.recycle.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/trazabilidad")
@RequiredArgsConstructor
public class TrazabilidadController {

    private final TrazabilidadService trazabilidadService;
    private final UsuarioService usuarioService;

    // ⚠️ TEMPORAL: Usuario fijo para pruebas
    private Long USUARIO_PRUEBA_ID = 1L;

    @GetMapping("/{residuoId}")
    public ResponseEntity<List<Trazabilidad>> getTrazabilidadByResiduo(@PathVariable Long residuoId) {
        List<Trazabilidad> trazabilidades = trazabilidadService.getTrazabilidadByResiduo(residuoId);
        return ResponseEntity.ok(trazabilidades);
    }

    @PutMapping("/{residuoId}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long residuoId,
            @RequestParam String nuevoEstado,
            @RequestParam(required = false) String observaciones) {

        try {
            Usuario responsable = usuarioService.findById(USUARIO_PRUEBA_ID)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Trazabilidad trazabilidad = trazabilidadService.registrarCambioEstado(
                    residuoId, nuevoEstado, responsable, observaciones);

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Estado actualizado",
                    "trazabilidadId", trazabilidad.getId(),
                    "nuevoEstado", nuevoEstado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}