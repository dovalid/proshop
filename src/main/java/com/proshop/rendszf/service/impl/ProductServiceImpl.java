package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.ProductEntity;
import com.proshop.rendszf.dto.ProductDto;
import com.proshop.rendszf.repository.ProductRepository;
import com.proshop.rendszf.service.interf.ProductService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

  @Autowired
  private ProductRepository productRepository;

  @Override
  public List<ProductEntity> findAll() {
    return productRepository.findAll();
  }

  @Override
  public List<ProductEntity> getProductInNum() {
    return productRepository.getProductInNum();
  }

  @Override
  public void save(ProductDto productDto) {
    productRepository.save(productDto);
  }

  @Override
  public List<ProductEntity> getByCategory(String category) {
    return productRepository.getByCategory(category);
  }

  @Override
  public ProductEntity getById(Long id) {
    return productRepository.getOne(id);
  }

  @Override
  public void deleteById(Long id) {
    productRepository.deleteById(id);
  }

  @Override
  public ProductEntity getByName(String nev) {
    return productRepository.getByName(nev);
  }

  @Override
  public ProductEntity saveProduct(ProductEntity productEntity) {
    return productRepository.save(productEntity);
  }

  @Override
  public List<Long> getProductByOrderId(Long id) {
    return productRepository.getProductByOrderId(id);
  }

  @Override
  public void updateProduct(ProductDto productDto) {
    productRepository.updateProduct(productDto.getId(), productDto.getAr(), productDto.getLeiras(), productDto.getRaktaron(), productDto.getGarancia(), productDto.getGyartoNev(), productDto.getKategoriaNev(),
        productDto.getNev(), "{" + productDto.getKepek() + "}");
  }

}
