package com.example.backend.Equipment;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor

@Document(collection = "Equipment")
public class Equipment {
    @Id
    private String id;
    private PlantType plant;
    private String equipmentName;
    private String technicalId;
    private String process;
    private String masterDataName;
    private LocationType location;
    private String immobilizationNumber;
    private String serialNumber;
    private Integer year;
    private Boolean equipmentCommercialized;
    private Boolean pdrCommercialized;
    private Integer age;
    private Double degradability;
    private Double productionHours;
    private Double hpCoefficient;
    private String replacementParts;
    private String maintenanceMttrMtbf;
    private String technology;
    private String agingResult;
    private String equipmentStatus;
    private String physicalStatus;
    private Integer Rul;
    private List<DocumentEntity> documents;
    private List<DocumentEntity> archive;


    public Equipment(PlantType plant, String equipmentName,Integer Rul, String technicalId, String process, LocationType location, String serialNumber, String masterDataName, String immobilizationNumber, Integer year, Boolean equipmentCommercialized, Boolean pdrCommercialized, Integer age, Double degradability, Double productionHours, Double hpCoefficient, String replacementParts, String maintenanceMttrMtbf, String technology, String agingResult, String equipmentStatus, String physicalStatus, List<DocumentEntity> documents) {
        this.plant = plant;
        this.Rul=Rul;
        this.equipmentName = equipmentName;
        this.technicalId = technicalId;
        this.process = process;
        this.location = location;
        this.serialNumber = serialNumber;
        this.masterDataName = masterDataName;
        this.immobilizationNumber = immobilizationNumber;
        this.year = year;
        this.equipmentCommercialized = equipmentCommercialized;
        this.pdrCommercialized = pdrCommercialized;
        this.age = age;
        this.degradability = degradability;
        this.productionHours = productionHours;
        this.hpCoefficient = hpCoefficient;
        this.replacementParts = replacementParts;
        this.maintenanceMttrMtbf = maintenanceMttrMtbf;
        this.technology = technology;
        this.agingResult = agingResult;
        this.equipmentStatus = equipmentStatus;
        this.physicalStatus = physicalStatus;
        this.documents = documents;

    }
    public Equipment(PlantType plant, String equipmentName, String technicalId, String process, LocationType location, String serialNumber, String masterDataName, String immobilizationNumber, Integer year, Boolean equipmentCommercialized, Boolean pdrCommercialized, Integer age, Double degradability, Double productionHours, Double hpCoefficient, String replacementParts, String maintenanceMttrMtbf, String technology, String agingResult, String equipmentStatus, String physicalStatus, List<DocumentEntity> documents) {
        this.plant = plant;
        this.equipmentName = equipmentName;
        this.technicalId = technicalId;
        this.process = process;
        this.location = location;
        this.serialNumber = serialNumber;
        this.masterDataName = masterDataName;
        this.immobilizationNumber = immobilizationNumber;
        this.year = year;
        this.equipmentCommercialized = equipmentCommercialized;
        this.pdrCommercialized = pdrCommercialized;
        this.age = age;
        this.degradability = degradability;
        this.productionHours = productionHours;
        this.hpCoefficient = hpCoefficient;
        this.replacementParts = replacementParts;
        this.maintenanceMttrMtbf = maintenanceMttrMtbf;
        this.technology = technology;
        this.agingResult = agingResult;
        this.equipmentStatus = equipmentStatus;
        this.physicalStatus = physicalStatus;
        this.documents = documents;

    }



    public Equipment(PlantType plant, String equipmentName, String technicalId, String process, LocationType location, String serialNumber, String masterDataName, String immobilizationNumber, Integer year, Boolean equipmentCommercialized, Boolean pdrCommercialized, Integer age, Double degradability, Double productionHours, Double hpCoefficient, String replacementParts, String maintenanceMttrMtbf, String technology, String agingResult, String equipmentStatus, String physicalStatus, List<DocumentEntity> documents, List<DocumentEntity> archive) {
        this.plant = plant;
        this.equipmentName = equipmentName;
        this.technicalId = technicalId;
        this.process = process;
        this.location = location;
        this.serialNumber = serialNumber;
        this.masterDataName = masterDataName;
        this.immobilizationNumber = immobilizationNumber;
        this.year = year;
        this.equipmentCommercialized = equipmentCommercialized;
        this.pdrCommercialized = pdrCommercialized;
        this.age = age;
        this.degradability = degradability;
        this.productionHours = productionHours;
        this.hpCoefficient = hpCoefficient;
        this.replacementParts = replacementParts;
        this.maintenanceMttrMtbf = maintenanceMttrMtbf;
        this.technology = technology;
        this.agingResult = agingResult;
        this.equipmentStatus = equipmentStatus;
        this.physicalStatus = physicalStatus;
        this.documents = documents;
        this.archive = archive;
    }
}
