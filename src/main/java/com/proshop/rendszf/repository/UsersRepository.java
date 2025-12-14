package com.proshop.rendszf.repository;

import com.proshop.rendszf.domain.UsersEntity;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsersRepository extends JpaRepository<UsersEntity, Long> {

  UsersEntity getByEmail(String email);

  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = "UPDATE felhasznalo"
      + " SET nev=(:nev), telefonszam=(:telefonszam), email=(:email) WHERE id=(:id);")
  void updateUser(@Param("id") Long id, @Param("nev") String nev, @Param("telefonszam") String telefonszam, @Param("email") String email);

  @Transactional
  @Modifying
  @Query(nativeQuery = true, value = "UPDATE felhasznalo"
      + " SET jelszo=(:jelszo) WHERE id=(:id);")
  void updatePassword(@Param("jelszo") String jelszo, @Param("id") Long id);
}
