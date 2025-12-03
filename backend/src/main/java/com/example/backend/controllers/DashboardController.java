package com.example.backend.controllers;


import com.example.backend.Equipment.Equipment;
import com.example.backend.Equipment.PlantType;
import com.example.backend.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final EquipmentRepository equipmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@RequestParam String plant) {
        List<Equipment> equipments = equipmentRepository.findAll().stream()
                .filter(e -> e.getPlant().name().equalsIgnoreCase(plant))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();

        Map<String, Double> avgAgesByLocation = Arrays.asList("CuttingWirePreparation", "Assembly", "PostAssemblyTesting").stream()
                .collect(Collectors.toMap(
                        loc -> loc,
                        loc -> equipments.stream()
                                .filter(e -> e.getLocation().name().equalsIgnoreCase(loc))
                                .mapToInt(Equipment::getAge)
                                .average()
                                .orElse(0.0)
                ));

        double avgRul = equipments.stream().mapToInt(Equipment::getRul).average().orElse(0.0);

        Map<String, Map<String, Long>> equipmentCountsByLocation = new HashMap<>();
        for (String loc : Arrays.asList("CuttingWirePreparation", "Assembly", "PostAssemblyTesting")) {
            Map<String, Long> counts = equipments.stream()
                    .filter(e -> e.getLocation().name().equalsIgnoreCase(loc))
                    .collect(Collectors.groupingBy(
                            Equipment::getMasterDataName, Collectors.counting()
                    ));
            equipmentCountsByLocation.put(loc, counts);
        }

        response.put("avgAges", avgAgesByLocation);
        response.put("avgRul", avgRul);
        response.put("equipmentCounts", equipmentCountsByLocation);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/riskZones")
    public Map<String, Long> getRiskZoneCounts(@RequestParam String plant) {
        // Convert input string to enum safely
        PlantType plantEnum = PlantType.valueOf(plant);
        String plantName = plantEnum.name(); // Convert enum to String if repository expects String

        List<Equipment> equipmentList = equipmentRepository.findByPlant(plantName);

        Map<String, Long> riskCounts = equipmentList.stream().collect(Collectors.groupingBy(e -> {
            int age = e.getAge();
            int rul = e.getRul();
            if (rul < 5 || age > 10) return "Critical";
            else if (rul >= 5 && rul <= 10) return "Warning";
            else return "Safe";
        }, Collectors.counting()));

        // Ensure all keys are present
        riskCounts.putIfAbsent("Critical", 0L);
        riskCounts.putIfAbsent("Warning", 0L);
        riskCounts.putIfAbsent("Safe", 0L);

        return riskCounts;
    }

    @GetMapping("/healthSummary")
    public Map<String, Object> getHealthSummary(@RequestParam String plant) {
        List<Equipment> equipmentList = equipmentRepository.findByPlant(plant);

        long totalEquipment = equipmentList.size();

        Map<String, Long> riskCounts = equipmentList.stream().collect(Collectors.groupingBy(e -> {
            int age = e.getAge();
            int rul = e.getRul();
            if (rul < 5 || age > 10) return "Critical";
            else if (rul >= 5 && rul <= 10) return "Warning";
            else return "Safe";
        }, Collectors.counting()));

        double avgRul = equipmentList.stream().mapToDouble(Equipment::getRul).average().orElse(0);
        double avgAge = equipmentList.stream().mapToDouble(Equipment::getAge).average().orElse(0);

        // Make sure all keys exist:
        riskCounts.putIfAbsent("Critical", 0L);
        riskCounts.putIfAbsent("Warning", 0L);
        riskCounts.putIfAbsent("Safe", 0L);

        Map<String, Object> response = new HashMap<>();
        response.put("totalEquipment", totalEquipment);
        response.put("riskZones", riskCounts);
        response.put("avgRul", avgRul);
        response.put("avgAge", avgAge);

        return response;
    }

    @GetMapping("/topCriticalEquipment")
    public List<Map<String, Object>> getTopCriticalEquipment(@RequestParam String plant) {
        List<Equipment> equipmentList = equipmentRepository.findByPlant(plant);

        return equipmentList.stream()
                .filter(e -> {
                    int rul = e.getRul();
                    int age = e.getAge();
                    return rul < 5 || age > 10; // Critical condition
                })
                .sorted(Comparator.comparingInt(Equipment::getRul))
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", e.getId());
                    map.put("name", e.getEquipmentName());
                    map.put("location", e.getLocation());
                    map.put("age", e.getAge());
                    map.put("rul", e.getRul());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/equipmentAgeDistribution")
    public Map<String, Long> getAgeDistribution(@RequestParam String plant) {
        List<Equipment> equipmentList = equipmentRepository.findByPlant(plant);

        Map<String, Long> ageGroups = equipmentList.stream().collect(Collectors.groupingBy(e -> {
            int age = e.getAge();
            if (age <= 3) return "0-3 yrs";
            else if (age <= 7) return "4-7 yrs";
            else return "8+ yrs";
        }, Collectors.counting()));

        // Ensure all groups present
        ageGroups.putIfAbsent("0-3 yrs", 0L);
        ageGroups.putIfAbsent("4-7 yrs", 0L);
        ageGroups.putIfAbsent("8+ yrs", 0L);

        return ageGroups;
    }

}
