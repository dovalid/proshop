package com.proshop.rendszf.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class OrderTableDto {

  private Long id;

  private String fizetesiMod;

  private String megjegyzes;

  private LocalDateTime datum;

  private Long felhasznaloId;

  private Long cimId;

  private String vezeteknev;

  private String keresztenev;

  private String telefonszam;
}
