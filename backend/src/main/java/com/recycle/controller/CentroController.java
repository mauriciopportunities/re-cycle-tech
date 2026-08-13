package com.recycle.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recycle.dto.CentroCercanoResponse;
import com.recycle.entity.CentroAcopio;
import com.recycle.service.CentroService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/centros")
@RequiredArgsConstructor
public class CentroController {

    private final CentroService centroService;

    // ============ ENDPOINTS PÚBLICOS (SOLO LECTURA) ============

    /**
     * RF-07: Consulta de centros cercanos por radio real en kilómetros.
     */
    @GetMapping("/cercanos")
    public ResponseEntity<List<CentroCercanoResponse>> getCentrosCercanos(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radioKm) {

        List<CentroCercanoResponse> centros = centroService.getCentrosCercanos(lat, lng, radioKm);
        return ResponseEntity.ok(centros);
    }

    @GetMapping
    public ResponseEntity<List<CentroAcopio>> getAllCentros() {
        return ResponseEntity.ok(centroService.getAllCentros());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CentroAcopio> getCentroById(@PathVariable Long id) {
        return ResponseEntity.ok(centroService.getCentroById(id));
    }

    // ============ ENDPOINTS SOLO ADMIN ============

    /**
     * RF-09: Crear centro de acopio (solo ADMIN).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CentroAcopio> crearCentro(@RequestBody CentroAcopio centro) {
        CentroAcopio nuevoCentro = centroService.crearCentro(centro);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCentro);
    }

    /**
     * RF-10: Actualizar centro de acopio (solo ADMIN).
     * CORRECCIÓN FASE 4: Antes no existía este endpoint.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CentroAcopio> actualizarCentro(
            @PathVariable Long id,
            @RequestBody CentroAcopio centroActualizado) {
        CentroAcopio centro = centroService.actualizarCentro(id, centroActualizado);
        return ResponseEntity.ok(centro);
    }

    /**
     * RF-11: Eliminar centro de acopio (solo ADMIN).
     * CORRECCIÓN FASE 4: Antes no existía este endpoint.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> eliminarCentro(@PathVariable Long id) {
        centroService.eliminarCentro(id);
        return ResponseEntity.ok(Map.of("mensaje", "Centro eliminado exitosamente"));
    }
}