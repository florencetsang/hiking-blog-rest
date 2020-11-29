package com.florence.hikingblogrest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchDataAutoConfiguration;

@SpringBootApplication
public class HikingBlogRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(HikingBlogRestApplication.class, args);
    }

}
