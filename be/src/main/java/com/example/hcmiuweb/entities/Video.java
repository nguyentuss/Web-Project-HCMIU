package com.example.hcmiuweb.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "Video")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "video_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    private Integer duration; // in seconds

    @Column(nullable = false)
    private String url;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User uploader;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VideoRating> ratings = new HashSet<>();

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VideoTag> tags = new HashSet<>();

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    // Constructors
    public Video() {}

    public Video(String title, String description, LocalDateTime uploadDate, Integer duration, String url, User uploader, Category category) {
        this.title = title;
        this.description = description;
        this.uploadDate = uploadDate;
        this.duration = duration;
        this.url = url;
        this.uploader = uploader;
        this.category = category;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Integer getDuration() {
        return duration;
    }
    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }

    public User getUploader() {
        return uploader;
    }
    public void setUploader(User uploader) {
        this.uploader = uploader;
    }

    public Category getCategory() {
        return category;
    }
    public void setCategory(Category category) {
        this.category = category;
    }

    public Set<VideoRating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<VideoRating> ratings) {
        this.ratings = ratings;
    }

    // Add helper methods
    public void addRating(VideoRating rating) {
        ratings.add(rating);
        rating.setVideo(this);
    }

    public void removeRating(VideoRating rating) {
        ratings.remove(rating);
        rating.setVideo(null);
    }

    public void addTag(VideoTag tag) {
        tags.add(tag);
        tag.setVideo(this);
    }

    public void removeTag(VideoTag tag) {
        tags.remove(tag);
        tag.setVideo(null);
    }

    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setVideo(this);
    }

    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setVideo(null);
    }
}
