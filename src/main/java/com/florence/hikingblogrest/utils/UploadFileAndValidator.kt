package com.florence.hikingblogrest.utils

import org.springframework.web.multipart.MultipartFile

class UploadFileAndValidator(private val validators: List<UploadFileValidator>): UploadFileValidator {
    override fun validate(file: MultipartFile): Boolean {
        return validators
            .firstOrNull { validator -> !validator.validate(file) } == null
    }
}
