package com.bizscan.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String profileImage;
    private String description;
    private String location;
    private String phoneNo;
    private List<String> carousels;
    private List<Service> services;
}
