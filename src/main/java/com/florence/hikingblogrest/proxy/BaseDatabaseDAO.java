package com.florence.hikingblogrest.proxy;

import com.florence.hikingblogrest.dto.Activity;
import com.florence.hikingblogrest.dto.Routes;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public interface BaseDatabaseDAO {

    Routes getRoutes(String uid);

    List<Activity> getPosts(String uid);

    void insertPost(String name, String description, String route, String uid) throws SQLException;

    void deletePost(String uid, int id) throws SQLException;

}
