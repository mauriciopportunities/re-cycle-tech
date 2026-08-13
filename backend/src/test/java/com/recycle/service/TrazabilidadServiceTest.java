package com.recycle.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.recycle.entity.Residuo;
import com.recycle.entity.Trazabilidad;
import com.recycle.entity.Usuario;
import com.recycle.repository.ResiduoRepository;
import com.recycle.repository.TrazabilidadRepository;

@ExtendWith(MockitoExtension.class)
public class TrazabilidadServiceTest {

    @Mock
    private TrazabilidadRepository trazabilidadRepository;

    @Mock
    private ResiduoRepository residuoRepository;

    @InjectMocks
    private TrazabilidadService trazabilidadService;

    private Residuo residuo;
    private Usuario responsable;

    @BeforeEach
    void setUp() {
        responsable = Usuario.builder()
                .id(1L)
                .nombre("Operador Centro")
                .email("operador@test.com")
                .rol("OPERADOR_CENTRO")
                .build();

        residuo = Residuo.builder()
                .id(1L)
                .tipo("LAPTOP")
                .estado("REGISTRADO")
                .build();
    }

    @Test
    void testRegistrarCambioEstado_TransicionValida_DebeCrearTrazabilidad() {
        // Arrange
        String nuevoEstado = "RECIBIDO_EN_CENTRO";
        String observaciones = "Residuo recibido en centro de acopio";

        when(residuoRepository.findById(1L)).thenReturn(Optional.of(residuo));
        when(residuoRepository.save(any(Residuo.class))).thenReturn(residuo);
        when(trazabilidadRepository.save(any(Trazabilidad.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Trazabilidad resultado = trazabilidadService.registrarCambioEstado(
                1L, nuevoEstado, responsable, observaciones);

        // Assert
        assertNotNull(resultado);
        assertEquals("REGISTRADO", resultado.getEstadoAnterior());
        assertEquals("RECIBIDO_EN_CENTRO", resultado.getEstadoNuevo());
        assertEquals(responsable, resultado.getResponsable());
        assertEquals(observaciones, resultado.getObservaciones());
        assertEquals(residuo, resultado.getResiduo());

        // Verificar que se guardó el residuo actualizado
        verify(residuoRepository, times(1)).save(residuo);
        verify(trazabilidadRepository, times(1)).save(any(Trazabilidad.class));
    }

    @Test
    void testRegistrarCambioEstado_EstadoVacio_DebeLanzarExcepcion() {
        // Arrange
        String nuevoEstado = "";

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            trazabilidadService.registrarCambioEstado(1L, nuevoEstado, responsable, null);
        });

        // Verificar que no se llamó al repositorio
        verifyNoInteractions(residuoRepository);
        verifyNoInteractions(trazabilidadRepository);
    }

    @Test
    void testRegistrarCambioEstado_ResiduoNoExiste_DebeLanzarExcepcion() {
        // Arrange
        when(residuoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            trazabilidadService.registrarCambioEstado(99L, "RECICLADO", responsable, null);
        });

        assertEquals("Residuo no encontrado con id: 99", exception.getMessage());
    }

    @Test
    void testRegistrarCambioEstado_ActualizaEstadoDelResiduo() {
        // Arrange
        String nuevoEstado = "RECICLADO";
        String observaciones = "Residuo enviado a reciclaje";

        when(residuoRepository.findById(1L)).thenReturn(Optional.of(residuo));
        when(residuoRepository.save(any(Residuo.class))).thenAnswer(invocation -> {
            Residuo r = invocation.getArgument(0);
            assertEquals("RECICLADO", r.getEstado());
            return r;
        });
        when(trazabilidadRepository.save(any(Trazabilidad.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Trazabilidad resultado = trazabilidadService.registrarCambioEstado(
                1L, nuevoEstado, responsable, observaciones);

        // Assert
        assertNotNull(resultado);
        assertEquals("RECICLADO", resultado.getEstadoNuevo());

        // Verificar que el residuo fue guardado con el nuevo estado
        verify(residuoRepository, times(1)).save(any(Residuo.class));
    }
}