package com.example.yourapplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/fetch-data")
    public ResponseEntity<String> fetchData() {
        String url = "https://api.example.com/data";  // Replace with the actual API URL
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }
}
