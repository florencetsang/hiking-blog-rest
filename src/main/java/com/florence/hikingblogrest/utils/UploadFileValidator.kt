package com.florence.hikingblogrest.utils

import org.springframework.web.multipart.MultipartFile

interface UploadFileValidator {
    fun validate(file: MultipartFile): Boolean
}
