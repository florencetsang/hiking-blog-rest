package com.florence.hikingblogrest.rest.response

class SuccessApiRes<T>(val data: T) : ApiRes(true)
