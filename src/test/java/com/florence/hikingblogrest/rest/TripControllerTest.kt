package com.florence.hikingblogrest.rest

import com.florence.hikingblogrest.rest.TripController.CreateTripReqBody
import org.codehaus.jackson.map.ObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class TripControllerTest {
    @Test
    fun testReqBodyDeserialization() {
        val objectMapper = ObjectMapper()

        var reqBodyStr: String
        var createTripReqBody: CreateTripReqBody

        reqBodyStr = "{\"name\": \"name\", \"description\": \"description\", \"tagIds\": []}"
        createTripReqBody = objectMapper.readValue(reqBodyStr, CreateTripReqBody::class.java)
        assertEquals("name", createTripReqBody.name)
        assertEquals("description", createTripReqBody.description)
        assertTrue(createTripReqBody.tagIds.isEmpty())

        reqBodyStr = "{\"name\": \"name\", \"description\": \"description\", \"tagIds\": [1]}"
        createTripReqBody = objectMapper.readValue(reqBodyStr, CreateTripReqBody::class.java)
        assertEquals("name", createTripReqBody.name)
        assertEquals("description", createTripReqBody.description)
        assertEquals(1, createTripReqBody.tagIds.size)
        assertEquals(1, createTripReqBody.tagIds[0])
    }
}
