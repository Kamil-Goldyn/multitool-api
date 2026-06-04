package com.devacademy.multitool_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskCreateRequest {

    @NotBlank(message = "Tytul nie moze byc pusty!")
    @Size(min = 3, max = 100, message = "Tytul musi miec od 3 do 100 znakow")
    private String title;

    @NotBlank(message = "Opis nie moze byc pusty!")
    private String description;

    @Pattern(regexp = "TODO|IN_PROGRESS|DONE", message = "Status musi byc jednym z: TODO, IN_PROGRESS, DONE")
    private String status;
}