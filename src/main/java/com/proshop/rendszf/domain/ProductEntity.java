package com.proshop.rendszf.domain;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "termek")
@Nullable
public class ProductEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nev")
  private String nev;

  @Column(name = "ar")
  private int ar;

  @Column(name = "leiras")
  private String leiras;

  @Column(name = "raktaron")
  private int raktaron;

  @Column(name = "garancia")
  private int garancia;

  @Column(name = "gyarto_nev")
  private String gyartoNev;

  @Column(name = "kategoria_nev")
  private String kategoriaNev;

  @Column(name = "kepek")
  private String kepek;
}
