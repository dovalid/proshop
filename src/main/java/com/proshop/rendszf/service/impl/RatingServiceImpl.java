package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.RatingEntity;
import com.proshop.rendszf.repository.RatingRepository;
import com.proshop.rendszf.service.interf.ProductService;
import com.proshop.rendszf.service.interf.RatingService;
import com.proshop.rendszf.service.interf.UsersService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingServiceImpl implements RatingService {

  @Autowired
  private RatingRepository ratingRepository;

  @Autowired
  private UsersService usersService;

  @Autowired
  private ProductService productService;

  @Override
  public List<RatingEntity> findAll() {
    return ratingRepository.findAll();
  }

  @Override
  public List<RatingEntity> findAllByProduct(Long id) {
    return ratingRepository.findAllByProduct(id);
  }

  @Override
  public void delete(RatingEntity ratingEntity) {
    ratingRepository.delete(ratingEntity);
  }

  @Override
  public void save(RatingEntity ratingEntity) {
    ratingRepository.save(ratingEntity);
  }

  @Override
  public void saveRating(LocalDateTime datum, Long felhasznaloId, int ertekeles, String szoveg, Long termekId) {
    ratingRepository.saveRating(datum, felhasznaloId, ertekeles, szoveg, termekId);
  }

  @Override
  public RatingEntity getRatingById(LocalDateTime str) {
    return ratingRepository.getRatingById(str);
  }

}
