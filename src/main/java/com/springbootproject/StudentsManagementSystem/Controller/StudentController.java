package com.springbootproject.StudentsManagementSystem.Controller;
import com.springbootproject.StudentsManagementSystem.entity.Student;

import com.springbootproject.StudentsManagementSystem.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/students")
    public String getAllStudents(Model model){
        model.addAttribute("students", studentService.getAllStudent());
        return "students";
    }

    // ADD / UPDATE (same method)
    @PostMapping("/students/save")
    public String saveStudent(@ModelAttribute Student student){
        studentService.saveStudent(student);
        return "redirect:/students";
    }

    // SHOW UPDATE FORM
    @GetMapping("/students/edit/{id}")
    public String editStudent(@PathVariable Long id, Model model){
        Student student = studentService.getStudentById(id);
        model.addAttribute("student", student);
        return "update_student";
    }

    @GetMapping("/students/delete/{id}")
    public String deleteStudent(@PathVariable Long id){
        studentService.deleteStudent(id);
        return "redirect:/students";

    }
}
