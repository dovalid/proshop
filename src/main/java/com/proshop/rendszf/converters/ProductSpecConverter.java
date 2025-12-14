package com.proshop.rendszf.converters;

import com.proshop.rendszf.domain.ProductSpecEntity;
import com.proshop.rendszf.domain.SaveEntity;
import com.proshop.rendszf.dto.ProductDto;
import com.proshop.rendszf.dto.ProductSpecDto;
import com.proshop.rendszf.service.interf.ProductService;
import com.proshop.rendszf.service.interf.SpecificationService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ProductSpecConverter implements Converter<ProductDto, List<SaveEntity>> {

  @Autowired
  private ProductService productService;

  @Autowired
  private SpecificationService specificationService;

  @Override
  public List<SaveEntity> convert(ProductDto productDto) {
    List<ProductSpecDto> list = productDto.getSpecifikaciok();
    List<SaveEntity> returnList = new ArrayList<>();
    for (ProductSpecDto productSpecDto : list) {
      SaveEntity productSpecEntity = new SaveEntity();
      productSpecEntity.setErtek(productSpecDto.getErtek());
      productSpecEntity.setSpecificationEntity(specificationService.getById(productSpecDto.getId()).getNev());
      returnList.add(productSpecEntity);
    }
    return returnList;
  }

}
