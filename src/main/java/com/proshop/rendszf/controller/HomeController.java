package com.proshop.rendszf.controller;

import com.proshop.rendszf.converters.ProductConverter;
import com.proshop.rendszf.converters.ProductSpecConverter;
import com.proshop.rendszf.converters.UserConverter;
import com.proshop.rendszf.domain.*;
import com.proshop.rendszf.dto.AddressDto;
import com.proshop.rendszf.dto.OrderDto;
import com.proshop.rendszf.dto.AuthDto;
import com.proshop.rendszf.dto.OrderProductDto;
import com.proshop.rendszf.dto.OrderTableDto;
import com.proshop.rendszf.dto.ProductDto;
import com.proshop.rendszf.dto.ProductOrderSpec;
import com.proshop.rendszf.dto.RatingDto;
import com.proshop.rendszf.dto.UsersDto;
import com.proshop.rendszf.service.interf.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import javax.transaction.Transactional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class HomeController {

  @Autowired
  private ProductService productService;

  @Autowired
  private AddressService addressService;

  @Autowired
  private UsersService usersService;

  @Autowired
  private ProductSpecService productSpecService;

  @Autowired
  private RatingService ratingService;

  @Autowired
  private CategoryService categoryService;

  @Autowired
  private SpecificationService specificationService;

  @Autowired
  private UserConverter userConverter;

  @Autowired
  private ProductConverter productConverter;

  @Autowired
  private ProductSpecConverter productSpecConverter;

  @Autowired
  private SaveService saveService;

  @Autowired
  private OrderService orderService;

  @GetMapping("/products")
  public List<ProductEntity> getProducts() {
    return productService.findAll();
  }

//  @GetMapping("/product/{id}/delete")
//  public void deleteProduct(@PathVariable("id") Long id){
//    productService.deleteById(id);
//}

  @RequestMapping(value = "/product/delete",method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/json")
  public UsersEntity postForLogin(@RequestBody AuthDto authDto) throws Exception{

    if(authDto.getEmail() == null || authDto.getJelszo() == null) {
      throw new Exception("message");
    } else {
      String email = authDto.getEmail();
      String jelszo = authDto.getJelszo();
      UsersEntity usersEntity = usersService.getByEmail(email);
      if(usersEntity != null) {
        if(usersEntity.getEmail().equals(email)) {
          if(usersEntity.getJelszo().equals(jelszo)) {
            productService.deleteById(authDto.getId());
          }
        }
      }
      
    }
    return null;

  }


  @GetMapping("/product/{category}")
  public List<ProductEntity> getProductsByCategory(@PathVariable("category") String category) {
    return productService.getByCategory(category);
  }

  @GetMapping("/products/{id}")
  public ProductEntity getProductsId(@PathVariable("id") Long id) {
    return productService.getById(id);
  }

  @GetMapping("/address")
  public List<AddressEntity> getAddress() {
    return addressService.findAll();
  }

  @GetMapping("/user/{id}")
  public UsersEntity getUser(@PathVariable("id") Long id) {
    return usersService.getById(id);
  }

  @GetMapping("/product_spec/{id}")
  public List<ProductSpecEntity> getAllSpec(@PathVariable("id") Long id) {
    return productSpecService.findAllByProduct(id);
  }

  @GetMapping("/spec_values/{laptop}/{kepernyo}")
  public List<String> getCatById(@PathVariable("laptop") String laptop, @PathVariable("kepernyo") String str) {
    List<ProductSpecEntity> list = productSpecService.getByCatById(laptop, str);
    List<String> returnList = new ArrayList<>();
    String element;
    for (ProductSpecEntity productSpecEntity : list) {
      element = productSpecEntity.getErtek();
      if(!returnList.contains(element)) {
        returnList.add(element);
      }
    }
    return returnList;
  }

  @GetMapping("/product_cat_spec/{id}")
  public List<SpecificationEntity> getAllByCatSpec(@PathVariable("id") String name) {
    return specificationService.findByCategory(name);
  }

  @GetMapping("/rating/{id}")
  public List<RatingEntity> findAllRatingByProducts(@PathVariable("id") Long id) {
    return ratingService.findAllByProduct(id);
  }

  @GetMapping("/categories")
  public List<CategoryEntity> getCategory() {
    return categoryService.findAll();
  }

  @GetMapping("/elozmenyek/{id}")
  public List<OrderEntity> getElozmenyek(@PathVariable("id") Long id) {
    return orderService.elozmenyek(id);
  }

  @GetMapping("/product_order/{id}")
  public List<OrderProductEntity> getProductByOrderId(@PathVariable("id") Long id) {
    return orderService.getProductByOrderId(id);
  }

  @GetMapping("/get15")
  public List<ProductEntity> getLastProducts() {
    return productService.getProductInNum();
  }

  private UsersEntity fillException() {
    UsersEntity usersEntity = new UsersEntity();
    usersEntity.setNev("Hibas jelszo!");
    usersEntity.setTelszam(null);
    usersEntity.setEmail(null);
    usersEntity.setJelszo(null);
    usersEntity.setAdmin(null);
    usersEntity.setCim(null);
    usersEntity.setId(null);
    return usersEntity;
  }

  private UsersEntity fillException2() {
    UsersEntity usersEntity = new UsersEntity();
    usersEntity.setNev("Hiba!");
    usersEntity.setTelszam(null);
    usersEntity.setEmail(null);
    usersEntity.setJelszo(null);
    usersEntity.setAdmin(null);
    usersEntity.setCim(null);
    usersEntity.setId(null);
    return usersEntity;
  }

  @RequestMapping(value = "/login",method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/json")
  public UsersEntity postForLogin(@RequestBody UsersDto usersDto) {
    UsersEntity usersEntity = usersService.getByEmail(usersDto.getEmail());
    if(usersEntity == null) {
      return fillException2();
    } else if(usersDto.getEmail().equals(usersEntity.getEmail()) && usersDto.getJelszo().equals(usersEntity.getJelszo())) {
      return usersEntity;
    } else if(!(usersDto.getJelszo().equals(usersEntity.getJelszo()))) {
      return fillException();
    } else {
      return fillException2();
    }
  }

  @RequestMapping(value = "/regist",method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/json")
  public UsersEntity registPost(@Valid @RequestBody UsersDto usersDto) {
    usersService.saveUser(userConverter.convert(usersDto));
    return usersService.getByEmail(usersDto.getEmail());
  }

  @RequestMapping(value = "/update_user/{id}",method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/json")
  public UsersEntity updateUser(@PathVariable("id") Long id, @RequestBody UsersDto usersDto){
    usersService.updateUser(id, usersDto.getNev(), usersDto.getTelszam(), usersDto.getEmail());
    return usersService.getById(id);
  }

  @RequestMapping(value = "/update_password/{id}",method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/json")
  public UsersEntity updatePassword(@PathVariable("id") Long id, @RequestBody UsersDto usersDto) {
    usersService.updatePassword(usersDto.getJelszo(), id);
    return usersService.getById(id);
  }

  @RequestMapping(value = "/update_address/{id}",method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/json")
  public AddressEntity updateAddress(@PathVariable("id") Long userid, @RequestBody AddressDto addressDto) throws Exception{
    if(addressDto.getEmail() == null || addressDto.getJelszo() == null) {
      throw new Exception("message");
    } else {
      String email = addressDto.getEmail();
      String jelszo = addressDto.getJelszo();
      UsersEntity usersEntity = usersService.getByEmail(email);
      if(usersEntity != null) {
        if(usersEntity.getEmail().equals(email)) {
          if(usersEntity.getJelszo().equals(jelszo)) {
            addressService.updateAddress(addressDto.getVaros(), addressDto.getIranyitoszam(), addressDto.getUtcaHazszam(), addressDto.getAjtoszam(), userid);
            return addressService.getById(addressDto.getId());

          }
        }
      }
      
    }
    return null;

  }

  @Transactional
  @RequestMapping(value = "/upload_product", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/json")
  public ProductEntity postForUpload(@Valid @RequestBody ProductDto productDto) throws Exception {
    if(productDto.getEmail() == null || productDto.getJelszo() == null) {
      throw new Exception("message");
    } else {
      String email = productDto.getEmail();
      String jelszo = productDto.getJelszo();
      UsersEntity usersEntity = usersService.getByEmail(email);
      if(usersEntity != null) {
        if(usersEntity.getEmail().equals(email)) {
          if(usersEntity.getJelszo().equals(jelszo)) {
            ProductEntity productEntity = productService.saveProduct(productConverter.convert(productDto));
            List<SaveEntity> list = productSpecConverter.convert(productDto);
            for (SaveEntity productSpecEntity : list) {
              productSpecEntity.setProductEntity(productEntity.getId());
              saveService.saveQuery(productSpecEntity.getSpecificationEntity(), productSpecEntity.getErtek(), productEntity.getId());
            }
            return productEntity;
          }
        }
      }
      
    }
    return null;
  }

  @Transactional
  @RequestMapping(value = "/update_product/{id}", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/json")
  public ProductEntity postForUpdateProduct(@PathVariable("id") Long id, @Valid @RequestBody ProductDto productDto) throws Exception{
    if(productDto.getEmail() == null || productDto.getJelszo() == null) {
      throw new Exception("message");
    } else {
      String email = productDto.getEmail();
      String jelszo = productDto.getJelszo();
      UsersEntity usersEntity = usersService.getByEmail(email);
      if(usersEntity != null) {
        if(usersEntity.getEmail().equals(email)) {
          if(usersEntity.getJelszo().equals(jelszo)) {
            productService.updateProduct(productDto);
            List<SaveEntity> list = productSpecConverter.convert(productDto);
            for (SaveEntity productSpecEntity : list) {
              productSpecEntity.setProductEntity(id);
              saveService.updateProductSpec(productSpecEntity);
            }
            return productService.getById(productDto.getId());
          }
        }
      }
      
    }
    return null;
  }

  DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

  @Transactional
  @RequestMapping(value = "/save_order", method = RequestMethod.POST, consumes="application/json", headers = "content-type=application/json")
  public int postForSaveOrder(@Valid @RequestBody OrderDto orderDto) {

    AddressEntity addressEntity = new AddressEntity();
    addressEntity.setIranyitoszam(orderDto.getIranyitoszam());
    addressEntity.setVaros(orderDto.getVaros());
    addressEntity.setUtcaHazszam(orderDto.getUtcaHazszam());
    addressEntity.setAjtoszam(orderDto.getEmeletAjto());
    addressService.saveAddress(addressEntity);

    AddressEntity helper = addressService.saveAddress(addressEntity);
    Long addressId = helper.getId();

    OrderTableDto orderTableDto = new OrderTableDto();
    orderTableDto.setCimId(addressId);
    orderTableDto.setDatum(LocalDateTime.parse(orderDto.getDatum(), formatter));
    orderTableDto.setFelhasznaloId(orderDto.getFelhasznaloId());
    orderTableDto.setFizetesiMod(orderDto.getFizetesiMod());
    orderTableDto.setKeresztenev(orderDto.getKeresztnev());
    orderTableDto.setVezeteknev(orderDto.getVezeteknev());
    orderTableDto.setMegjegyzes(orderDto.getMegjegyzes());
    orderTableDto.setTelefonszam(orderDto.getTelefonszam());

    orderService.saveOrder(orderTableDto);

    int orderId = orderService.getLastInserted();

    for (ProductOrderSpec productOrderSpec : orderDto.getTermekek()) {
      OrderProductDto orderProductDto = new OrderProductDto();
      orderProductDto.setOrderId(Long.valueOf(orderId));
      orderProductDto.setMennyiseg(productOrderSpec.getMennyiseg());
      orderProductDto.setProductId(productOrderSpec.getId());
      orderProductDto.setAr(productOrderSpec.getAr());
      orderService.saveOrderProduct(orderProductDto);
    }

    return orderId;
  }

  @RequestMapping(value = "/save_rating", method = RequestMethod.POST, consumes="application/json", headers = "content-type=application/json")
  public void saveRatng(@Valid @RequestBody RatingDto ratingDto) throws Exception{
    if(ratingDto.getEmail() == null || ratingDto.getJelszo() == null) {
      throw new Exception("message");
    } else {
      String email = ratingDto.getEmail();
      String jelszo = ratingDto.getJelszo();
      UsersEntity usersEntity = usersService.getByEmail(email); 
      if(usersEntity != null) {
        if(usersEntity.getEmail().equals(email)) {
          if(usersEntity.getJelszo().equals(jelszo)) {
            ratingService.saveRating(LocalDateTime.parse(ratingDto.getDatum(), formatter), ratingDto.getFelhasznaloId(), ratingDto.getErtekeles(), ratingDto.getSzoveg(), ratingDto.getTermekId());

          }
        }
      }
      
    }
  }
}
