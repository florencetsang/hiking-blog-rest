package com.florence.hikingblogrest.service

import com.florence.hikingblogrest.dto.Tag
import com.florence.hikingblogrest.dto.TagRepo

class TagService(
    private val tagRepo: TagRepo
) {
    fun getTags(uid: String): List<Tag> {
        return tagRepo.getTags(uid)
    }

    fun getTag(uid: String, tagId: Int): Tag? {
        val tag = tagRepo.getTag(uid, tagId)
        return tag.orElse(null)
    }

    fun getTagByName(uid: String, tagName: String): Tag? {
        val tags = tagRepo.getTagByName(uid, tagName)
        if (tags.isEmpty()) {
            return null
        }
        return tags[0]
    }

    fun addTag(uid: String, name: String, description: String): Int {
        val tag = tagRepo.save(Tag(uid, name, description))
        return tag.tagId ?: -1
    }

    fun deleteTag(uid: String, tagId: Int): Int {
        tagRepo.deleteTag(uid, tagId)
        return tagId
    }
}
