package com.example.hcmiuweb.controllers;

import com.example.hcmiuweb.payload.request.CommentRequest;
import com.example.hcmiuweb.payload.response.CommentResponse;
import com.example.hcmiuweb.payload.response.MessageResponse;
import com.example.hcmiuweb.services.CommentService;
import com.example.hcmiuweb.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    
    private final CommentService commentService;
    
    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    
    @PostMapping
    public ResponseEntity<?> addComment(@Valid @RequestBody CommentRequest commentRequest) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            // Check if the userId in the request matches the authenticated user's ID
            if (commentRequest.getUserId() != null && !commentRequest.getUserId().equals(authenticatedUserId)) {
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: You can only comment with your own user ID"));
            }
            
            // Set the userId in the request to the authenticated user's ID
            commentRequest.setUserId(authenticatedUserId);
            
            CommentResponse newComment = commentService.addComment(commentRequest, authenticatedUserId);
            return new ResponseEntity<>(newComment, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    @GetMapping
    public ResponseEntity<?> getAllComments() {
        try {
            // Get the authenticated user (optional for this endpoint)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long currentUserId = null;
            if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                currentUserId = userDetails.getId();
            }
            
            List<CommentResponse> comments = commentService.getAllComments(currentUserId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/video/{videoId}")
    public ResponseEntity<?> getVideoComments(@PathVariable Long videoId) {
        try {
            // Get the authenticated user (optional for this endpoint)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long currentUserId = null;
            if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                currentUserId = userDetails.getId();
            }
            
            List<CommentResponse> comments = commentService.getVideoComments(videoId, currentUserId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserComments(@PathVariable Long userId) {
        try {
            // Get the authenticated user (optional for this endpoint)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long currentUserId = null;
            if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                currentUserId = userDetails.getId();
            }
            
            List<CommentResponse> comments = commentService.getUserComments(userId, currentUserId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{commentId}")
    public ResponseEntity<?> getCommentById(@PathVariable Long commentId) {
        try {
            // Get the authenticated user (optional for this endpoint)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long currentUserId = null;
            if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                currentUserId = userDetails.getId();
            }
            
            CommentResponse comment = commentService.getCommentById(commentId, currentUserId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long authenticatedUserId = userDetails.getId();
            
            commentService.deleteComment(commentId, authenticatedUserId);
            return ResponseEntity.ok(new MessageResponse("Comment deleted successfully!"));
        } catch (Exception e) {
            if (e.getMessage().contains("Not authorized")) {
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: " + e.getMessage()));
            } else if (e.getMessage().contains("not found")) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: " + e.getMessage()));
            } else {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
            }
        }
    }
}