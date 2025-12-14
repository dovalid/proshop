//package com.proshop.rendszf.converters;
//
//import com.proshop.rendszf.domain.OrderEntity;
//import com.proshop.rendszf.domain.UsersEntity;
//import com.proshop.rendszf.dto.OrderDto;
//import com.proshop.rendszf.service.interf.OrderService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.stereotype.Component;
//
//@Component
//public class OrderConverter implements Converter<OrderDto, OrderEntity> {
//
//  @Autowired
//  private OrderService orderService;
//
//  @Override
//  public OrderEntity convert(OrderDto orderDto) {
//    OrderEntity orderEntity = new OrderEntity();
//    orderEntity.setId(orderDto.getId());
//    orderEntity.setAr(orderDto.getAr());
//    orderEntity.setCimId(orderDto.getAddress());
//    orderEntity.setDatum(orderDto.getDatum());
//    return orderEntity
//  }
//
//}
