package com.proshop.rendszf.repository;

import com.proshop.rendszf.domain.ProductEntity;
import com.proshop.rendszf.dto.ProductDto;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

  @Query("SELECT p FROM ProductEntity p WHERE p.kategoriaNev = (:category)")
  public List<ProductEntity> getByCategory(String category);

  @Query(nativeQuery = true, value = "SELECT * FROM termek ORDER BY id DESC LIMIT 15")
  public List<ProductEntity> getProductInNum();

  void save(ProductDto productDto);

  @Query("SELECT p FROM ProductEntity p WHERE p.nev = (:nev)")
  ProductEntity getByName(@Param("nev") String nev);

  @Query(nativeQuery = true, value = "SELECT termek_id FROM rendeles_termek WHERE rendeles_id=(:id)")
  List<Long> getProductByOrderId(@Param("id") Long id);

  @Query(nativeQuery = true, value = "DELETE FROM termek WHERE id=(:id)")
  void deleteById(@Param("id") Long id);

  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = "UPDATE termek"
      + " SET ar=(:ar), leiras=(:leiras), raktaron=(:raktaron), garancia=(:garancia), gyarto_nev=(:gyartoNev), kategoria_nev=(:kategoriaNev), nev=(:nev), kepek=(:kepek)"
      + " WHERE termek.id=(:id);")
  void updateProduct(@Param("id") Long id, @Param("ar") int ar, @Param("leiras") String leiras, @Param("raktaron") int raktaron, @Param("garancia") int garancia, @Param("gyartoNev") String gyartoNev
      , @Param("kategoriaNev") String kategoriaNev, @Param("nev") String nev, @Param("kepek") String kepek);
}