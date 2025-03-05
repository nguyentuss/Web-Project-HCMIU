package com.example.hcmiuweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

@SpringBootApplication
public class HcmiuWebApplication {

	public static void main(String[] args) {
		SpringApplication.run(HcmiuWebApplication.class, args);
	}

//	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/").setViewName("index");
	}
}
