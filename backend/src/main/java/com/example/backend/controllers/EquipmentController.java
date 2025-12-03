package com.example.backend.controllers;

import com.example.backend.user.User;
import com.opencsv.CSVReaderBuilder;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.Equipment.*;

import java.io.Reader;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import com.example.backend.services.*;
import lombok.RequiredArgsConstructor;
import com.example.backend.repository.*;import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import com.opencsv.CSVReader;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {
	@Autowired
    private final EquipmentServices equipmentService;



    @Autowired
    private GridFsTemplate gridFsTemplate;

    private final EquipmentRepository equipmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired

    private NotificationService notificationService;



    @PostMapping("/add")
    public ResponseEntity<Equipment> addEquipment(
            @RequestParam("equipmentName") String equipmentName,
            @RequestParam("serialNumber") String serialNumber,
            @RequestParam("immobilizationNumber") String immobilizationNumber,
            @RequestParam("plant") String plant,
            @RequestParam("location") String location,
            @RequestParam("technicalId") String technicalId,
            @RequestParam("process") String process,
            @RequestParam("masterDataName") String masterDataName,
            @RequestParam("equipmentCommercialized") Boolean equipmentCommercialized,
            @RequestParam("pdrCommercialized") Boolean pdrCommercialized,
            @RequestParam("year") Integer year,
            @RequestParam("age") Integer age,
            @RequestParam("degradability") Double degradability,
            @RequestParam("productionHours") Double productionHours,

            @RequestParam("replacementParts") String replacementParts,
            @RequestParam("maintenanceMttrMtbf") String maintenanceMttrMtbf,
            @RequestParam("technology") String technology,
            @RequestParam("equipmentStatus") String equipmentStatus,
            @RequestParam(value = "documents", required = false) List<MultipartFile> files) {

        Equipment equipment = equipmentService.addEquipment(
                equipmentName, serialNumber, immobilizationNumber, plant, location, technicalId, process,
                masterDataName, equipmentCommercialized, pdrCommercialized, year, age, degradability,
                productionHours, replacementParts, maintenanceMttrMtbf, technology,
                 equipmentStatus, files
        );

        return ResponseEntity.ok(equipment);
    }




    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        List<Equipment> equipments = equipmentService.getAllEquipment();
        return ResponseEntity.ok(equipments);
    }
    
    /**
     * Get equipment by ID.
     */

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable String id) {
        Optional<Equipment> equipment = equipmentService.getEquipmentById(id);
        return equipment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Update equipment details.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/update/{id}")
    public ResponseEntity<Equipment> updateEquipment(
            @PathVariable String id,
            @RequestParam(required = false) String equipmentName,
            @RequestParam(required = false) String serialNumber,
            @RequestParam(required = false) String immobilizationNumber,
            @RequestParam(required = false) String plant,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String technicalId,
            @RequestParam(required = false) String process,
            @RequestParam(required = false) String masterDataName,
            @RequestParam(required = false) Boolean equipmentCommercialized,
            @RequestParam(required = false) Boolean pdrCommercialized,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer age,
            @RequestParam(required = false) Double degradability,
            @RequestParam(required = false) Double productionHours,
            @RequestParam(required = false) Double hpCoefficient,
            @RequestParam(required = false) String replacementParts,
            @RequestParam(required = false) String maintenanceMttrMtbf,
            @RequestParam(required = false) String technology,
            @RequestParam(required = false) String agingResult,
            @RequestParam(required = false) String equipmentStatus,
            @RequestParam(required = false) String physicalStatus,
            @RequestParam(required = false) List<MultipartFile> documents,
            @RequestParam(required = false) String fileIdToReplace) {

        Equipment updatedEquipment = equipmentService.updateEquipment(
                id, equipmentName, serialNumber, immobilizationNumber, plant, location, technicalId,
                process, masterDataName, equipmentCommercialized, pdrCommercialized, year, age,
                degradability, productionHours, hpCoefficient, replacementParts, maintenanceMttrMtbf,
                technology, agingResult, equipmentStatus, physicalStatus, documents, fileIdToReplace
        );

        return updatedEquipment != null ? ResponseEntity.ok(updatedEquipment) : ResponseEntity.notFound().build();
    }


    /**
     * Delete equipment by ID.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable String id) {
    	equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Add a document to an existing equipment.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/{equipmentId}/add-document")
    public ResponseEntity<Equipment> addDocumentToEquipment(
            @PathVariable String equipmentId,
            @RequestParam MultipartFile file) {
        Equipment updatedEquipment = equipmentService.addDocumentToEquipment(equipmentId, file);
        return updatedEquipment != null ? ResponseEntity.ok(updatedEquipment) : ResponseEntity.notFound().build();
    }

    /**
     * Remove a document from equipment.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{equipmentId}/remove-document/{documentId}")
    public ResponseEntity<Equipment> removeDocumentFromEquipment(
            @PathVariable String equipmentId,
            @PathVariable String documentId) {
        Equipment updatedEquipment = equipmentService.removeDocumentFromEquipment(equipmentId, documentId);
        return updatedEquipment != null ? ResponseEntity.ok(updatedEquipment) : ResponseEntity.notFound().build();
    }
    
    // Endpoint for updating a specific document of a specific equipment
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{equipmentId}/document/{fileIdToReplace}")
    public ResponseEntity<Equipment> updateDocument(
            @PathVariable String equipmentId,
            @PathVariable String fileIdToReplace,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Equipment updatedEquipment = equipmentService.updateDocumentOfEquipment(
                    equipmentId,
                    fileIdToReplace,
                    file
            );
            if (updatedEquipment != null) {
                return ResponseEntity.ok(updatedEquipment);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/check/{serialNumber}")
    public ResponseEntity<Map<String, Boolean>> checkSerialNumberExists(@PathVariable String serialNumber) {
        boolean exists = equipmentRepository.findBySerialNumber(serialNumber).isPresent();
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    @PostMapping("/{equipmentId}/replace-document/{docId}")
    public ResponseEntity<?> replaceDocument(
            @PathVariable String equipmentId,
            @PathVariable String docId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("oldDocName") String oldDocName,
            @RequestParam(value = "nextUserId", required = false) String nextUserId,
            @RequestParam(value = "homologated", required = false) String homologatedStr,
            Principal principal) {

        try {
            boolean homologated = "true".equalsIgnoreCase(homologatedStr);

            // 1. Get Equipment
            Optional<Equipment> optionalEquipment = equipmentRepository.findBySerialNumber(equipmentId);
            if (optionalEquipment.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Equipment not found");
            }
            Equipment equipment = optionalEquipment.get();

            // 2. Find old document
            DocumentEntity oldDoc = equipment.getDocuments().stream()
                    .filter(doc -> doc.getId().equals(docId))
                    .findFirst()
                    .orElse(null);

            if (oldDoc == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found in equipment");
            }

            // 3. Move old document to archive
            if (equipment.getArchive() == null) {
                equipment.setArchive(new ArrayList<>());
            }
            equipment.getArchive().add(oldDoc);

            // 4. Delete old file from GridFS
            gridFsTemplate.delete(new Query(Criteria.where("_id").is(docId)));

            // 5. Store new file in GridFS
            ObjectId newFileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());

            DocumentEntity newDoc = new DocumentEntity();
            newDoc.setId(newFileId.toString());
            newDoc.setName(file.getOriginalFilename());
            newDoc.setFilePath("/files/" + newFileId.toString());
            newDoc.setUploadDate(LocalDateTime.now());
            newDoc.setHomologated(homologated);  // Mark homologated if true

            // 6. Replace old doc with new doc in list
            List<DocumentEntity> updatedDocs = equipment.getDocuments().stream()
                    .map(d -> d.getId().equals(docId) ? newDoc : d)
                    .collect(Collectors.toList());

            equipment.setDocuments(updatedDocs);

            // 7. Save equipment
            Equipment saved = equipmentRepository.save(equipment);

            // 8. Send notification only if nextUserId is provided (not last signer)
            if (nextUserId != null && !nextUserId.trim().isEmpty()) {
                User sender = userRepository.findByUsername(principal.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                String senderId = sender.getId();
                String message = "A document for equipment '" + equipment.getEquipmentName() + "' requires your signature.";

                notificationService.sendNotification(senderId, nextUserId, message, equipment.getId(), equipment.getSerialNumber());
            }

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error replacing document: " + e.getMessage());
        }
    }


    //Upload with csv file

    @PostMapping("/upload-csv")
    public ResponseEntity<String> uploadCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Empty file.");
        }

        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            CSVReader csvReader = new CSVReaderBuilder(reader).withSkipLines(1).build(); // skip header
            List<String[]> records = csvReader.readAll();

            // Create a temporary list of new equipment
            List<Equipment> newEquipments = new ArrayList<>();

            for (String[] record : records) {
                Equipment existing = equipmentRepository.findBySerialNumber(record[7].trim()).orElse(null);

                Equipment equipment = new Equipment();
                equipment.setPlant(PlantType.valueOf(record[0].trim()));
                equipment.setEquipmentName(record[1]);
                equipment.setTechnicalId(record[2]);
                equipment.setProcess(record[3]);
                equipment.setMasterDataName(record[4]);
                equipment.setLocation(LocationType.valueOf(record[5].trim()));
                equipment.setImmobilizationNumber(record[6]);
                equipment.setSerialNumber(record[7]);
                equipment.setYear(parseInteger(record[8]));
                equipment.setEquipmentCommercialized(parseBoolean(record[9]));
                equipment.setPdrCommercialized(parseBoolean(record[10]));
                equipment.setAge(parseInteger(record[11]));
                equipment.setDegradability(parseDouble(record[12]));
                equipment.setProductionHours(parseDouble(record[13]));
                equipment.setHpCoefficient(parseDouble(record[14]));
                equipment.setReplacementParts(record[15]);
                equipment.setMaintenanceMttrMtbf(record[16]);
                equipment.setTechnology(record[17]);
                equipment.setAgingResult(record[18]);
                equipment.setEquipmentStatus(record[19]);
                equipment.setPhysicalStatus(record[20]);
                equipment.setRul(parseInteger(record[21]));

                // Preserve documents and archive from existing record
                if (existing != null) {
                    equipment.setDocuments(existing.getDocuments());
                    equipment.setArchive(existing.getArchive());
                } else {
                    equipment.setDocuments(new ArrayList<>());
                    equipment.setArchive(new ArrayList<>());
                }

                newEquipments.add(equipment);
            }

            // Remove all existing equipment
            equipmentRepository.deleteAll();

            // Save the new ones
            equipmentRepository.saveAll(newEquipments);

            return ResponseEntity.ok("CSV uploaded and replaced all equipment successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }


    private Integer parseInteger(String value) {
        try {
            return value == null || value.isBlank() ? null : Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double parseDouble(String value) {
        try {
            return value == null || value.isBlank() ? null : Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Boolean parseBoolean(String value) {
        return value != null && (value.trim().equalsIgnoreCase("true") || value.trim().equalsIgnoreCase("yes") || value.trim().equals("1"));
    }



}