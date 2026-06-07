package com.devacademy.multitool_api.service;

import com.devacademy.multitool_api.dto.TaskCreateRequest;
import com.devacademy.multitool_api.dto.TaskResponse;
import com.devacademy.multitool_api.dto.TaskUpdateRequest;
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

    public TaskResponse createTask(TaskCreateRequest request) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "TODO")
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, TaskUpdateRequest request) {
        // 1. Znajdź task — jeśli nie istnieje, GlobalExceptionHandler zwróci 404 automatycznie
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + id + " not found"));

        // 2. Zaktualizuj pola encji
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());

        // 3. Zapisz i zwróć jako DTO (nie jako encję!)
        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    public List<TaskResponse> findAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse findTaskById(Long id) {
        return taskRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + id + " not found"));
    }

    public void deleteTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + id + " not found"));

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .build();
    }
}