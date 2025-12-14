package com.proshop.rendszf.repository;

import com.proshop.rendszf.domain.OrderEntity;
import com.proshop.rendszf.domain.OrderProductEntity;
import com.proshop.rendszf.domain.RatingEntity;
import java.time.LocalDateTime;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    @Query(nativeQuery = true, value = "SELECT *" +
                                       " FROM rendeles" +
                                       " WHERE rendeles.felhasznalo_id = :id" +
                                       " ORDER BY datum DESC")
    List<OrderEntity> elozmenyek(@Param("id") Long id);

    @Query(nativeQuery = true, value = "SELECT * FROM rendeles WHERE rendeles.datum=(:date) AND rendeles.felhasznalo_id=(:userId) AND rendeles.fizetesi_mod=(:fizetesiMod) AND "
        + "rendeles.megjegyzes=(:megjegyzes)")
    OrderEntity getOrderByDetails(@Param("date") String date, @Param("userId") Long userId, @Param("fizetesiMod") String fizetesiMod, @Param("megjegyzes") String megjegyzes);

    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO rendeles("
        + " datum, felhasznalo_id, fizetesi_mod, megjegyzes, cim_id, vezeteknev, keresztnev, telefonszam)"
        + " VALUES ((:date), (:userId), (:fizetesiMod), (:megjegyzes), (:cimId), (:vezeteknev), (:keresztnev), (:telefonszam));")
    void saveOrder(@Param("date") LocalDateTime date, @Param("userId") Long userId, @Param("fizetesiMod") String fizetesiMod, @Param("megjegyzes") String megjegyzes, @Param("cimId") Long cimId, @Param("vezeteknev") String vezeteknev,
        @Param("keresztnev") String keresztnev, @Param("telefonszam") String telefonszam);

    @Query(nativeQuery = true, value = "SELECT id FROM rendeles ORDER BY rendeles.id DESC LIMIT 1")
    int getLastInserted();

    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO rendeles_termek(rendeles_id, mennyiseg, termek_id, ar) VALUES ((:orderId), (:mennyiseg), (:productId), (:ar));")
    void saveOrderProduct(@Param("orderId") Long orderId, @Param("mennyiseg") int mennyiseg, @Param("productId") Long productId, @Param("ar") int ar);

}
