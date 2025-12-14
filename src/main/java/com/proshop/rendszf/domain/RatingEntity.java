package com.proshop.rendszf.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "ertekeles")
public class RatingEntity {

  @Id
  @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
  private LocalDateTime datum;

  @Column(name = "felhasznalo_id")
  private Long user;

  @Column(name = "ertekeles")
  private int ertekeles;

  @Column(name = "szoveg")
  private String szoveg;

  @ManyToOne
  @JoinColumn(name = "termek_id")
  private ProductEntity productEntity;
}
