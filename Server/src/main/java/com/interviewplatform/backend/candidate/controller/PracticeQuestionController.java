package com.interviewplatform.backend.candidate.controller;

import com.interviewplatform.backend.candidate.dto.practice.PracticeQuestionDetailResponse;
import com.interviewplatform.backend.candidate.dto.practice.PracticeQuestionResponse;
import com.interviewplatform.backend.candidate.dto.practice.SubmissionResponse;
import com.interviewplatform.backend.candidate.service.PracticeQuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/practice")
public class PracticeQuestionController {

    // Service
    private final PracticeQuestionService practiceQuestionService;

    // Constructor
    public PracticeQuestionController(
            PracticeQuestionService practiceQuestionService
    ) {
        this.practiceQuestionService = practiceQuestionService;
    }

    // Get All Questions
    @GetMapping("/questions")
    public List<PracticeQuestionResponse> getPracticeQuestions(
            @RequestParam(required = false) String difficulty
    ) {
        return practiceQuestionService.getPracticeQuestions(difficulty);
    }

    // Get Question Details
    @GetMapping("/questions/{id}")
    public PracticeQuestionDetailResponse getQuestionById(
            @PathVariable String id
    ) {
        return practiceQuestionService.getQuestionById(id);
    }

    // Get Progress
    @GetMapping("/progress")
    public SubmissionResponse getPracticeProgress() {
        return practiceQuestionService.getPracticeProgress();
    }

}