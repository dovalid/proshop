package com.proshop.rendszf.domain;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "rendeles_termek")
@IdClass(OrderProductEntity.class)
public class OrderProductEntity implements Serializable {

  @Id
  @ManyToOne
  @JoinColumn(name = "rendeles_id")
  private OrderEntity orderEntity;

  @Id
  @ManyToOne
  @JoinColumn(name = "termek_id")
  private ProductEntity productEntity;

  private int mennyiseg;

  private int ar;

}
