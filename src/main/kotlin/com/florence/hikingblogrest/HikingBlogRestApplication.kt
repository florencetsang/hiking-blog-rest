package com.florence.hikingblogrest

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
open class HikingBlogRestApplication

fun main(args: Array<String>) {
    runApplication<HikingBlogRestApplication>(*args)
}