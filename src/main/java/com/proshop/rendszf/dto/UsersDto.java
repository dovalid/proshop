package com.proshop.rendszf.dto;

import com.proshop.rendszf.domain.AddressEntity;
import javax.annotation.Nullable;
import lombok.Data;

@Data
public class UsersDto {

  @Nullable
  private Long id;

  @Nullable
  private String nev;

  @Nullable
  private String telszam;

  @Nullable
  private String email;

  @Nullable
  private String jelszo;

  @Nullable
  private Boolean admin = false;

  @Nullable
  private AddressEntity cim = new AddressEntity();
}
