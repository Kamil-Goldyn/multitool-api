package com.devacademy.multitool_api.service;

import com.devacademy.multitool_api.dto.TaskCreateRequest;
import com.devacademy.multitool_api.exception.ResourceNotFoundException;
import com.devacademy.multitool_api.model.Task;
import com.devacademy.multitool_api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor // Lombok automatycznie wygeneruje konstruktor i wstrzyknie repozytorium (Dependency Injection)
public class TaskService {

    private final TaskRepository taskRepository;

    public Task createTask(TaskCreateRequest request) {
        // Mapowanie DTO -> Entity przy uzyciu wzorca Builder (dzieki @Builder w klasie Task)
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "TODO")
                .createdAt(LocalDateTime.now())
                .build();

        return taskRepository.save(task);
    }

    public List<Task> findAllTasks() {
        return taskRepository.findAll();
    }

    public Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + id + " not found"));
    }

    public void deleteTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + id + " not found"));

        taskRepository.delete(task);
    }
}