package com.florence.hikingblogrest.rest.response

import org.codehaus.jackson.map.ObjectMapper
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class FailApiResTest {
    @Test
    fun testSerialization() {
        val objectMapper = ObjectMapper()

        val apiRes = FailApiRes("error msg")
        val apiResStr = objectMapper.writeValueAsString(apiRes)
        assertEquals("{\"error\":\"error msg\",\"success\":false}", apiResStr)
    }
}
