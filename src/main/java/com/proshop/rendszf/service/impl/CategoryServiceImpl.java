package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.CategoryEntity;
import com.proshop.rendszf.repository.CategoryRepository;
import com.proshop.rendszf.service.interf.CategoryService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {

  @Autowired
  private CategoryRepository categoryRepository;

  @Override
  public List<CategoryEntity> findAll() {
    return categoryRepository.findAll();
  }

  @Override
  public CategoryEntity getById(String id) {
    return categoryRepository.getOne(id);
  }

  @Override
  public void deleteById(String id) {
    categoryRepository.deleteById(id);
  }

  @Override
  public void save(CategoryEntity categoryEntity) {
    categoryRepository.save(categoryEntity);
  }

}
