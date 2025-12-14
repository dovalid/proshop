package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.UsersEntity;
import java.util.List;

public interface UsersService {

  List<UsersEntity> findAll();

  UsersEntity getById(Long id);

  void updateUser(Long id, String nev, String telefonszam, String email);

  void updatePassword(String jelszo, Long id);

  void deleteById(Long id);

  void saveUser(UsersEntity usersEntity);

  UsersEntity getByEmail(String email);

}
