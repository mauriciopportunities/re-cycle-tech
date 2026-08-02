package com.recycle.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recycle.entity.Trazabilidad;
import com.recycle.entity.Usuario;
import com.recycle.security.JwtUtil;
import com.recycle.service.TrazabilidadService;
import com.recycle.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/trazabilidad")
@RequiredArgsConstructor
public class TrazabilidadController {

    private final TrazabilidadService trazabilidadService;
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    @GetMapping("/{residuoId}")
    public ResponseEntity<List<Trazabilidad>> getTrazabilidadByResiduo(@PathVariable Long residuoId) {
        List<Trazabilidad> trazabilidades = trazabilidadService.getTrazabilidadByResiduo(residuoId);
        return ResponseEntity.ok(trazabilidades);
    }

    /**
     * CORRECCIÓN: antes el "responsable" del cambio de estado era un
     * USUARIO_PRUEBA_ID fijo (=1L), sin importar quién hiciera la llamada.
     * Ahora se obtiene del JWT del usuario autenticado (mismo patrón que
     * ResiduoController), para que la trazabilidad quede correctamente
     * atribuida. El control de que solo OPERADOR_CENTRO/OPERADOR_TECNICO/
     * ADMIN puedan llamar este endpoint se aplica en SecurityConfig.
     */
    @PutMapping("/{residuoId}/estado")
    public ResponseEntity<?> cambiarEstado(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long residuoId,
            @RequestParam String nuevoEstado,
            @RequestParam(required = false) String observaciones) {

        try {
            String token = authHeader.substring(7);
            Long usuarioId = jwtUtil.extractUsuarioId(token);

            Usuario responsable = usuarioService.findById(usuarioId)
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
