package com.recycle.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.recycle.entity.CentroAcopio;
import com.recycle.repository.CentroAcopioRepository;

/**
 * RF-09, RF-10, RF-11: CRUD de centros de acopio.
 * 
 * CORRECCIÓN FASE 4: Pruebas para crear, actualizar y eliminar centros
 * con validación de datos y autorización.
 */
@ExtendWith(MockitoExtension.class)
public class CentroCrudTest {

    @Mock
    private CentroAcopioRepository centroAcopioRepository;

    @InjectMocks
    private CentroService centroService;

    private CentroAcopio centroValido;

    @BeforeEach
    void setUp() {
        centroValido = CentroAcopio.builder()
                .id(1L)
                .nombre("Centro Test")
                .direccion("Dirección Test 123")
                .latitud(13.6929)
                .longitud(-89.2182)
                .telefono("503-1234-5678")
                .horario("Lun-Vie 8:00-17:00")
                .capacidad("500 kg/día")
                .build();
    }

    @Test
    void testCrearCentro_Valido_DebeGuardar() {
        // Arrange
        when(centroAcopioRepository.save(any(CentroAcopio.class))).thenReturn(centroValido);

        // Act
        CentroAcopio resultado = centroService.crearCentro(centroValido);

        // Assert
        assertNotNull(resultado);
        assertEquals("Centro Test", resultado.getNombre());
        assertEquals("Dirección Test 123", resultado.getDireccion());
        verify(centroAcopioRepository, times(1)).save(centroValido);
    }

    @Test
    void testCrearCentro_SinNombre_DebeLanzarExcepcion() {
        // Arrange
        CentroAcopio centroInvalido = CentroAcopio.builder()
                .direccion("Dirección Test")
                .latitud(13.6929)
                .longitud(-89.2182)
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            centroService.crearCentro(centroInvalido);
        });

        verify(centroAcopioRepository, times(0)).save(any(CentroAcopio.class));
    }

    @Test
    void testCrearCentro_CoordenadasInvalidas_DebeLanzarExcepcion() {
        // Arrange
        CentroAcopio centroInvalido = CentroAcopio.builder()
                .nombre("Centro Test")
                .direccion("Dirección Test")
                .latitud(95.0) // Inválida
                .longitud(-89.2182)
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            centroService.crearCentro(centroInvalido);
        });
    }

    @Test
    void testActualizarCentro_Existente_DebeActualizar() {
        // Arrange
        CentroAcopio centroActualizado = CentroAcopio.builder()
                .nombre("Centro Actualizado")
                .direccion("Nueva Dirección 456")
                .latitud(13.7000)
                .longitud(-89.2200)
                .telefono("503-9999-9999")
                .horario("Lun-Dom 8:00-18:00")
                .capacidad("800 kg/día")
                .build();

        when(centroAcopioRepository.findById(1L)).thenReturn(Optional.of(centroValido));
        when(centroAcopioRepository.save(any(CentroAcopio.class))).thenReturn(centroValido);

        // Act
        CentroAcopio resultado = centroService.actualizarCentro(1L, centroActualizado);

        // Assert
        assertNotNull(resultado);
        assertEquals("Centro Actualizado", resultado.getNombre());
        assertEquals("Nueva Dirección 456", resultado.getDireccion());
        verify(centroAcopioRepository, times(1)).save(centroValido);
    }

    @Test
    void testActualizarCentro_NoExistente_DebeLanzarExcepcion() {
        // Arrange
        when(centroAcopioRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            centroService.actualizarCentro(99L, centroValido);
        });
    }

    @Test
    void testEliminarCentro_Existente_DebeEliminar() {
        // Arrange
        when(centroAcopioRepository.findById(1L)).thenReturn(Optional.of(centroValido));
        doNothing().when(centroAcopioRepository).deleteById(1L);

        // Act & Assert
        assertDoesNotThrow(() -> centroService.eliminarCentro(1L));
        verify(centroAcopioRepository, times(1)).deleteById(1L);
    }

    @Test
    void testEliminarCentro_NoExistente_DebeLanzarExcepcion() {
        // Arrange
        when(centroAcopioRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            centroService.eliminarCentro(99L);
        });
    }
}