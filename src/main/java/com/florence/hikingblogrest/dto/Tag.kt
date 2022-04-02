package com.florence.hikingblogrest.dto

import com.fasterxml.jackson.annotation.JsonIgnore
import javax.persistence.*

@Entity(name = "TAG")
@Table(name = "TAG")
class Tag(
    @JsonIgnore
    @Column(name = "user_id")
    val uid: String,
    @Column(name = "name")
    val name: String,
    @Column(name = "description")
    val description: String,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    val tagId: Int? = null
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
            return Tag(uid, name, description, tagId)
        }
    }
}
