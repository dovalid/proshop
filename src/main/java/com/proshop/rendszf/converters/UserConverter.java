package com.proshop.rendszf.converters;

import com.proshop.rendszf.domain.UsersEntity;
import com.proshop.rendszf.dto.UsersDto;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class UserConverter implements Converter<UsersDto, UsersEntity> {

  @Override
  public UsersEntity convert(UsersDto usersEntity) {
    UsersEntity usersDto = new UsersEntity();
    usersDto.setNev(usersEntity.getNev());
    usersDto.setTelszam(usersEntity.getTelszam());
    usersDto.setEmail(usersEntity.getEmail());
    usersDto.setJelszo(usersEntity.getJelszo());
    usersDto.setCim(usersEntity.getCim());
    usersDto.setAdmin(usersEntity.getAdmin());
    usersDto.setId(usersEntity.getId());
    return usersDto;
  }

}
