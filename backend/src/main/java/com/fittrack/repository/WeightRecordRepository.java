package com.fittrack.repository;

import com.fittrack.model.WeightRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeightRecordRepository extends JpaRepository<WeightRecord, Long> {

    List<WeightRecord> findAllByOrderByRecordDateDescIdDesc();

    Optional<WeightRecord> findFirstByOrderByRecordDateDescIdDesc();

    List<WeightRecord> findTop7ByOrderByRecordDateDescIdDesc();
}
