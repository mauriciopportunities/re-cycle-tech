package com.recycle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recycle.entity.Residuo;
import com.recycle.entity.Usuario;

public interface ResiduoRepository extends JpaRepository<Residuo, Long> {
    List<Residuo> findByUsuario(Usuario usuario);

    List<Residuo> findByEstado(String estado);
}