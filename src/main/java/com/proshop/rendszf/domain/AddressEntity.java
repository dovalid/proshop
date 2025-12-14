package com.proshop.rendszf.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "cim")
public class AddressEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "iranyitoszam")
  private int iranyitoszam;

  @Column(name = "varos")
  private String varos;

  @Column(name = "utca_hazszam")
  private String utcaHazszam;

  @Column(name = "ajtoszam", nullable = true)
  private Integer ajtoszam;
}
