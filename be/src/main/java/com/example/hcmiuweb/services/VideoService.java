package com.example.hcmiuweb.services;

import com.example.hcmiuweb.dtos.VideoDTO;
import com.example.hcmiuweb.entities.Video;
import com.example.hcmiuweb.repositories.VideoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VideoService {
    private final VideoRepository videoRepository;

    public VideoService(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @Transactional(readOnly = true)
    public List<VideoDTO> findAllVideosWithRatings() {
        return videoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<VideoDTO> findVideoByIdWithRating(Long id) {
        return videoRepository.findById(id)
                .map(this::convertToDTO);
    }

    // Original methods kept for compatibility
    public List<Video> findAllVideos() {
        return videoRepository.findAll();
    }

    public Optional<Video> findVideoById(Long id) {
        return videoRepository.findById(id);
    }

    public List<Video> findVideosByUploader(Long uploaderId) {
        return videoRepository.findByUploader_Id(uploaderId);
    }

    public List<Video> findVideosByCategory(Long categoryId) {
        return videoRepository.findByCategory_Id(categoryId);
    }

    public List<Video> searchVideosByTitle(String title) {
        return videoRepository.findByTitleContainingIgnoreCase(title);
    }

    @Transactional(readOnly = true)
    public List<VideoDTO> searchVideosByTitleWithRatings(String title) {
        return videoRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VideoDTO> findVideosByCategoryWithRatings(Long categoryId) {
        return videoRepository.findByCategory_Id(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Add this method to VideoService
    @Transactional(readOnly = true)
    public List<VideoDTO> findVideosByUploaderWithRatings(Long uploaderId) {
        return videoRepository.findByUploader_Id(uploaderId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Video createVideo(Video video) {
        if (video.getUploadDate() == null) {
            video.setUploadDate(LocalDateTime.now());
        }
        return videoRepository.save(video);
    }

    @Transactional
    public Video updateVideo(Video video) {
        // Find the existing video with all its associations
        return videoRepository.findById(video.getId())
                .map(existingVideo -> {
                    // Update standard fields
                    existingVideo.setTitle(video.getTitle());
                    existingVideo.setDescription(video.getDescription());
                    existingVideo.setUrl(video.getUrl());
                    existingVideo.setDuration(video.getDuration());
                    existingVideo.setThumbnailUrl(video.getThumbnailUrl()); // Added this line to update thumbnailUrl

                    // Preserve upload date if not provided
                    if (video.getUploadDate() != null) {
                        existingVideo.setUploadDate(video.getUploadDate());
                    }

                    // Update category if provided
                    if (video.getCategory() != null) {
                        existingVideo.setCategory(video.getCategory());
                    }

                    // Update uploader if provided
                    if (video.getUploader() != null) {
                        existingVideo.setUploader(video.getUploader());
                    }

                    // Don't modify ratings - they are preserved automatically

                    // Save the updated video
                    return videoRepository.save(existingVideo);
                })
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + video.getId()));
    }

    public void deleteVideo(Long id) {
        Optional<Video> videoOptional = videoRepository.findById(id);
        if (videoOptional.isPresent()) {
            Video video = videoOptional.get();

            // Log deletion attempt (using System.out since you don't have a logger configured)
            System.out.println("Deleting video with ID: " + id);

            // Delete the video (this relies on cascade settings in the Video entity)
            videoRepository.deleteById(id);

            System.out.println("Video with ID: " + id + " successfully deleted");
        } else {
            throw new RuntimeException("Video not found with id: " + id);
        }
    }

    // This should already be in your VideoService class
    private VideoDTO convertToDTO(Video video) {
        VideoDTO dto = new VideoDTO();
        dto.setId(video.getId());
        dto.setTitle(video.getTitle());
        dto.setDescription(video.getDescription());
        dto.setUploadDate(video.getUploadDate());
        dto.setDuration(video.getDuration());
        dto.setUrl(video.getUrl());
        dto.setThumbnailUrl(video.getThumbnailUrl()); // Added this line to include thumbnailUrl

        // Set uploader info
        if (video.getUploader() != null) {
            dto.setUploaderId(video.getUploader().getId());
            dto.setUploaderUsername(video.getUploader().getUsername());
        }

        // Set category info
        if (video.getCategory() != null) {
            dto.setCategoryId(video.getCategory().getId());
            dto.setCategoryName(video.getCategory().getName());
        }

        // Set rating info
        videoRepository.findAverageRatingByVideoId(video.getId())
                .ifPresent(dto::setAverageRating);

        dto.setRatingCount(videoRepository.countRatingsByVideoId(video.getId()));

        return dto;
    }
}