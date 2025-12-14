package com.proshop.rendszf.repository;

import com.proshop.rendszf.domain.AddressEntity;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AddressRepository extends JpaRepository<AddressEntity, Long> {

  @Modifying
  @Transactional
  @Query(nativeQuery = true, value = "UPDATE cim SET varos=(:varos), iranyitoszam=(:iranyitoszam), utca_hazszam=(:uhszam), ajtoszam=(:ajtoszam) "
      + "FROM felhasznalo WHERE cim.id = felhasznalo.cim_id AND felhasznalo.id = (:userid)")
  void updateAddress(@Param("varos") String varos, @Param("iranyitoszam") int iranyitoszam, @Param("uhszam") String uhszam, @Param("ajtoszam") int ajtoszam, @Param("userid") Long userid);

}
