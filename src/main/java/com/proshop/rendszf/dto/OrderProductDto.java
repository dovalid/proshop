package com.proshop.rendszf.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.Data;

@Data
@Entity
public class OrderProductDto {

  @Column(name = "rendeles_id")
  private Long orderId;

  private int mennyiseg;

  @Id
  @Column(name = "termek_id")
  private Long productId;

  private int ar;

}
