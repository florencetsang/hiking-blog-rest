package com.florence.hikingblogrest.configurations

import com.florence.hikingblogrest.utils.UploadFileAndValidator
import com.florence.hikingblogrest.utils.UploadFileExtensionValidator
import com.florence.hikingblogrest.utils.UploadFileValidator
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class UtilsConfig {
    @Bean
    protected fun routeFileExtensionValidator(): UploadFileValidator {
        return UploadFileExtensionValidator(listOf(".gpx"))
    }

    @Bean
    fun routeUploadFileValidator(routeFileExtensionValidator: UploadFileValidator): UploadFileValidator {
        return UploadFileAndValidator(listOf(routeFileExtensionValidator))
    }
}
