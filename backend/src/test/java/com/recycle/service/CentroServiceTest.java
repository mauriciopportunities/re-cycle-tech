package com.recycle.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.recycle.dto.CentroCercanoResponse;
import com.recycle.repository.CentroAcopioRepository;

@ExtendWith(MockitoExtension.class)
public class CentroServiceTest {

    @Mock
    private CentroAcopioRepository centroAcopioRepository;

    @InjectMocks
    private CentroService centroService;

    private Object[] centroCercano1;
    private Object[] centroCercano2;
    private Object[] centroLejano;

    @BeforeEach
    void setUp() {
        // Simular resultados del query nativo
        centroCercano1 = new Object[] { 1L, "MARN", "Dirección 1", 13.6724, -89.2621,
                "503-2132-6000", "Lun-Vie", "1000 kg/día", 3.5 };
        centroCercano2 = new Object[] { 2L, "SRS", "Dirección 2", 13.6899, -89.2486,
                "503-2511-7000", "Lun-Vie", "500 kg/día", 2.1 };
        centroLejano = new Object[] { 3L, "Centro Lejano", "Dirección 3", 14.0, -89.0,
                "503-0000-0000", "Lun-Vie", "100 kg/día", 25.0 };
    }

    @Test
    void testGetCentrosCercanos_Radio5Km_DebeRetornarSoloCentrosDentroDelRadio() {
        // Arrange
        double lat = 13.6929;
        double lng = -89.2182;
        double radioKm = 5.0;

        List<Object[]> resultados = Arrays.asList(centroCercano1, centroCercano2);

        when(centroAcopioRepository.findCentrosCercanos(lat, lng, radioKm))
                .thenReturn(resultados);

        // Act
        List<CentroCercanoResponse> response = centroService.getCentrosCercanos(lat, lng, radioKm);

        // Assert
        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals("MARN", response.get(0).getNombre());
        assertEquals(3.5, response.get(0).getDistanciaKm());
        assertEquals("SRS", response.get(1).getNombre());
        assertEquals(2.1, response.get(1).getDistanciaKm());

        // Verificar que todas las distancias están dentro del radio
        assertTrue(response.stream().allMatch(c -> c.getDistanciaKm() <= radioKm));

        // Verificar que el repositorio fue llamado con los parámetros correctos
        verify(centroAcopioRepository, times(1)).findCentrosCercanos(lat, lng, radioKm);
    }

    @Test
    void testGetCentrosCercanos_RadioCero_DebeLanzarExcepcion() {
        // Arrange
        double lat = 13.6929;
        double lng = -89.2182;
        double radioKm = 0.0;

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            centroService.getCentrosCercanos(lat, lng, radioKm);
        });

        // Verificar que el repositorio NO fue llamado
        verifyNoInteractions(centroAcopioRepository);
    }

    @Test
    void testGetCentrosCercanos_RadioInvalido_DebeLanzarExcepcion() {
        // Arrange
        double lat = 13.6929;
        double lng = -89.2182;
        double radioKm = -5.0;

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            centroService.getCentrosCercanos(lat, lng, radioKm);
        });

        // Verificar que el repositorio NO fue llamado
        verifyNoInteractions(centroAcopioRepository);
    }

    @Test
    void testGetCentrosCercanos_CoordenadasInvalidas_DebeLanzarExcepcion() {
        // Arrange
        double latInvalida = 95.0; // Fuera de rango (-90 a 90)
        double lng = -89.2182;
        double radioKm = 5.0;

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            centroService.getCentrosCercanos(latInvalida, lng, radioKm);
        });
    }
}