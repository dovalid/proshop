package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.SpecificationEntity;
import com.proshop.rendszf.repository.SpecificationRepository;
import com.proshop.rendszf.service.interf.SpecificationService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SpecificationServiceImpl implements SpecificationService {

  @Autowired
  private SpecificationRepository specCategoryRepository;

  @Override
  public List<SpecificationEntity> findAll() {
    return specCategoryRepository.findAll();
  }

  @Override
  public SpecificationEntity getById(String id) {
    return specCategoryRepository.getOne(id);
  }

  @Override
  public void deleteById(String id) {
    specCategoryRepository.deleteById(id);
  }

  @Override
  public void save(SpecificationEntity specificationEntity) {
    specCategoryRepository.save(specificationEntity);
  }

  @Override
  public List<SpecificationEntity> findByCategory(String name) {
    return specCategoryRepository.findByCategory(name);
  }

}
