package com.proshop.rendszf.domain;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "felhasznalo")
@Nullable
public class UsersEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nev")
  private String nev;

  @Column(name = "telefonszam")
  @Nullable
  private String telszam;

  @Column(name = "email")
  private String email;

  @Column(name = "jelszo")
  private String jelszo;

  @Column(name = "admin")
  private Boolean admin;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "cim_id")
  private AddressEntity cim;
}
