package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.UsersEntity;
import com.proshop.rendszf.repository.UsersRepository;
import com.proshop.rendszf.service.interf.UsersService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersServiceImpl implements UsersService {

  @Autowired
  private UsersRepository usersRepository;

  @Override
  public List<UsersEntity> findAll() {
    return usersRepository.findAll();
  }

  @Override
  public UsersEntity getById(Long id) {
    return usersRepository.getOne(id);
  }

  @Override
  public void updateUser(Long id, String nev, String telefonszam, String email) {
    usersRepository.updateUser(id, nev, telefonszam, email);
  }

  @Override
  public void updatePassword(String jelszo, Long id) {
    usersRepository.updatePassword(jelszo, id);
  }

  @Override
  public void deleteById(Long id) {
    usersRepository.deleteById(id);
  }

  @Override
  public void saveUser(UsersEntity usersEntity) {
    usersRepository.save(usersEntity);
  }

  @Override
  public UsersEntity getByEmail(String email) {
    return usersRepository.getByEmail(email);
  }
}
