package com.proshop.rendszf.domain;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "specifikacio_szempont")
public class SpecificationEntity {

  @Id
  private String nev;

  @Column(name = "leiras")
  private String leiras;

  @Column(name = "tipus")
  private String tipus;

  @Column(name = "mertekegyseg")
  private String mertekegyseg;
}
