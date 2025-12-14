package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.AddressEntity;
import com.proshop.rendszf.repository.AddressRepository;
import com.proshop.rendszf.service.interf.AddressService;
import java.util.List;
import org.apache.tomcat.jni.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdderssServiceImpl implements AddressService {

  @Autowired
  private AddressRepository addressRepository;

  @Override
  public List<AddressEntity> findAll() {
    return addressRepository.findAll();
  }

  @Override
  public void updateAddress(String varos, int iranyitoszam, String uhszam, int ajtoszam, Long userid) {
    addressRepository.updateAddress(varos, iranyitoszam, uhszam, ajtoszam, userid);
  }

  @Override
  public AddressEntity getById(Long id) {
    return addressRepository.getOne(id);
  }

  @Override
  public void deleteById(Long id) {
    addressRepository.deleteById(id);
  }

  @Override
  public AddressEntity saveAddress(AddressEntity addressEntity) {
    return addressRepository.save(addressEntity);
  }

}
