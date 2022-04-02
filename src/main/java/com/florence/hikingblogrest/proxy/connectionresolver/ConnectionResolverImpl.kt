package com.florence.hikingblogrest.proxy.connectionresolver

import mu.KotlinLogging
import java.sql.Connection
import java.sql.SQLException
import javax.sql.DataSource

class ConnectionResolverImpl(
    private val dataSource: DataSource
): ConnectionResolver {
    private val logger = KotlinLogging.logger {}

    init {
        logger.info { "Initialized connection resolver" }
    }

    override fun resolveConnection(autoCommit: Boolean): Connection? {
        var connection: Connection? = null
        try {
            connection = dataSource.connection
            connection.autoCommit = autoCommit
        } catch (e: SQLException) {
            logger.error("Resolve connection error", e)
            if (connection != null) {
                try {
                    connection.close()
                } catch (e: SQLException) {
                    logger.error("Cannot close connection", e)
                }
            }
        }
        return connection
    }
}
