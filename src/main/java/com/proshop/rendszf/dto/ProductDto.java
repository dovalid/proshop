package com.proshop.rendszf.dto;

import com.proshop.rendszf.domain.ProductSpecEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import lombok.Data;

@Data
public class ProductDto {

  private Long id;

  @Nullable
  private String nev;

  @Nullable
  private int ar;

  @Nullable
  private String leiras;

  @Nullable
  private int raktaron;

  @Nullable
  private int garancia;

  @Nullable
  private String gyartoNev;

  @Nullable
  private String kategoriaNev;

  @Nullable
  private String kepek;

  private List<ProductSpecDto> specifikaciok = new ArrayList<>();

  private String email;

  private String jelszo;

}
