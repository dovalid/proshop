package com.proshop.rendszf.repository;

import com.proshop.rendszf.domain.ProductSpecEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductSpecRepository extends JpaRepository<ProductSpecEntity, String> {

 @Query("SELECT s, p"
      + " FROM ProductSpecEntity s , SpecificationEntity p"
      + " WHERE p.nev = s.specificationEntity"
      + " AND s.productEntity.id = :id")
  List<ProductSpecEntity> findAllByProductId(Long id);

 @Query(nativeQuery = true, value = "SELECT * FROM termek_specifikacio, termek WHERE termek_specifikacio.termek_id=termek.id AND termek.kategoria_nev=(:catNev) AND termek_specifikacio.specifikacio_szempont_nev=(:str);")
 List<ProductSpecEntity> findAllByCatId(@Param("catNev") String catNev, @Param("str") String str);

}
