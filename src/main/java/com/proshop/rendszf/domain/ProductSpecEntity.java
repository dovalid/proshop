package com.proshop.rendszf.domain;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "termek_specifikacio")
@IdClass(ProductSpecEntity.class)
public class ProductSpecEntity implements Serializable {

  @Id
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "specifikacio_szempont_nev")
  private SpecificationEntity specificationEntity;

  @Id
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "termek_id", insertable = false, updatable = false)
  private ProductEntity productEntity;

  @Column(name = "ertek")
  private String ertek;
}
