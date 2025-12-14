package com.proshop.rendszf.repository;

import com.proshop.rendszf.domain.SaveEntity;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SaveRepository extends JpaRepository<SaveEntity, String> {

  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = "INSERT INTO termek_specifikacio(specifikacio_szempont_nev, ertek, termek_id) "
      + "VALUES ((:nev), (:ertek), (:termekId))")
  void saveQuery(@Param("nev") String nev, @Param("ertek") String ertek, @Param("termekId") Long termekId);

  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = "UPDATE termek_specifikacio SET ertek=(:ertek) WHERE termek_id=(:termekId) AND specifikacio_szempont_nev=(:nev)")
  void updateProductSpec(@Param("nev") String nev, @Param("ertek") String ertek, @Param("termekId") Long termekId);

}
