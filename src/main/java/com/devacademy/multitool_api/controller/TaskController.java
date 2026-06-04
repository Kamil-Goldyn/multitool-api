package com.devacademy.multitool_api.controller;

import com.devacademy.multitool_api.dto.TaskCreateRequest;
import com.devacademy.multitool_api.model.Task;
import com.devacademy.multitool_api.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskCreateRequest request) {
        Task createdTask = taskService.createTask(request);
        // Zgodnie ze standardem REST: zwracamy status 201 (Created) oraz stworzony obiekt
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.findAllTasks();
        return ResponseEntity.ok(tasks);
    }
}