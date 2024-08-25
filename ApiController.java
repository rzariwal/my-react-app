package com.example.yourapplication.controller;

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.apache.hc.core5.ssl.TrustAllStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

import javax.net.ssl.SSLContext;
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

    // Custom RestTemplate with SSL disabled
    @Bean
    public RestTemplate restTemplateWithDisabledSSL() throws Exception {
        SSLContext sslContext = SSLContextBuilder.create()
                .loadTrustMaterial(new TrustAllStrategy())
                .build();

        CloseableHttpClient httpClient = HttpClients.custom()
                .setSSLContext(sslContext)
                .build();

        HttpComponentsClientHttpRequestFactory requestFactory =
                new HttpComponentsClientHttpRequestFactory(httpClient);

        return new RestTemplate(requestFactory);
    }

    @GetMapping("/fetch-data")
    public ResponseEntity<String> fetchData() {
        String url = "https://api.example.com/data";  // Replace with the actual API URL
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/applications/{id}")
    public ResponseEntity<String> getApplicationById(@PathVariable("id") String id) {
        String url = "https://api.example.com/applications/" + id;  // Replace with actual external API URL
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    
    @GetMapping("/photo")
    public ResponseEntity<String> getPhotoBySid(@RequestParam("sid") String sid) {
        String url = "https://api.example.com/photo?sid=" + sid;  // Replace with actual external API URL
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/eliteapps/getmetrics")
    public ResponseEntity<String> getMetricsBySealIdAndDate(
            @RequestParam("seal_id") String sealId, 
            @RequestParam("date") String date) {
        String url = "https://api.example.com/eliteapps/getmetrics?seal_id=" + sealId + "&date=" + date;  // Replace with actual external API URL
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }

    // Mapping where SSL is disabled
    @GetMapping("/secure-mapping")
    public ResponseEntity<String> getWithDisabledSSL() throws Exception {
        RestTemplate customRestTemplate = restTemplateWithDisabledSSL();
        String url = "https://example.com/secure-endpoint";  // Replace with actual external API URL
        String response = customRestTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }
}
