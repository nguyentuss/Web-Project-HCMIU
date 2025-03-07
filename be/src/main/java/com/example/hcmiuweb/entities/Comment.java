package com.example.hcmiuweb.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime datePosted;

    @ManyToOne
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Self-referencing for replies (optional)
    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    // Optional: One-to-Many for replies
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL)
    private Set<Comment> replies;

    // Constructors
    public Comment() {}

    public Comment(String content, LocalDateTime datePosted, Video video, User user, Comment parentComment) {
        this.content = content;
        this.datePosted = datePosted;
        this.video = video;
        this.user = user;
        this.parentComment = parentComment;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getDatePosted() {
        return datePosted;
    }
    public void setDatePosted(LocalDateTime datePosted) {
        this.datePosted = datePosted;
    }

    public Video getVideo() {
        return video;
    }
    public void setVideo(Video video) {
        this.video = video;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Comment getParentComment() {
        return parentComment;
    }
    public void setParentComment(Comment parentComment) {
        this.parentComment = parentComment;
    }

    public Set<Comment> getReplies() {
        return replies;
    }
    public void setReplies(Set<Comment> replies) {
        this.replies = replies;
    }
}
