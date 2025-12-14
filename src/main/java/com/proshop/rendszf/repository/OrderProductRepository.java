package com.proshop.rendszf.repository;

import com.proshop.rendszf.dto.OrderProductDto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderProductRepository extends JpaRepository<OrderProductDto, Long> {

  @Query(nativeQuery = true, value = "SELECT * FROM rendeles_termek WHERE rendeles_id=(:id);")
  List<OrderProductDto> findAllByOrderId(@Param("id") Long id);

}
