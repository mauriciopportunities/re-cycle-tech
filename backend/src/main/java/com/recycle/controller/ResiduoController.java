package com.recycle.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recycle.dto.ResiduoRequest;
import com.recycle.dto.ResiduoResponse;
import com.recycle.entity.Residuo;
import com.recycle.entity.Usuario;
import com.recycle.security.JwtUtil;
import com.recycle.service.ResiduoService;
import com.recycle.service.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/residuos")
@RequiredArgsConstructor
public class ResiduoController {

    private final ResiduoService residuoService;
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> registrarResiduo(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ResiduoRequest request) {
        try {
            String token = authHeader.substring(7);
            Long usuarioId = jwtUtil.extractUsuarioId(token);

            Usuario usuario = usuarioService.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Residuo residuo = Residuo.builder()
                    .usuario(usuario)
                    .tipo(request.getTipo())
                    .descripcion(request.getDescripcion())
                    .latitud(request.getLatitud())
                    .longitud(request.getLongitud())
                    .estado("REGISTRADO")
                    .build();

            Residuo saved = residuoService.registrarResiduo(residuo);

            ResiduoResponse response = ResiduoResponse.builder()
                    .id(saved.getId())
                    .tipo(saved.getTipo())
                    .descripcion(saved.getDescripcion())
                    .estado(saved.getEstado())
                    .fechaRegistro(saved.getFechaRegistro())
                    .usuarioId(saved.getUsuario().getId())
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/mis-residuos")
    public ResponseEntity<List<ResiduoResponse>> getMisResiduos(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long usuarioId = jwtUtil.extractUsuarioId(token);

        Usuario usuario = usuarioService.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Residuo> residuos = residuoService.getResiduosByUsuario(usuario);

        List<ResiduoResponse> responses = residuos.stream()
                .map(r -> ResiduoResponse.builder()
                        .id(r.getId())
                        .tipo(r.getTipo())
                        .descripcion(r.getDescripcion())
                        .estado(r.getEstado())
                        .fechaRegistro(r.getFechaRegistro())
                        .usuarioId(r.getUsuario().getId())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResiduoResponse> getResiduoById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        // Verificar token (opcional, pero se puede usar para logging)
        Residuo residuo = residuoService.getResiduoById(id);

        ResiduoResponse response = ResiduoResponse.builder()
                .id(residuo.getId())
                .tipo(residuo.getTipo())
                .descripcion(residuo.getDescripcion())
                .estado(residuo.getEstado())
                .fechaRegistro(residuo.getFechaRegistro())
                .usuarioId(residuo.getUsuario().getId())
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        try {
            Residuo residuo = residuoService.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Estado actualizado",
                    "nuevoEstado", residuo.getEstado()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ NUEVO ENDPOINT: Obtener todos los residuos (solo para operadores y admin)
    @GetMapping("/todos")
    public ResponseEntity<List<ResiduoResponse>> getAllResiduos() {
        List<Residuo> residuos = residuoService.getAllResiduos();

        List<ResiduoResponse> responses = residuos.stream()
                .map(r -> ResiduoResponse.builder()
                        .id(r.getId())
                        .tipo(r.getTipo())
                        .descripcion(r.getDescripcion())
                        .estado(r.getEstado())
                        .fechaRegistro(r.getFechaRegistro())
                        .usuarioId(r.getUsuario().getId())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}