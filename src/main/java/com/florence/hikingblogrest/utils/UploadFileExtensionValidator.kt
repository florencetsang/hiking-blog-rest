package com.florence.hikingblogrest.utils

import mu.KotlinLogging
import org.springframework.web.multipart.MultipartFile

class UploadFileExtensionValidator(private val patterns: List<String>): UploadFileValidator {
    private val logger = KotlinLogging.logger {}

    override fun validate(file: MultipartFile): Boolean {
        val fileName = file.originalFilename
        if (fileName == null) {
            logger.info { "fileName is null" }
            return false
        }
        if (!patterns.any { fileName.endsWith(it) }) {
            logger.info { "fileName $fileName does not match any of $patterns" }
            return false
        }
        return true
    }
}
