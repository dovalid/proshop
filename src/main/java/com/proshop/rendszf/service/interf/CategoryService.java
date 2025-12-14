package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.CategoryEntity;
import java.util.List;

public interface CategoryService {

  List<CategoryEntity> findAll();

  CategoryEntity getById(String id);

  void deleteById(String id);

  void save(CategoryEntity categoryEntity);

}
