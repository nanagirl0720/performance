package com.xima.per;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;



@SpringBootApplication
@EnableCaching
public class PerformanceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PerformanceApplication.class, args);
        System.out.println("Start End...");
    }

}
