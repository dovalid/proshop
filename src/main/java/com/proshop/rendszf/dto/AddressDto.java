package com.proshop.rendszf.dto;

import javax.annotation.Nullable;
import lombok.Data;

@Data
public class AddressDto {

  private Long id;

  @Nullable
  private int iranyitoszam;

  @Nullable
  private String varos;

  @Nullable
  private String utcaHazszam;

  @Nullable
  private int ajtoszam;

  private String email;

  private String jelszo;

}
