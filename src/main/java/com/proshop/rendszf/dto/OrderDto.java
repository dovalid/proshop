package com.proshop.rendszf.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.codehaus.jackson.map.ext.JodaSerializers.LocalDateTimeSerializer;

@Data
public class OrderDto {

  private Long id;

  private String vezeteknev;

  private String keresztnev;

  private String telefonszam;

  private int iranyitoszam;

  private String varos;

  private String utcaHazszam;

  private int emeletAjto;

  private String fizetesiMod;

  private String megjegyzes;

  private String datum;

  private Long felhasznaloId;

  private List<ProductOrderSpec> termekek;

  private String email;

  private String jelszo;

}
