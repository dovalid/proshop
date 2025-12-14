package com.proshop.rendszf.domain;

import java.time.LocalDateTime;
import javax.persistence.*;

import lombok.Data;

@Entity
@Data
@Table(name = "rendeles")
public class OrderEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(name = "vezeteknev")
  private String vezeteknev;

  @Column(name = "keresztnev")
  private String keresztnev;

  @Column(name = "telefonszam")
  private String telefonszam;

  @Column(name = "fizetesi_mod")
  private String fizetesiMod;

  @Column(name = "megjegyzes")
  private String megjegyzes;

  @Column(name = "datum")
  private LocalDateTime datum;

  @ManyToOne
  @JoinColumn(name = "felhasznalo_id")
  private UsersEntity felhasznaloId;

  @OneToOne
  @JoinColumn(name = "cim_id")
  private AddressEntity cimId;

}
