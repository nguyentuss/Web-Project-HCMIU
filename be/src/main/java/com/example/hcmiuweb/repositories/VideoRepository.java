package com.example.hcmiuweb.repositories;

import com.example.hcmiuweb.entities.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByUploader_Id(Long uploaderId);
    List<Video> findByCategory_Id(Long categoryId);
    List<Video> findByTitleContainingIgnoreCase(String Title);

    @Query("SELECT AVG(vr.rating) FROM VideoRating vr WHERE vr.video.id = :videoId")
    Optional<Double> findAverageRatingByVideoId(@Param("videoId") Long videoId);

    @Query("SELECT COUNT(vr) FROM VideoRating vr WHERE vr.video.id = :videoId")
    Integer countRatingsByVideoId(@Param("videoId") Long videoId);    @Query("SELECT v FROM Video v " +
           "WHERE v.id != :videoId " +
           "AND LOWER(v.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY v.id DESC")
    List<Video> findSimilarVideos(@Param("videoId") Long videoId, @Param("query") String query);


}
