package com.example.backend.services;

import com.example.backend.Equipment.*;
import com.example.backend.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EquipmentServices {

    private final EquipmentRepository equipmentRepository;
    private final GridFsTemplate gridFsTemplate;
    @Autowired
    private GridFsOperations gridFsOperations;

    /**
     * Add equipment based on updated model
     */
    public Equipment addEquipment(
            String equipmentName,
            String serialNumber,
            String immobilizationNumber,
            String plant,
            String location,
            String technicalId,
            String process,
            String masterDataName,
            Boolean equipmentCommercialized,
            Boolean pdrCommercialized,
            Integer year,
            Integer age,
            Double degradability,
            Double productionHours,
            String replacementParts,
            String maintenanceMttrMtbf,
            String technology,
            String equipmentStatus,
            List<MultipartFile> files) {

        Optional<Equipment> existing = equipmentRepository.findBySerialNumber(serialNumber);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("An equipment with the same serial number already exists.");
        }

        PlantType plantType;
        LocationType locationType;

        try {
            plantType = PlantType.valueOf(plant);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid PlantType: " + plant);
        }

        try {
            locationType = LocationType.valueOf(location);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid LocationType: " + location);
        }

        List<DocumentEntity> documentEntities = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                try {
                    ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
                    DocumentEntity document = new DocumentEntity(fileId.toString(), file.getOriginalFilename(), "/files/" + fileId,false, LocalDateTime.now());
                    documentEntities.add(document);
                } catch (IOException e) {
                    throw new RuntimeException("Error storing file: " + file.getOriginalFilename(), e);
                }
            }
        }

        Equipment equipment = new Equipment();
        equipment.setEquipmentName(equipmentName);
        equipment.setSerialNumber(serialNumber);
        equipment.setImmobilizationNumber(immobilizationNumber);
        equipment.setPlant(plantType);
        equipment.setLocation(locationType);
        equipment.setTechnicalId(technicalId);
        equipment.setProcess(process);
        equipment.setMasterDataName(masterDataName);
        equipment.setEquipmentCommercialized(equipmentCommercialized);
        equipment.setPdrCommercialized(pdrCommercialized);
        equipment.setYear(year);
        equipment.setAge(age);
        equipment.setDegradability(degradability);
        equipment.setProductionHours(productionHours);
        equipment.setReplacementParts(replacementParts);
        equipment.setMaintenanceMttrMtbf(maintenanceMttrMtbf);
        equipment.setTechnology(technology);
        equipment.setEquipmentStatus(equipmentStatus);
        equipment.setDocuments(documentEntities);
        equipment.setArchive(new ArrayList<>());

        return equipmentRepository.save(equipment);
    }

    /**
     * Update equipment with new model structure
     */
    public Equipment updateEquipment(
            String id,
            String equipmentName,
            String serialNumber,
            String immobilizationNumber,
            String plant,
            String location,
            String technicalId,
            String process,
            String masterDataName,
            Boolean equipmentCommercialized,
            Boolean pdrCommercialized,
            Integer year,
            Integer age,
            Double degradability,
            Double productionHours,
            Double hpCoefficient,
            String replacementParts,
            String maintenanceMttrMtbf,
            String technology,
            String agingResult,
            String equipmentStatus,
            String physicalStatus,
            List<MultipartFile> documents,
            String fileIdToReplace) {

        Optional<Equipment> equipmentOpt = equipmentRepository.findById(id);
        if (equipmentOpt.isPresent()) {
            Equipment equipment = equipmentOpt.get();

            if (plant != null) {
                try {
                    equipment.setPlant(PlantType.valueOf(plant));
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid PlantType: " + plant);
                }
            }

            if (location != null) {
                try {
                    equipment.setLocation(LocationType.valueOf(location));
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid LocationType: " + location);
                }
            }

            if (equipmentName != null) equipment.setEquipmentName(equipmentName);
            if (serialNumber != null) equipment.setSerialNumber(serialNumber);
            if (immobilizationNumber != null) equipment.setImmobilizationNumber(immobilizationNumber);
            if (technicalId != null) equipment.setTechnicalId(technicalId);
            if (process != null) equipment.setProcess(process);
            if (masterDataName != null) equipment.setMasterDataName(masterDataName);
            if (equipmentCommercialized != null) equipment.setEquipmentCommercialized(equipmentCommercialized);
            if (pdrCommercialized != null) equipment.setPdrCommercialized(pdrCommercialized);
            if (year != null) equipment.setYear(year);
            if (age != null) equipment.setAge(age);
            if (degradability != null) equipment.setDegradability(degradability);
            if (productionHours != null) equipment.setProductionHours(productionHours);
            if (hpCoefficient != null) equipment.setHpCoefficient(hpCoefficient);
            if (replacementParts != null) equipment.setReplacementParts(replacementParts);
            if (maintenanceMttrMtbf != null) equipment.setMaintenanceMttrMtbf(maintenanceMttrMtbf);
            if (technology != null) equipment.setTechnology(technology);
            if (agingResult != null) equipment.setAgingResult(agingResult);
            if (equipmentStatus != null) equipment.setEquipmentStatus(equipmentStatus);
            if (physicalStatus != null) equipment.setPhysicalStatus(physicalStatus);

            if (documents != null) {
                for (MultipartFile document : documents) {
                    try {
                        if (fileIdToReplace != null) {
                            for (int i = 0; i < equipment.getDocuments().size(); i++) {
                                DocumentEntity doc = equipment.getDocuments().get(i);
                                if (doc.getId().equals(fileIdToReplace)) {
                                    gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(fileIdToReplace))));
                                    ObjectId newFileId = gridFsTemplate.store(document.getInputStream(), document.getOriginalFilename(), document.getContentType());
                                    DocumentEntity updatedDoc = new DocumentEntity(newFileId.toString(), document.getOriginalFilename(), "/files/" + newFileId,false, LocalDateTime.now());
                                    equipment.getDocuments().set(i, updatedDoc);
                                    break;
                                }
                            }
                        } else {
                            ObjectId fileId = gridFsTemplate.store(document.getInputStream(), document.getOriginalFilename(), document.getContentType());
                            DocumentEntity doc = new DocumentEntity(fileId.toString(), document.getOriginalFilename(), "/files/" + fileId,false, LocalDateTime.now());
                            equipment.getDocuments().add(doc);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException("Error handling document upload", e);
                    }
                }
            }

            return equipmentRepository.save(equipment);
        }

        return null;
    }

    /**
     * Get all equipment
     */
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    /**
     * Get equipment by ID
     */
    public Optional<Equipment> getEquipmentById(String id) {
        return equipmentRepository.findBySerialNumber(id);
    }

    
    
    
    




    
    /**
     * Delete equipment by ID.
     */
    public void deleteEquipment(String id) {
        Optional<Equipment> optionalEquipment = equipmentRepository.findById(id);

        if (optionalEquipment.isPresent()) {
            Equipment equipment = optionalEquipment.get();

            // Delete each associated file from GridFS
            if (equipment.getDocuments() != null) {
                equipment.getDocuments().forEach(document -> {
                    String fileId =  document.getId(); // or document.getId() depending on your model
                    gridFsOperations.delete(Query.query(Criteria.where("_id").is(fileId)));
                });
            }

            // Now delete the equipment itself
            equipmentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Equipment not found with id: " + id);
        }
    }


    /**
     * Add a document to existing equipment.
     */
    public Equipment addDocumentToEquipment(String equipmentId, MultipartFile file) {
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isPresent()) {
            Equipment equipment = equipmentOpt.get();
            try {
                ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
                DocumentEntity document = new DocumentEntity(fileId.toString(), file.getOriginalFilename(), "/files/" + fileId,false, LocalDateTime.now());
                equipment.getDocuments().add(document);
                return equipmentRepository.save(equipment);
            } catch (IOException e) {
                throw new RuntimeException("Error storing file: " + file.getOriginalFilename(), e);
            }
        }
        return null;
    }

    /**
     * Remove a document from an equipment.
     */
    public Equipment removeDocumentFromEquipment(String equipmentId, String documentId) {
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isPresent()) {
            Equipment equipment = equipmentOpt.get();
            equipment.getDocuments().removeIf(doc -> doc.getId().equals(documentId));
            return equipmentRepository.save(equipment);
        }
        return null;
    }
    
    
    // Update only a specific document of a specific equipment
    public Equipment updateDocumentOfEquipment(
            String equipmentId,
            String fileIdToReplace,
            MultipartFile newFile
    ) {
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isPresent()) {
            Equipment equipment = equipmentOpt.get();

            // Find the document to replace by its fileId
            for (int i = 0; i < equipment.getDocuments().size(); i++) {
                DocumentEntity doc = equipment.getDocuments().get(i);
                if (doc.getId().equals(fileIdToReplace)) {
                    try {
                        // Delete the old file from GridFS
                        gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(fileIdToReplace))));

                        // Store the new file in GridFS
                        ObjectId newFileId = gridFsTemplate.store(newFile.getInputStream(), newFile.getOriginalFilename(), newFile.getContentType());

                        // Create the updated document entity
                        DocumentEntity updatedDocument = new DocumentEntity(
                                newFileId.toString(),
                                newFile.getOriginalFilename(),
                                "/files/" + newFileId,false,
                                LocalDateTime.now()
                        );

                        // Replace the old document with the new one
                        equipment.getDocuments().set(i, updatedDocument);
                        equipmentRepository.save(equipment);  // Save the updated equipment

                        return equipment;

                    } catch (IOException e) {
                        throw new RuntimeException("Error updating document: " + newFile.getOriginalFilename(), e);
                    }
                }
            }
        }
        return null;  // Return null if equipment or document not found
    }
    
    
}
