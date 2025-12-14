package com.proshop.rendszf.repository;

import com.proshop.rendszf.domain.RatingEntity;
import java.time.LocalDateTime;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.PathVariable;

public interface RatingRepository extends JpaRepository<RatingEntity, LocalDateTime> {

  @Query("SELECT r FROM RatingEntity r WHERE r.productEntity.id = :id ORDER BY r.productEntity.id DESC")
  List<RatingEntity> findAllByProduct(Long id);

  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = "INSERT INTO ertekeles(datum, felhasznalo_id, ertekeles, szoveg, termek_id) VALUES ((:datum), (:felhasznaloId), (:ertekeles), (:szoveg), (:termekId));")
  void saveRating(@PathVariable("datum") LocalDateTime datum, @PathVariable("felhasznaloId") Long felhasznaloId, @PathVariable("ertekeles") int ertekeles, @PathVariable("szoveg") String szoveg, @PathVariable("termekId") Long termekId);

  @Transactional
  @Query(nativeQuery = true, value = "SELECT * FROM ertekeles WHERE ertekeles.datum=(:str)")
  RatingEntity getRatingById(LocalDateTime str);

}
