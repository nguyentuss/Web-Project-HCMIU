package com.example.hcmiuweb.controllers;

import com.example.hcmiuweb.dtos.VideoDTO;
import com.example.hcmiuweb.entities.Category;
import com.example.hcmiuweb.entities.User;
import com.example.hcmiuweb.entities.Video;
import com.example.hcmiuweb.services.CategoryService;
import com.example.hcmiuweb.services.UserService;
import com.example.hcmiuweb.services.VideoService;
import com.example.hcmiuweb.services.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;
    private final CategoryService categoryService;
    private final UserService userService;

    public VideoController(VideoService videoService, CategoryService categoryService, UserService userService) {
        this.videoService = videoService;
        this.categoryService = categoryService;
        this.userService = userService;
    }

    @GetMapping
    public List<VideoDTO> getAllVideos() {
        return videoService.findAllVideosWithRatings();
    }        @GetMapping("/{id}")
    public ResponseEntity<VideoDTO> getVideoById(@PathVariable Long id) {
        return videoService.findVideoByIdWithRating(id)
                .map(videoDTO -> {
                    try {
                        // Increment the view count after finding the video
                        VideoDTO updatedVideo = videoService.incrementViewCount(id);
                        return ResponseEntity.ok(updatedVideo);
                    } catch (Exception e) {
                        e.printStackTrace(); // Log the exception
                        // Return the original video if view count increment fails
                        return ResponseEntity.ok(videoDTO);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/uploader/{uploaderId}")
    public List<VideoDTO> getVideosByUploader(@PathVariable Long uploaderId) {
        return videoService.findVideosByUploaderWithRatings(uploaderId);
    }

    @GetMapping("/category/{categoryId}")
    public List<VideoDTO> getVideosByCategory(@PathVariable Long categoryId) {
        return videoService.findVideosByCategoryWithRatings(categoryId);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchVideos(@RequestParam(required = false) String title) {
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Search title parameter is required");
        }
        
        List<VideoDTO> videos = videoService.searchVideosByTitleWithRatings(title);
        return ResponseEntity.ok(videos);
    }

    @PostMapping
    public ResponseEntity<?> createVideo(@RequestBody Map<String, Object> videoRequest) {
        try {
            // Get the currently authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            // Extract userId from the request (if provided)
            Long requestedUserId = null;
            if (videoRequest.get("userId") != null) {
                requestedUserId = Long.valueOf(videoRequest.get("userId").toString());
            } else {
                // If no userId provided, default to authenticated user
                requestedUserId = authenticatedUserId;
            }
            
            // Check if user is trying to create a video for another user
            if (!requestedUserId.equals(authenticatedUserId)) {
                // Check if user has admin role and moderator
                boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
                
                if (!isAdmin) {
                    // Regular users can only create videos for themselves
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("You are not allowed to create a video for another user");
                }
                // Admins and moderators can proceed to create videos for other users
            }
            
            // Get the user for whom we're creating the video
            User uploader = userService.findUserById(requestedUserId)
                    .orElse(null);
            
            if (uploader == null) {
                return ResponseEntity.badRequest()
                        .body("User with ID " + requestedUserId + " does not exist");
            }
            
            // Extract categoryId from the request
            Long categoryId = null;
            if (videoRequest.get("categoryId") != null) {
                categoryId = Long.valueOf(videoRequest.get("categoryId").toString());
            }
            
            // Verify category exists
            if (categoryId == null) {
                return ResponseEntity.badRequest()
                        .body("Category must be specified");
            }
            
            Category category = categoryService.findCategoryById(categoryId)
                    .orElse(null);
            
            if (category == null) {
                return ResponseEntity.badRequest()
                        .body("Category with ID " + categoryId + " does not exist");
            }
            
            // Create video object from request
            Video video = new Video();
            video.setTitle((String) videoRequest.get("title"));
            video.setDescription((String) videoRequest.get("description"));
            video.setUrl((String) videoRequest.get("url"));
            video.setThumbnailUrl((String) videoRequest.get("thumbnailUrl"));
            video.setUploadDate(LocalDateTime.now());
            video.setUploader(uploader);
            video.setCategory(category);
            
            // Save video
            Video savedVideo = videoService.createVideo(video);

            // Return the DTO with rating info
            VideoDTO videoDTO = videoService.findVideoByIdWithRating(savedVideo.getId())
                    .orElseThrow(() -> new RuntimeException("Could not retrieve saved video"));

            return ResponseEntity.ok(videoDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing video request: " + e.getMessage());
        }
    }    @PutMapping("/{id}")
    public ResponseEntity<?> updateVideo(@PathVariable Long id, @RequestBody Map<String, Object> videoRequest) {
        try {
            // Get the currently authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            // Find the existing video
            Optional<Video> existingVideoOpt = videoService.findVideoById(id);
            if (existingVideoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Video existingVideo = existingVideoOpt.get();
            
            // Check if user is trying to update a video for another user
            if (!existingVideo.getUploader().getId().equals(authenticatedUserId)) {
                // Check if user has admin role
                boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
                
                if (!isAdmin) {
                    // Regular users can only update their own videos
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("You are not allowed to update another user's video");
                }
                // Admins can proceed to update videos for other users
            }
            
            // Create updated video object
            Video updatedVideo = new Video();
            updatedVideo.setId(id);
            updatedVideo.setTitle((String) videoRequest.get("title"));
            updatedVideo.setDescription((String) videoRequest.get("description"));
            updatedVideo.setUrl((String) videoRequest.get("url"));
            updatedVideo.setThumbnailUrl((String) videoRequest.get("thumbnailUrl"));
            
            // Handle duration if provided
            if (videoRequest.get("duration") != null) {
                updatedVideo.setDuration(Integer.valueOf(videoRequest.get("duration").toString()));
            }
            
            // Preserve existing uploader
            updatedVideo.setUploader(existingVideo.getUploader());
            
            // Handle category update if provided
            if (videoRequest.get("categoryId") != null) {
                Long categoryId = Long.valueOf(videoRequest.get("categoryId").toString());
                Category category = categoryService.findCategoryById(categoryId)
                        .orElse(null);
                
                if (category == null) {
                    return ResponseEntity.badRequest()
                            .body("Category with ID " + categoryId + " does not exist");
                }
                updatedVideo.setCategory(category);
            } else {
                // Preserve existing category
                updatedVideo.setCategory(existingVideo.getCategory());
            }
            
            // Preserve upload date and view count
            updatedVideo.setUploadDate(existingVideo.getUploadDate());
            updatedVideo.setViewCount(existingVideo.getViewCount());
            
            // Save updated video
            Video savedVideo = videoService.updateVideo(updatedVideo);

            // Return the DTO with rating info
            VideoDTO videoDTO = videoService.findVideoByIdWithRating(savedVideo.getId())
                    .orElseThrow(() -> new RuntimeException("Could not retrieve updated video"));

            return ResponseEntity.ok(videoDTO);        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating video: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        try {
            // Get the currently authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            // Find the existing video
            Optional<Video> existingVideoOpt = videoService.findVideoById(id);
            if (existingVideoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Video existingVideo = existingVideoOpt.get();
            
            // Check if user is trying to delete a video for another user
            if (!existingVideo.getUploader().getId().equals(authenticatedUserId)) {
                // Check if user has admin role
                boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
                
                if (!isAdmin) {
                    // Regular users can only delete their own videos
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("You are not allowed to delete another user's video");
                }
                // Admins can proceed to delete videos for other users
            }
            
            // Delete the video
            videoService.deleteVideo(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting video: " + e.getMessage());
        }
    }
    
    @PostMapping("/{id}/view")
    public ResponseEntity<VideoDTO> viewVideo(@PathVariable Long id) {
        try {
            VideoDTO videoDTO = videoService.incrementViewCount(id);
            return ResponseEntity.ok(videoDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<List<VideoDTO>> getSimilarVideos(@PathVariable Long id) {
        try {
            List<VideoDTO> similarVideos = videoService.findSimilarVideos(id);
            return ResponseEntity.ok(similarVideos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing video request: " + e.getMessage());
    }
}