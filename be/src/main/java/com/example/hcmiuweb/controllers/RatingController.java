package com.example.hcmiuweb.controllers;

import com.example.hcmiuweb.dtos.RatingRequestDTO;
import com.example.hcmiuweb.entities.User;
import com.example.hcmiuweb.entities.Video;
import com.example.hcmiuweb.entities.VideoRating;
import com.example.hcmiuweb.entities.VideoRatingId;
import com.example.hcmiuweb.services.RatingService;
import com.example.hcmiuweb.dtos.RatingDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://172.18.0.3:5173", 
    "https://hcmiu-project-web.id.vn", 
    "http://hcmiu-project-web.id.vn"
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
            // Simple validation
            if (requestDTO.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID must be specified");
            }

            // Convert request DTO to entity
            VideoRating rating = new VideoRating();
            rating.setRating(requestDTO.getRating());

            User user = new User();
            user.setId(requestDTO.getUserId());
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
    public ResponseEntity<Void> deleteRating(@PathVariable Long userId, @PathVariable Long videoId) {
        VideoRatingId id = new VideoRatingId(userId, videoId);
        ratingService.deleteRating(id);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace(); // For debugging in console
        return ResponseEntity.badRequest().body("Error processing rating: " + ex.getMessage());
    }
}