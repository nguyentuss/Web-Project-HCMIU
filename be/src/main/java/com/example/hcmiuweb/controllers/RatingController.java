package com.example.hcmiuweb.controllers;

import com.example.hcmiuweb.dtos.RatingRequestDTO;
import com.example.hcmiuweb.entities.User;
import com.example.hcmiuweb.entities.Video;
import com.example.hcmiuweb.entities.VideoRating;
import com.example.hcmiuweb.entities.VideoRatingId;
import com.example.hcmiuweb.services.RatingService;
import com.example.hcmiuweb.services.UserDetailsImpl;
import com.example.hcmiuweb.dtos.RatingDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://172.18.0.3:5173", 
    "https://netflex.id.vn", 
    "http://netflex.id.vn"
})
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<?> addRating(@RequestBody RatingRequestDTO requestDTO) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            // Check if the userId in the request matches the authenticated user's ID
            if (requestDTO.getUserId() != null && !requestDTO.getUserId().equals(authenticatedUserId)) {
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Error: You can only rate videos with your own user ID");
            }
            
            // Set the userId in the request to the authenticated user's ID
            requestDTO.setUserId(authenticatedUserId);

            // Convert request DTO to entity
            VideoRating rating = new VideoRating();
            rating.setRating(requestDTO.getRating());

            User user = new User();
            user.setId(authenticatedUserId);
            rating.setUser(user);

            Video video = new Video();
            video.setId(requestDTO.getVideoId());
            rating.setVideo(video);

            // Rest of your code
            VideoRating savedRating = ratingService.addRating(rating);
            return ResponseEntity.ok(RatingDTO.fromEntity(savedRating));
        } catch (Exception e) {
            // Error handling
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing rating: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/{videoId}")
    public ResponseEntity<?> deleteRating(@PathVariable Long userId, @PathVariable Long videoId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            // Check if the userId in the path matches the authenticated user's ID
            if (!userId.equals(authenticatedUserId)) {
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Error: You can only delete your own ratings");
            }
            
            VideoRatingId id = new VideoRatingId(authenticatedUserId, videoId);
            ratingService.deleteRating(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error deleting rating: " + e.getMessage());
        }
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace(); // For debugging in console
        return ResponseEntity.badRequest().body("Error processing rating: " + ex.getMessage());
    }
}