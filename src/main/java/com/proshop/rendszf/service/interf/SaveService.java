package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.SaveEntity;
import java.util.List;

public interface SaveService {

  void saveListItems(List<SaveEntity> productSpecEntities);

  void saveQuery(String nev, String ertek, Long termekId);

  void updateProductSpec(SaveEntity saveEntities);

}
