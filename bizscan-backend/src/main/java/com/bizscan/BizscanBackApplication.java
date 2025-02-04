package com.bizscan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class BizscanBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(BizscanBackApplication.class, args);
	}
}
