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
    List<Video> findByTitleContainingIgnoreCase(String Title);    @Query("SELECT AVG(vr.rating) FROM VideoRating vr WHERE vr.video.id = :videoId")
    Optional<Double> findAverageRatingByVideoId(@Param("videoId") Long videoId);
    
    @Query("SELECT COUNT(vr) FROM VideoRating vr WHERE vr.video.id = :videoId")
    Integer countRatingsByVideoId(@Param("videoId") Long videoId);
      @Query(value = "SELECT v.video_id AS videoId, " +
            "v.title AS videoName, " +
            "(" +
            "  (CASE WHEN UPPER(v.title) LIKE CONCAT('%', UPPER(TRIM(SUBSTRING_INDEX(:query, ' ', 1))), '%') " +
            "        AND TRIM(SUBSTRING_INDEX(:query, ' ', 1)) != '' THEN 1 ELSE 0 END) + " +
            "  (CASE WHEN CHAR_LENGTH(:query) - CHAR_LENGTH(REPLACE(:query, ' ', '')) >= 1 " +
            "        AND UPPER(v.title) LIKE CONCAT('%', UPPER(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(:query, ' ', 2), ' ', -1))), '%') " +
            "        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(:query, ' ', 2), ' ', -1)) != '' THEN 1 ELSE 0 END) + " +
            "  (CASE WHEN CHAR_LENGTH(:query) - CHAR_LENGTH(REPLACE(:query, ' ', '')) >= 2 " +
            "        AND UPPER(v.title) LIKE CONCAT('%', UPPER(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(:query, ' ', 3), ' ', -1))), '%') " +
            "        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(:query, ' ', 3), ' ', -1)) != '' THEN 1 ELSE 0 END) + " +
            "  (CASE WHEN CHAR_LENGTH(:query) - CHAR_LENGTH(REPLACE(:query, ' ', '')) >= 3 " +
            "        AND UPPER(v.title) LIKE CONCAT('%', UPPER(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(:query, ' ', 4), ' ', -1))), '%') " +
            "        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(:query, ' ', 4), ' ', -1)) != '' THEN 1 ELSE 0 END) + " +
            "  (CASE WHEN CHAR_LENGTH(:query) - CHAR_LENGTH(REPLACE(:query, ' ', '')) >= 4 " +
            "        AND UPPER(v.title) LIKE CONCAT('%', UPPER(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(:query, ' ', 5), ' ', -1))), '%') " +
            "        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(:query, ' ', 5), ' ', -1)) != '' THEN 1 ELSE 0 END)" +
            ") AS similarWords " +
            "FROM video v " +
            "WHERE v.video_id != :videoId " +
            "HAVING similarWords > 0 " +
            "ORDER BY similarWords DESC, v.view_count DESC " +
            "LIMIT 10", nativeQuery = true)
    List<Object[]> findSimilarVideos(@Param("videoId") Long videoId, @Param("query") String query);

    
}
