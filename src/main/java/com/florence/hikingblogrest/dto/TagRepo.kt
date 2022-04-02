package com.florence.hikingblogrest.dto

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import java.util.*

interface TagRepo : CrudRepository<Tag, Int> {
    @Query("SELECT t FROM TAG t WHERE USER_ID = :uid")
    fun getTags(
        @Param("uid") uid: String
    ): List<Tag>

    @Query("SELECT t FROM TAG t WHERE USER_ID = :uid and ID = :id")
    fun getTag(
        @Param("uid") uid: String,
        @Param("id") id: Int
    ): Optional<Tag>

    @Query("SELECT t FROM TAG t WHERE USER_ID = :uid and NAME LIKE %:name%")
    fun getTagByName(
        @Param("uid") uid: String,
        @Param("name") name: String
    ): List<Tag>

    @Modifying
    @Query("DELETE FROM TAG WHERE USER_ID = :uid AND ID = :id")
    fun deleteTag(
        @Param("uid") uid: String,
        @Param("id") id: Int
    )
}
