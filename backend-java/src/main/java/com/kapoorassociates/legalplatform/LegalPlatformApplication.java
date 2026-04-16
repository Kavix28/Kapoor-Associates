package com.kapoorassociates.legalplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LegalPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(LegalPlatformApplication.class, args);
	}

}
