package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.RatingEntity;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;

public interface RatingService {

  List<RatingEntity> findAll();

  List<RatingEntity> findAllByProduct(Long id);

  void delete(RatingEntity ratingEntity);

  void save(RatingEntity ratingEntity);

  RatingEntity getRatingById(LocalDateTime id);

  void saveRating(LocalDateTime datum, Long felhasznaloId, int ertekeles, String szoveg, Long termekId);
}
