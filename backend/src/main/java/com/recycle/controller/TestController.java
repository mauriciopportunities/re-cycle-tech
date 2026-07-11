package com.recycle.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "¡Re-Cycle Tech API funcionando correctamente!");
        response.put("estado", "✅ Éxito");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}