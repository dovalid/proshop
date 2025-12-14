package com.proshop.rendszf.domain;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import lombok.Data;

@Data
@Entity
@IdClass(ProductSpecEntity.class)
public class SaveEntity implements Serializable {

  @Id
  private String specificationEntity;

  @Id
  private Long productEntity;

  private String ertek;

}
