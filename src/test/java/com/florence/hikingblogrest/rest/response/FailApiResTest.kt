package com.florence.hikingblogrest.rest.response

import org.codehaus.jackson.map.ObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class FailApiResTest {
    @Test
    fun testSerialization() {
        val objectMapper = ObjectMapper()

        val apiRes = FailApiRes("error msg")
        val apiResStr = objectMapper.writeValueAsString(apiRes)
        assertEquals("{\"success\":false,\"error\":\"error msg\"}", apiResStr)
    }
}
