package com.recycle.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping("/cercanos")
    public ResponseEntity<List<CentroCercanoResponse>> getCentrosCercanos(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") int limite) {

        List<CentroCercanoResponse> centros = centroService.getCentrosCercanos(lat, lng, limite);
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

    @PostMapping
    public ResponseEntity<CentroAcopio> crearCentro(@RequestBody CentroAcopio centro) {
        return ResponseEntity.ok(centroService.crearCentro(centro));
    }
}