package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.SaveEntity;
import com.proshop.rendszf.repository.SaveRepository;
import com.proshop.rendszf.service.interf.SaveService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SaveServiceImpl implements SaveService {

  @Autowired
  private SaveRepository saveRepository;

  @Override
  public void saveListItems(List<SaveEntity> productSpecEntities) {
    for (SaveEntity saveEntity : productSpecEntities) {
      saveRepository.save(saveEntity);
    }
  }

  @Override
  public void saveQuery(String nev, String ertek, Long termekId) {
    saveRepository.saveQuery(nev, ertek, termekId);
  }

  @Override
  public void updateProductSpec(SaveEntity saveEntities) {
    saveRepository.updateProductSpec(saveEntities.getSpecificationEntity(), saveEntities.getErtek(), saveEntities.getProductEntity());
  }
}
