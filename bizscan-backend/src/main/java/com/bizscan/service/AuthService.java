package com.bizscan.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bizscan.model.User;
import com.bizscan.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public User signup(User user) {
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && password.equals(user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }
}
