package com.example.backend.repository;

import com.example.backend.Equipment.*;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends MongoRepository<Equipment, String> {
    Optional<Equipment> findBySerialNumber(String serialNumber);


    List<Equipment> findByPlant(String plant);

}
