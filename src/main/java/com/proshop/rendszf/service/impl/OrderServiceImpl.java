package com.proshop.rendszf.service.impl;

import com.proshop.rendszf.domain.OrderEntity;
import com.proshop.rendszf.domain.OrderProductEntity;
import com.proshop.rendszf.domain.ProductEntity;
import com.proshop.rendszf.domain.RatingEntity;
import com.proshop.rendszf.dto.OrderDto;
import com.proshop.rendszf.dto.OrderProductDto;
import com.proshop.rendszf.dto.OrderTableDto;
import com.proshop.rendszf.dto.ProductOrderSpec;
import com.proshop.rendszf.repository.OrderProductRepository;
import com.proshop.rendszf.repository.OrderRepository;
import com.proshop.rendszf.repository.ProductRepository;
import com.proshop.rendszf.repository.RatingRepository;
import com.proshop.rendszf.service.interf.OrderService;
import com.proshop.rendszf.service.interf.ProductService;
import com.proshop.rendszf.service.interf.RatingService;
import com.proshop.rendszf.service.interf.UsersService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<OrderEntity> elozmenyek(Long id) {
        return orderRepository.elozmenyek(id);
    }

    @Override
    public void saveOrder(OrderTableDto orderTableDto) {
        orderRepository.saveOrder(orderTableDto.getDatum(), orderTableDto.getFelhasznaloId(), orderTableDto.getFizetesiMod(), orderTableDto.getMegjegyzes(), orderTableDto.getCimId(),
            orderTableDto.getVezeteknev(), orderTableDto.getKeresztenev(), orderTableDto.getTelefonszam());
    }

    @Override
    public OrderEntity getOrderByDetails(OrderDto orderDto) {
        return orderRepository.getOrderByDetails(orderDto.getDatum(), orderDto.getFelhasznaloId(), orderDto.getFizetesiMod(), orderDto.getMegjegyzes());
    }

    @Override
    public void saveOrderProduct(OrderProductDto orderProductDtos) {
        orderRepository.saveOrderProduct(orderProductDtos.getOrderId(), orderProductDtos.getMennyiseg(), orderProductDtos.getProductId(), orderProductDtos.getAr());
    }

    @Override
    public int getLastInserted() {
        return orderRepository.getLastInserted();
    }

    @Override
    public List<OrderProductEntity> getProductByOrderId(Long id) {
        List<OrderProductDto> list =  orderProductRepository.findAllByOrderId(id);
        List<OrderProductEntity> returnList = new ArrayList<>();
        for (OrderProductDto orderProductDto : list) {
            OrderProductEntity orderProductEntity = new OrderProductEntity();
            orderProductEntity.setOrderEntity(orderRepository.getOne(orderProductDto.getOrderId()));
            orderProductEntity.setProductEntity(productRepository.getOne(orderProductDto.getProductId()));
            orderProductEntity.setAr(orderProductDto.getAr());
            orderProductEntity.setMennyiseg(orderProductDto.getMennyiseg());
            returnList.add(orderProductEntity);
        }
        return returnList;
    }
}
