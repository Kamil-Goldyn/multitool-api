package com.devacademy.multitool_api.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice  // (1) Mówi Springowi: ta klasa obsługuje wyjątki ze WSZYSTKICH kontrolerów
public class GlobalExceptionHandler {

    // (2) Obsługuje: zasób nie istnieje → 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(ResourceNotFoundException ex,
                                                HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail
                .forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());

        problem.setTitle("Resource Not Found");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("timestamp", Instant.now());

        return problem;
    }

    // (3) Obsługuje: błędy walidacji (@Valid) → 400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex,
                                                HttpServletRequest request) {
        // Zbieramy wszystkie błędy pól w mapę: { "title": "Tytul nie moze byc pusty!", ... }
        Map<String, String> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (first, second) -> first  // jeśli to samo pole ma 2 błędy, bierzemy pierwszy
                ));

        ProblemDetail problem = ProblemDetail
                .forStatusAndDetail(HttpStatus.BAD_REQUEST, "Żądanie zawiera nieprawidłowe dane");

        problem.setTitle("Validation Failed");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("errors", fieldErrors);  // dodajemy mapę błędów jako extra pole

        return problem;
    }

    // (4) Obsługuje: wszystko inne, czego się nie spodziewamy → 500
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex,
                                                HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail
                .forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Wystąpił nieoczekiwany błąd serwera");

        problem.setTitle("Internal Server Error");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("timestamp", Instant.now());

        return problem;
    }
}
