package com.example.hcmiuweb.controllers;

import com.example.hcmiuweb.dtos.WatchListDTO;
import com.example.hcmiuweb.dtos.VideoDTO;
import com.example.hcmiuweb.entities.User;
import com.example.hcmiuweb.entities.Video;
import com.example.hcmiuweb.entities.WatchList;
import com.example.hcmiuweb.payload.response.MessageResponse;
import com.example.hcmiuweb.services.UserDetailsImpl;
import com.example.hcmiuweb.services.UserService;
import com.example.hcmiuweb.services.VideoService;
import com.example.hcmiuweb.services.WatchListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/watchlist")
public class WatchListController {
    
    private final WatchListService watchListService;
    private final UserService userService;
    private final VideoService videoService;
    
    @Autowired
    public WatchListController(WatchListService watchListService, UserService userService, VideoService videoService) {
        this.watchListService = watchListService;
        this.userService = userService;
        this.videoService = videoService;
    }
      @GetMapping("/user/{userId}")
    @Transactional
    public ResponseEntity<?> getUserWatchList(@PathVariable Long userId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            // Check if the user is trying to access someone else's watch list
            if (!userId.equals(authenticatedUserId)) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Error: You can only access your own watch list"));
            }
            
            Optional<User> user = userService.findUserById(userId);
            if (user.isPresent()) {
                Optional<WatchList> watchList = watchListService.findWatchListByUser(user.get());
                if (watchList.isPresent()) {
                    return ResponseEntity.ok(convertToDTO(watchList.get()));
                } else {
                    return ResponseEntity.ok(new WatchListDTO(
                            null, 
                            user.get().getId(),
                            user.get().getUsername(),
                            null,
                            null,
                            0
                    ));
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/add/{videoId}")
    public ResponseEntity<?> addToWatchList(@PathVariable Long videoId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            Optional<User> user = userService.findUserById(authenticatedUserId);
            Optional<Video> video = videoService.findVideoById(videoId);
            
            if (user.isPresent() && video.isPresent()) {
                WatchList watchList = watchListService.addVideoToWatchList(user.get(), video.get());
                return ResponseEntity.ok(convertToDTO(watchList));
            } else {
                if (!user.isPresent()) {
                    return ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(new MessageResponse("Error: User not found"));
                } else {
                    return ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(new MessageResponse("Error: Video not found"));
                }
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{videoId}")
    public ResponseEntity<?> removeFromWatchList(@PathVariable Long videoId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            Optional<User> user = userService.findUserById(authenticatedUserId);
            Optional<Video> video = videoService.findVideoById(videoId);
            
            if (user.isPresent() && video.isPresent()) {
                WatchList watchList = watchListService.removeVideoFromWatchList(user.get(), video.get());
                if (watchList != null) {
                    return ResponseEntity.ok(convertToDTO(watchList));
                } else {
                    return ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(new MessageResponse("Error: Video not found in watch list"));
                }
            } else {
                if (!user.isPresent()) {
                    return ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(new MessageResponse("Error: User not found"));
                } else {
                    return ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(new MessageResponse("Error: Video not found"));
                }
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearWatchList() {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            Optional<User> user = userService.findUserById(authenticatedUserId);
            
            if (user.isPresent()) {
                watchListService.clearWatchList(user.get());
                return ResponseEntity.ok(new MessageResponse("Watch list cleared successfully"));
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Error: User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/check/{videoId}")
    public ResponseEntity<?> checkVideoInWatchList(@PathVariable Long videoId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            Optional<User> user = userService.findUserById(authenticatedUserId);
            Optional<Video> video = videoService.findVideoById(videoId);
            
            if (user.isPresent() && video.isPresent()) {
                boolean isInWatchList = watchListService.isVideoInWatchList(user.get(), video.get());
                return ResponseEntity.ok(Collections.singletonMap("inWatchList", isInWatchList));
            } else {
                if (!user.isPresent()) {
                    return ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(new MessageResponse("Error: User not found"));
                } else {
                    return ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(new MessageResponse("Error: Video not found"));
                }
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
      // Helper method to convert WatchList entity to WatchListDTO
    @Transactional
    private WatchListDTO convertToDTO(WatchList watchList) {
        WatchListDTO dto = new WatchListDTO(
                watchList.getId(),
                watchList.getUser().getId(),
                watchList.getUser().getUsername(),
                watchList.getCreatedAt(),
                watchList.getUpdatedAt(),
                watchList.getVideos().size() // This line accesses the videos collection
        );
        
        // Convert videos to DTOs
        List<VideoDTO> videoDTOs = watchList.getVideos().stream() // This line accesses the videos collection
                .map(video -> videoService.findVideoByIdWithRating(video.getId()).orElse(null))
                .filter(videoDTO -> videoDTO != null)
                .collect(Collectors.toList());
        
        dto.setVideos(videoDTOs);
        
        return dto;
    }
}
