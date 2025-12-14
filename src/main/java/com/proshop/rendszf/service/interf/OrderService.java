package com.proshop.rendszf.service.interf;

import com.proshop.rendszf.domain.OrderEntity;
import com.proshop.rendszf.domain.OrderProductEntity;
import com.proshop.rendszf.domain.RatingEntity;
import com.proshop.rendszf.dto.OrderDto;
import com.proshop.rendszf.dto.OrderProductDto;
import com.proshop.rendszf.dto.OrderTableDto;
import com.proshop.rendszf.dto.ProductOrderSpec;
import java.util.List;

public interface OrderService {

    List<OrderEntity> elozmenyek(Long id);

    void saveOrder(OrderTableDto orderTableDto);

    int getLastInserted();

    OrderEntity getOrderByDetails(OrderDto orderDto);

    void saveOrderProduct(OrderProductDto orderProductDtos);

    List<OrderProductEntity> getProductByOrderId(Long id);

}
