package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.SpecificationEntity;
import java.util.List;

public interface SpecificationService {

  List<SpecificationEntity> findAll();

  SpecificationEntity getById(String id);

  void deleteById(String id);

  void save(SpecificationEntity specificationEntity);

  List<SpecificationEntity> findByCategory(String name);

}
