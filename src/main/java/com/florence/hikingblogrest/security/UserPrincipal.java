package com.florence.hikingblogrest.security;

public class UserPrincipal {
    String uid;

    public UserPrincipal(String uid) {
        this.uid = uid;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
}
