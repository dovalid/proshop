package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.ProductSpecEntity;
import java.util.List;

public interface ProductSpecService {

  List<ProductSpecEntity> findAll();

  List<ProductSpecEntity> findAllByProduct(Long id);

  List<ProductSpecEntity> getById(String id);

  void deleteById(String id);

  void save(ProductSpecEntity productSpecEntity);

  void saveListItems(List<ProductSpecEntity> productSpecEntities);

  List<ProductSpecEntity> getByCatById(String catNev, String str);

}
