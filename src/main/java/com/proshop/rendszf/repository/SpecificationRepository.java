package com.proshop.rendszf.repository;

import com.proshop.rendszf.domain.SpecificationEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpecificationRepository extends JpaRepository<SpecificationEntity, String> {

  @Query("SELECT c.spec FROM CategoryEntity c WHERE c.nev=:name")
  List<SpecificationEntity> findByCategory(String name);

}
