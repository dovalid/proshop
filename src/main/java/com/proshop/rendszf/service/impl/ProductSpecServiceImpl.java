package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.ProductSpecEntity;
import com.proshop.rendszf.repository.ProductSpecRepository;
import com.proshop.rendszf.service.interf.ProductService;
import com.proshop.rendszf.service.interf.ProductSpecService;
import com.proshop.rendszf.service.interf.SpecificationService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductSpecServiceImpl implements ProductSpecService {

  @Autowired
  private ProductSpecRepository productSpecRepository;

  @Autowired
  private ProductService productService;

  @Autowired
  private SpecificationService specCategoryService;

  @Override
  public List<ProductSpecEntity> findAll() {
    return productSpecRepository.findAll();
  }

  @Override
  public List<ProductSpecEntity> findAllByProduct(Long id) {
    return productSpecRepository.findAllByProductId(id);
  }

  @Override
  public List<ProductSpecEntity> getById(String id) {
    return (List<ProductSpecEntity>) productSpecRepository.getOne(id);
  }

  @Override
  public void deleteById(String id) {
    productSpecRepository.deleteById(id);
  }

  @Override
  public void save(ProductSpecEntity productSpecEntity) {
    productSpecRepository.save(productSpecEntity);
  }

  @Override
  public void saveListItems(List<ProductSpecEntity> productSpecEntities) {
    for (ProductSpecEntity productSpecEntity : productSpecEntities) {
      productSpecRepository.save(productSpecEntity);
    }
  }

  @Override
  public List<ProductSpecEntity> getByCatById(String catNev, String str) {
    return productSpecRepository.findAllByCatId(catNev, str);
  }

}
