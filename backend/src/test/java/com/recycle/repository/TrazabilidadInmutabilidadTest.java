package com.recycle.repository;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

/**
 * RNF-05: Trazabilidad inmutable.
 * 
 * Esta prueba verifica que la interfaz TrazabilidadRepository NO extiende
 * JpaRepository ni CrudRepository, por lo que no expone métodos de
 * modificación o eliminación (deleteById, delete, deleteAll, etc.).
 * 
 * La inmutabilidad se refuerza además con un trigger en PostgreSQL.
 */
public class TrazabilidadInmutabilidadTest {

    @Test
    void testTrazabilidadRepository_NoDebeExtenderJpaRepository() {
        // Obtener las interfaces que implementa TrazabilidadRepository
        Class<?>[] interfaces = TrazabilidadRepository.class.getInterfaces();

        // Verificar que NO extiende JpaRepository
        for (Class<?> interfaz : interfaces) {
            assertNotEquals(
                    "org.springframework.data.jpa.repository.JpaRepository",
                    interfaz.getName(),
                    "TrazabilidadRepository NO debe extender JpaRepository");
        }
    }

    @Test
    void testTrazabilidadRepository_NoDebeExtenderCrudRepository() {
        // Obtener las interfaces que implementa TrazabilidadRepository
        Class<?>[] interfaces = TrazabilidadRepository.class.getInterfaces();

        // Verificar que NO extiende CrudRepository
        for (Class<?> interfaz : interfaces) {
            assertNotEquals(
                    "org.springframework.data.repository.CrudRepository",
                    interfaz.getName(),
                    "TrazabilidadRepository NO debe extender CrudRepository");
        }
    }

    @Test
    void testTrazabilidadRepository_NoDebeTenerMetodoDeleteById() {
        // Verificar que NO existe el método deleteById
        assertThrows(NoSuchMethodException.class, () -> {
            TrazabilidadRepository.class.getMethod("deleteById", Long.class);
        }, "TrazabilidadRepository NO debe tener método deleteById");
    }

    @Test
    void testTrazabilidadRepository_NoDebeTenerMetodoDelete() {
        // Verificar que NO existe el método delete
        assertThrows(NoSuchMethodException.class, () -> {
            TrazabilidadRepository.class.getMethod("delete", Object.class);
        }, "TrazabilidadRepository NO debe tener método delete");
    }

    @Test
    void testTrazabilidadRepository_NoDebeTenerMetodoDeleteAll() {
        // Verificar que NO existe el método deleteAll
        assertThrows(NoSuchMethodException.class, () -> {
            TrazabilidadRepository.class.getMethod("deleteAll");
        }, "TrazabilidadRepository NO debe tener método deleteAll");
    }

    @Test
    void testTrazabilidadRepository_SoloDebeTenerMetodosPermitidos() {
        // Obtener todos los métodos declarados
        java.lang.reflect.Method[] metodos = TrazabilidadRepository.class.getDeclaredMethods();

        // Verificar que todos los métodos son permitidos (save, findById,
        // findByResiduo...)
        for (java.lang.reflect.Method metodo : metodos) {
            String nombre = metodo.getName();
            boolean esPermitido = nombre.equals("save")
                    || nombre.equals("findById")
                    || nombre.equals("findByResiduoOrderByFechaCambioAsc");

            assertNotEquals(false, esPermitido,
                    "Método no permitido encontrado: " + nombre);
        }
    }
}