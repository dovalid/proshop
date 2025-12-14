package com.proshop.rendszf.converters;

import com.proshop.rendszf.domain.ProductEntity;
import com.proshop.rendszf.dto.ProductDto;
import com.proshop.rendszf.service.interf.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ProductConverter implements Converter<ProductDto, ProductEntity> {

  @Autowired
  private ProductService productService;

  @Override
  public ProductEntity convert(ProductDto productDto) {
    ProductEntity productEntity = new ProductEntity();
    productEntity.setId(productDto.getId());
    productEntity.setAr(productDto.getAr());
    productEntity.setGarancia(productDto.getGarancia());
    productEntity.setGyartoNev(productDto.getGyartoNev());
    productEntity.setKategoriaNev(productDto.getKategoriaNev());
    productEntity.setKepek("{" + productDto.getKepek() + "}");
    productEntity.setLeiras(productDto.getLeiras());
    productEntity.setNev(productDto.getNev());
    productEntity.setRaktaron(productDto.getRaktaron());
    return productEntity;
  }

  public ProductEntity convert2(ProductDto productDto) {
    ProductEntity productEntity = productService.getById(productDto.getId());
    productEntity.setAr(productDto.getAr());
    productEntity.setGarancia(productDto.getGarancia());
    productEntity.setGyartoNev(productDto.getGyartoNev());
    productEntity.setKategoriaNev(productDto.getKategoriaNev());
    productEntity.setKepek("{" + productDto.getKepek() + "}");
    productEntity.setLeiras(productDto.getLeiras());
    productEntity.setNev(productDto.getNev());
    productEntity.setRaktaron(productDto.getRaktaron());
    return productEntity;
  }

}
