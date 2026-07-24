package com.fantatravel;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableJpaRepositories
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@Configuration
@EnableAsync
@EnableScheduling
@EnableAspectJAutoProxy
public class FantatravelApp {
    private static ConfigurableApplicationContext ctx;

    public static void main(String[] args) {
        ctx = SpringApplication.run(FantatravelApp.class, args);
    }

    public static void exit(int rc) {
        if (ctx != null) {
            SpringApplication.exit(ctx, () -> rc);
        } else {
            System.exit(rc);
        }
    }

    @Bean
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }
}
