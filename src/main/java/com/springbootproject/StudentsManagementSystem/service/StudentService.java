package com.springbootproject.StudentsManagementSystem.service;

import com.springbootproject.StudentsManagementSystem.entity.Student;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StudentService {
    public List<Student> getAllStudent();
    void saveStudent(Student student);
    void deleteStudent(Long id);
    Student getStudentById(Long id);

}
