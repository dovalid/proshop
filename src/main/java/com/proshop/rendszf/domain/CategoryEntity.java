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
@Table(name = "kategoria")
public class CategoryEntity {

  @Id
  private String nev;

  @Column(name = "kep")
  private String kep;

  @ManyToMany
  @JoinTable(
      name = "kategoria_specifikacio",
      joinColumns = @JoinColumn(name = "kategoria_nev"),
      inverseJoinColumns = @JoinColumn(name = "specifikacio_szempont_nev"))
  private List<SpecificationEntity> spec = new ArrayList<>();
}
