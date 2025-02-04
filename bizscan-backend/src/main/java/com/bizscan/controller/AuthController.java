package com.bizscan.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bizscan.model.User;
import com.bizscan.service.AuthService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/auth")
class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return authService.signup(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody User user) {
        String email = user.getEmail();
        String password = user.getPassword();
        
        Optional<User> foundUser = authService.login(email, password);
        
        if (foundUser.isPresent()) {
            return ResponseEntity.ok(foundUser.get());
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

}