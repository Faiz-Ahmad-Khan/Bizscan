package com.bizscan.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import com.bizscan.model.User;
import com.bizscan.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/profile")
class ProfileController {
	@Autowired
	private UserRepository userRepository;

	@GetMapping("/{id}")
	public Optional<User> getProfile(@PathVariable String id) {
		return userRepository.findById(id);
	}

	@PutMapping("/{id}")
	public User updateProfile(@PathVariable String id, @RequestParam("name") String name,
			@RequestParam("description") String description, @RequestParam("location") String location,
			@RequestParam("phoneNo") String phoneNo,
			@RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
			@RequestParam(value = "headerImage", required = false) MultipartFile headerImage) {

		return userRepository.findById(id).map(user -> {
			user.setName(name);
			user.setDescription(description);
			user.setLocation(location);
			user.setPhoneNo(phoneNo);

			String uploadDir = "uploads/";

			try {
				if (profileImage != null && !profileImage.isEmpty()) {
					String profileImageName = System.currentTimeMillis() + "_" + profileImage.getOriginalFilename();
					Path profileImagePath = Paths.get(uploadDir + profileImageName);
					Files.write(profileImagePath, profileImage.getBytes());
					user.setProfileImage(profileImageName);
				}

				if (headerImage != null && !headerImage.isEmpty()) {
					String headerImageName = System.currentTimeMillis() + "_" + headerImage.getOriginalFilename();
					Path headerImagePath = Paths.get(uploadDir + headerImageName);
					Files.write(headerImagePath, headerImage.getBytes());
					user.setHeaderImage(headerImageName);
				}
			} catch (Exception e) {
				throw new RuntimeException("Image upload failed", e);
			}

			return userRepository.save(user);
		}).orElseThrow(() -> new RuntimeException("User not found"));
	}

	@PutMapping("/{id}/change-email")
	public ResponseEntity<String> changeEmail(@PathVariable String id, @RequestBody Map<String, String> request) {
		return userRepository.findById(id).map(user -> {
			user.setEmail(request.get("email"));
			userRepository.save(user);
			return ResponseEntity.ok("Email updated successfully");
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
	}

	@PutMapping("/{id}/change-password")
	public ResponseEntity<String> changePassword(@PathVariable String id, @RequestBody Map<String, String> passwords) {
		return userRepository.findById(id).map(user -> {
			if (!user.getPassword().equals(passwords.get("oldPassword"))) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect old password");
			}
			user.setPassword(passwords.get("newPassword"));
			userRepository.save(user);
			return ResponseEntity.ok("Password updated successfully");
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
	}
	
	@GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable String id) {
        try {
            String qrContent = "http://localhost:3000/dashboard?id=" + id;
            int width = 300;
            int height = 300;
            
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, width, height);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(baos.toByteArray());
            
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

	@DeleteMapping("/{id}")
	public void deleteProfile(@PathVariable String id) {
		userRepository.deleteById(id);
	}
}
