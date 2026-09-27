package com.interviewplatform.backend.candidate.controller;

import com.interviewplatform.backend.candidate.dto.codeeditor.RunCodeRequest;
import com.interviewplatform.backend.candidate.dto.codeeditor.RunCodeResponse;
import com.interviewplatform.backend.candidate.dto.codeeditor.StarterCodeResponse;
import com.interviewplatform.backend.candidate.dto.codeeditor.SubmitCodeResponse;
import com.interviewplatform.backend.candidate.dto.codeeditor.TestCaseResponse;
import com.interviewplatform.backend.candidate.dto.practice.PracticeQuestionDetailResponse;
import com.interviewplatform.backend.candidate.dto.practice.SubmitCodeRequest;
import com.interviewplatform.backend.candidate.service.PracticeQuestionService;
import com.interviewplatform.backend.candidate.service.RunCodeService;
import com.interviewplatform.backend.candidate.service.SubmitCodeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/code-editor")
public class CodeEditorController {

    // Services
    private final PracticeQuestionService practiceQuestionService;
    private final RunCodeService runCodeService;
    private final SubmitCodeService submitCodeService;

    // Constructor
    public CodeEditorController(
            PracticeQuestionService practiceQuestionService,
            RunCodeService runCodeService,
            SubmitCodeService submitCodeService
    ) {
        this.practiceQuestionService = practiceQuestionService;
        this.runCodeService = runCodeService;
        this.submitCodeService = submitCodeService;
    }

    // Get Question
    @GetMapping("/questions/{id}")
    public PracticeQuestionDetailResponse getQuestion(
            @PathVariable String id
    ) {
        return practiceQuestionService.getQuestionById(id);
    }

    // Get Starter Code
    @GetMapping("/questions/{id}/starter-code")
    public StarterCodeResponse getStarterCode(
            @PathVariable String id,
            @RequestParam(defaultValue = "java") String language
    ) {
        return practiceQuestionService.getStarterCode(id, language);
    }

    // Get Test Cases
    @GetMapping("/questions/{id}/testcases")
    public List<TestCaseResponse> getTestCases(
            @PathVariable String id
    ) {
        return practiceQuestionService.getTestCases(id);
    }

    // Run Code
    @PostMapping("/run")
    public RunCodeResponse runCode(
            @RequestBody RunCodeRequest request
    ) {
        return runCodeService.executeCode(request);
    }

    // Submit Code
    @PostMapping("/questions/{id}/submit")
    public SubmitCodeResponse submitCode(
            @PathVariable String id,
            @RequestBody SubmitCodeRequest request
    ) {
        return submitCodeService.submitCode(id, request);
    }

    // Test Endpoint
    @GetMapping("/test-online-compiler")
    public String testOnlineCompiler() {
        return "TEMP";
    }
}