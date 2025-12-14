package com.proshop.rendszf.dto;

import lombok.Data;

@Data
public class RatingDto {

  private String datum;

  private Long felhasznaloId;

  private Long termekId;

  private int ertekeles;

  private String szoveg;

  private String email;

  private String jelszo;
}
