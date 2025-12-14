package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.AddressEntity;
import java.util.List;

public interface AddressService {

  List<AddressEntity> findAll();

  void updateAddress(String varos, int iranyitoszam, String uhszam, int ajtoszam, Long userid);

  AddressEntity getById(Long id);

  void deleteById(Long id);

  AddressEntity saveAddress(AddressEntity addressEntity);

}
