package com.florence.hikingblogrest.dto

import com.fasterxml.jackson.annotation.JsonIgnore

class Tag(
    val tagId: Int,
    @JsonIgnore val uid: String,
    val name: String,
    val description: String
) {
    class TagBuilder {
        private var tagId = -1
        private var name: String = ""
        private var uid: String = ""
        private var description: String = ""

        fun tagId(tagId: Int): TagBuilder {
            this.tagId = tagId
            return this
        }

        fun uid(uid: String): TagBuilder {
            this.uid = uid
            return this
        }

        fun name(name: String): TagBuilder {
            this.name = name
            return this
        }

        fun description(description: String): TagBuilder {
            this.description = description
            return this
        }

        fun build(): Tag {
            return Tag(tagId, uid, name, description)
        }
    }
}
