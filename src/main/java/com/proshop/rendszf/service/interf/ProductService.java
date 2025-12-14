package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.ProductEntity;
import com.proshop.rendszf.dto.ProductDto;
import java.util.List;

public interface ProductService {

  List<ProductEntity> findAll();

  ProductEntity getById(Long id);

  List<ProductEntity> getProductInNum();

  List<ProductEntity> getByCategory(String category);

  void deleteById(Long id);

  ProductEntity saveProduct(ProductEntity productEntity);

  void save(ProductDto productDto);

  ProductEntity getByName(String nev);

  List<Long> getProductByOrderId(Long id);

  void updateProduct(ProductDto productDto);

}
