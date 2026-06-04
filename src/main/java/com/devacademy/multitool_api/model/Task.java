package com.devacademy.multitool_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity                        // Mówi JPA, że to jest tabela bazodanowa
@Table(name = "tasks")         // Jawna nazwa tabeli w bazie
@Data                          // Lombok: generuje gettery, settery, toString, equals i hashCode
@NoArgsConstructor             // Lombok: generuje pusty konstruktor (wymagany przez JPA)
@AllArgsConstructor            // Lombok: generuje konstruktor ze wszystkimi polami
@Builder                       // Lombok: wzorzec projektowy Builder (bardzo ułatwia tworzenie obiektów)
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Automatyczne auto-increment dla ID (1, 2, 3...)
    private Long id;
    private String title;
    private String description;
    private String status; // np. TODO, IN_PROGRESS, DONE
    private LocalDateTime createdAt;
}