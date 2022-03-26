package com.florence.hikingblogrest.proxy

import com.florence.hikingblogrest.dto.Tag
import com.florence.hikingblogrest.dto.Tag.TagBuilder
import com.florence.hikingblogrest.proxy.connectionresolver.ConnectionResolver
import mu.KotlinLogging
import java.sql.ResultSet
import java.sql.Statement
import java.util.*

class TagDAO(
    private val connectionResolver: ConnectionResolver
) {
    private val logger = KotlinLogging.logger {}

    fun getTags(uid: String, tagId: Int): List<Tag> {
        val connection = connectionResolver.resolveConnection(true) ?: return emptyList()
        var tags: List<Tag> = emptyList()
        connection.use {
            val sqlStringBuilder = StringBuilder()
            sqlStringBuilder.append("SELECT * FROM TAG WHERE USER_ID = ?")
            if (tagId >= 0) {
                sqlStringBuilder.append(" AND ID = ?")
            }
            val statement = connection.prepareStatement(sqlStringBuilder.toString())
            statement.use {
                var stmtParamIdx = 1
                statement.setString(stmtParamIdx++, uid)
                if (tagId >= 0) {
                    statement.setInt(stmtParamIdx++, tagId)
                }
                val rs = statement.executeQuery()
                tags = getTagListFromRs(rs)
            }
        }
        return tags
    }

    fun getTagByName(uid: String, tagName: String): List<Tag> {
        val connection = connectionResolver.resolveConnection(true) ?: return emptyList()
        var tags: List<Tag> = emptyList()
        connection.use {
            val sqlStringBuilder = StringBuilder()
            sqlStringBuilder.append("SELECT * FROM TAG WHERE USER_ID = ?")
            sqlStringBuilder.append(" AND NAME LIKE ?")
            val statement = connection.prepareStatement(sqlStringBuilder.toString())
            statement.use {
                statement.setString(1, uid)
                statement.setString(2, "%${tagName}%")
                val rs = statement.executeQuery()
                tags = getTagListFromRs(rs)
            }
        }
        return tags
    }

    fun addTag(uid: String, name: String, description: String): Int {
        val connection = connectionResolver.resolveConnection(true) ?: return -1
        var addedId = -1
        connection.use {
            val statement = connection.prepareStatement(
                "INSERT INTO TAG (NAME, DESCRIPTION, USER_ID) VALUES (?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            )
            statement.use {
                statement.setString(1, name)
                statement.setString(2, description)
                statement.setString(3, uid)
                val addedRowsCnt = statement.executeUpdate()
                if (addedRowsCnt > 0) {
                    val generatedKeys = statement.generatedKeys
                    if (generatedKeys.next()) {
                        addedId = generatedKeys.getInt(1)
                    } else {
                        addedId = -1
                    }
                } else {
                    logger.info("no record is added")
                    addedId = -1
                }
            }
        }
        return addedId
    }

    fun deleteTag(uid: String, tagId: Int): Int {
        val connection = connectionResolver.resolveConnection(true) ?: return -1
        var deletedId = -1
        connection.use {
            val statement = connection.prepareStatement("DELETE FROM TAG WHERE ID = ? AND USER_ID = ?")
            statement.use {
                statement.setInt(1, tagId)
                statement.setString(2, uid)
                val deletedRowsCount = statement.executeUpdate()
                if (deletedRowsCount > 0) {
                    deletedId = tagId
                } else {
                    logger.info("no record is deleted")
                    deletedId = -1
                }
            }
        }
        return deletedId
    }

    fun getTripTags(uid: String, tripId: Int): List<Tag> {
        val connection = connectionResolver.resolveConnection(true) ?: return emptyList()
        var tags: List<Tag> = emptyList()
        connection.use {
            val sqlStringBuilder = StringBuilder()
            sqlStringBuilder.append("SELECT * FROM TAG INNER JOIN TRIP_TAG ON TRIP_TAG.TAG_ID = TAG.ID WHERE TRIP_TAG.USER_ID = ?")
            if (tripId >= 0) {
                sqlStringBuilder.append(" AND TRIP_TAG.TRIP_ID = ?")
            }
            val statement = connection.prepareStatement(sqlStringBuilder.toString())
            statement.use {
                var stmtParamIdx = 1
                statement.setString(stmtParamIdx++, uid)
                if (tripId >= 0) {
                    statement.setInt(stmtParamIdx++, tripId)
                }
                val rs = statement.executeQuery()
                tags = getTagListFromRs(rs)
            }
        }
        return tags
    }

    private fun getTagListFromRs(rs: ResultSet): List<Tag> {
        val tags: MutableList<Tag> = ArrayList()
        while (rs.next()) {
            val id = rs.getInt("ID")
            val name = rs.getString("NAME")
            val description = rs.getString("DESCRIPTION")
            val tagBuilder = TagBuilder()
            tagBuilder.tagId(id)
                .name(name)
                .description(description)
            tags.add(tagBuilder.build())
        }
        return tags
    }
}
