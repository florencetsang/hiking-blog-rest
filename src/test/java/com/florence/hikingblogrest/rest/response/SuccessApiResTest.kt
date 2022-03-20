package com.florence.hikingblogrest.rest.response

import org.codehaus.jackson.map.ObjectMapper
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class SuccessApiResTest {
    @Test
    fun testSerialization() {
        val objectMapper = ObjectMapper()

        val apiRes = SuccessApiRes(1)
        val apiResStr = objectMapper.writeValueAsString(apiRes)
        assertEquals("{\"data\":1,\"success\":true}", apiResStr)
    }
}
