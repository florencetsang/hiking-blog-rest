package com.florence.hikingblogrest.service

import com.florence.hikingblogrest.dto.Tag
import com.florence.hikingblogrest.proxy.TagDAO

class TagService(private val tagDAO: TagDAO) {
    fun getTags(uid: String): List<Tag> {
        return tagDAO.getTags(uid, -1)
    }

    fun getTag(uid: String, tagId: Int): Tag? {
        val tags = tagDAO.getTags(uid, tagId)
        if (tags.isEmpty()) {
            return null
        }
        return tags[0]
    }

    fun getTagByName(uid: String, tagName: String): Tag? {
        val tags = tagDAO.getTagByName(uid, tagName)
        if (tags.isEmpty()) {
            return null
        }
        return tags[0]
    }

    fun addTag(uid: String, name: String, description: String): Int {
        return tagDAO.addTag(uid, name, description)
    }

    fun deleteTag(uid: String, tagId: Int): Int {
        return tagDAO.deleteTag(uid, tagId)
    }
}
