package com.florence.hikingblogrest.rest

import com.florence.hikingblogrest.rest.response.ApiRes
import com.florence.hikingblogrest.rest.response.FailApiRes
import com.florence.hikingblogrest.rest.response.SuccessApiRes
import com.florence.hikingblogrest.security.UserPrincipal
import com.florence.hikingblogrest.service.TagService
import mu.KotlinLogging
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/tag")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:5000"])
class TagController(private val tagService: TagService) {
    private val logger = KotlinLogging.logger {}

    private val CANNOT_GET_RES: ApiRes = FailApiRes("cannot get tag")
    private val CANNOT_CREATE_RES: ApiRes = FailApiRes("cannot create tag")
    private val CANNOT_DELETE_RES: ApiRes = FailApiRes("cannot delete tag")

    @GetMapping(value = ["/getTags"], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getTags(
            @AuthenticationPrincipal userPrincipal: UserPrincipal): ApiRes {
        val uid = userPrincipal.uid
        logger.info("Get tags. UID: {}", uid)
        val tags = tagService.getTags(uid)
        return SuccessApiRes(tags)
    }

    @GetMapping(value = ["/getTag"], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getTag(
            @RequestParam tagId: Int,
            @AuthenticationPrincipal userPrincipal: UserPrincipal): ApiRes {
        val uid = userPrincipal.uid
        logger.info("Get tag. UID: {}, tagId: {}", uid, tagId)
        val tag = tagService.getTag(uid, tagId)
        if (tag == null) {
            logger.info("cannot get tag {}", tagId)
            return CANNOT_GET_RES
        }
        logger.info("Get tag {}", tagId)
        return SuccessApiRes(tag)
    }

    @GetMapping(value = ["/getTagByName"], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getTag(
        @RequestParam tagName: String,
        @AuthenticationPrincipal userPrincipal: UserPrincipal): ApiRes {
        val uid = userPrincipal.uid
        logger.info("Get tag by name. UID: {}, tagName: {}", uid, tagName)
        val tag = tagService.getTagByName(uid, tagName)
        if (tag == null) {
            logger.info("cannot get tag by name {}", tagName)
            return CANNOT_GET_RES
        }
        logger.info("Get tag by name {}", tagName)
        return SuccessApiRes(tag)
    }

    @PostMapping(value = ["/addTag"], consumes = [MediaType.APPLICATION_JSON_VALUE], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun addTag(
            @RequestBody createTagReqBody: CreateTagReqBody,
            @AuthenticationPrincipal userPrincipal: UserPrincipal): ApiRes {
        val uid = userPrincipal.uid
        logger.info("Add tag. UID: {}, tagReqBody: {}", uid, createTagReqBody)
        val addedTagId = tagService.addTag(uid, createTagReqBody.name, createTagReqBody.description)
        if (addedTagId < 0) {
            logger.info("cannot add tag, addedTagId: {}", addedTagId)
            return CANNOT_CREATE_RES
        }
        logger.info("Added tag {}", addedTagId)
        return SuccessApiRes(addedTagId)
    }

    @PostMapping(value = ["/deleteTag"], consumes = [MediaType.APPLICATION_JSON_VALUE], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun deleteTag(
            @RequestBody reqBody: DeleteTagReqBody,
            @AuthenticationPrincipal userPrincipal: UserPrincipal): ApiRes {
        val tagId = reqBody.tagId
        val uid = userPrincipal.uid
        val deletedTagId = tagService.deleteTag(uid, tagId)
        logger.info("Delete tag. UID: {}, tagId: {}", uid, tagId)
        if (deletedTagId < 0) {
            logger.info("cannot delete tag {}", tagId)
            return CANNOT_DELETE_RES
        }
        logger.info("Deleted tag {}", deletedTagId)
        return SuccessApiRes(deletedTagId)
    }

    abstract class TagReqBody {
        val name: String = ""
        val description: String = ""

        override fun toString(): String {
            return "name: $name, description: $description"
        }
    }

    class CreateTagReqBody : TagReqBody()

    data class DeleteTagReqBody(val tagId: Int)
}
