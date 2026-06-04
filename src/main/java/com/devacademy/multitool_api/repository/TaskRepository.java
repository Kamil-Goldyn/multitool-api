package com.devacademy.multitool_api.repository;

import com.devacademy.multitool_api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // Mówi Springowi, że to jest komponent odpowiedzialny za bazę danych
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Spring jest tak sprytny, że na podstawie nazwy metody sam wygeneruje zapytanie SQL!
    List<Task> findByStatus(String status);
}