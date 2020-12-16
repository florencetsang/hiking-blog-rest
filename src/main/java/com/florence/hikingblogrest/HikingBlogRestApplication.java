package com.florence.hikingblogrest;

import com.florence.hikingblogrest.proxy.DatabaseDAO;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HikingBlogRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(HikingBlogRestApplication.class, args);

//        DatabaseDAO database = new DatabaseDAO();
//        database.getData();
    }

}
