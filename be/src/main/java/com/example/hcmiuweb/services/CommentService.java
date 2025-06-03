package com.example.hcmiuweb.services;

import com.example.hcmiuweb.entities.Comment;
import com.example.hcmiuweb.entities.Notification;
import com.example.hcmiuweb.entities.User;
import com.example.hcmiuweb.entities.Video;
import com.example.hcmiuweb.payload.request.CommentRequest;
import com.example.hcmiuweb.payload.response.CommentResponse;
import com.example.hcmiuweb.repositories.CommentRepository;
import com.example.hcmiuweb.repositories.UserRepository;
import com.example.hcmiuweb.repositories.VideoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final NotificationService notificationService;

    @Autowired
    public CommentService(
            CommentRepository commentRepository,
            UserRepository userRepository,
            VideoRepository videoRepository,
            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.notificationService = notificationService;
    }    
    @Transactional
    public CommentResponse addComment(CommentRequest commentRequest, Long currentUserId) {
        User user = userRepository.findById(commentRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + commentRequest.getUserId()));
        
        Video video = videoRepository.findById(commentRequest.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found with ID: " + commentRequest.getVideoId()));
        
        Comment parentComment = null;
        if (commentRequest.getParentCommentId() != null) {
            parentComment = commentRepository.findById(commentRequest.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found with ID: " + commentRequest.getParentCommentId()));
        }
        
        Comment comment = new Comment(
                commentRequest.getContent(),
                LocalDateTime.now(),
                video,
                user,
                parentComment
        );
        
        Comment savedComment = commentRepository.save(comment);
        
        // Add the comment to the video
        video.addComment(savedComment);
        
        // Create notification for the video uploader if they're not the commenter
        if (!user.getId().equals(video.getUploader().getId())) {
            String notificationType = parentComment == null ? "NEW_COMMENT" : "NEW_REPLY";
            String message = String.format(
                    "%s %s on your video: %s", 
                    user.getUsername(), 
                    parentComment == null ? "commented" : "replied to a comment",
                    video.getTitle()
            );
            
            notificationService.createNotification(
                    video.getUploader(),
                    notificationType,
                    message,
                    "/watch/" + video.getId(),
                    video
            );
        }
        
        // If this is a reply, also notify the parent comment author
        if (parentComment != null && !user.getId().equals(parentComment.getUser().getId())) {
            String message = String.format(
                    "%s replied to your comment on: %s", 
                    user.getUsername(),
                    video.getTitle()
            );
            
            notificationService.createNotification(
                    parentComment.getUser(),
                    "COMMENT_REPLY",
                    message,
                    "/watch/" + video.getId(),
                    video
            );
        }
        
        return new CommentResponse(savedComment, currentUserId);
    }
    
    @Transactional
    public List<CommentResponse> getAllComments(Long currentUserId) {
        // Get all top-level comments
        List<Comment> allComments = commentRepository.findAll();
        
        // Convert to DTOs
        return allComments.stream()
                .filter(comment -> comment.getParentComment() == null) // Only return top-level comments
                .map(comment -> new CommentResponse(comment, currentUserId))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<CommentResponse> getVideoComments(Long videoId, Long currentUserId) {
        // Get top-level comments (those without a parent)
        List<Comment> topLevelComments = commentRepository.findByVideo_IdAndParentCommentIsNull(videoId);
        
        // Convert to DTOs, which will recursively include replies
        return topLevelComments.stream()
                .map(comment -> new CommentResponse(comment, currentUserId))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<CommentResponse> getUserComments(Long userId, Long currentUserId) {
        // First, check if the user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        // Get all comments by this user
        List<Comment> userComments = commentRepository.findByUser_Id(userId);
        
        // Convert to DTOs
        return userComments.stream()
                .map(comment -> new CommentResponse(comment, currentUserId))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CommentResponse getCommentById(Long commentId, Long currentUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with ID: " + commentId));
        return new CommentResponse(comment, currentUserId);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with ID: " + commentId));
        
        // Check if the user is authorized to delete this comment
        if (!comment.getUser().getId().equals(userId) && 
            !comment.getVideo().getUploader().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this comment");
        }
        
        // Remove from parent if it's a reply
        if (comment.getParentComment() != null) {
            comment.getParentComment().getReplies().remove(comment);
        }
        
        // Remove from video
        comment.getVideo().removeComment(comment);
        
        // Delete the comment and its replies
        commentRepository.delete(comment);
    }
}