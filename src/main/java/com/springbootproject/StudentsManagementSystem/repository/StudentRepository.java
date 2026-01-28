package com.springbootproject.StudentsManagementSystem.repository;

import com.springbootproject.StudentsManagementSystem.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long> {
}
