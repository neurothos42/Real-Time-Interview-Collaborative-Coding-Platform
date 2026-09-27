package com.interviewplatform.backend.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewplatform.backend.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtAndUserSecurityTest {

    private static final String TEST_SECRET = "TestSecuritySecretKeyForJwtSigningMustBeAtLeast256BitsLong!";

    @Test
    @DisplayName("JwtUtil correctly initializes from injected secret and signs/validates tokens")
    void testJwtUtilWithConfiguredSecret() {
        JwtUtil jwtUtil = new JwtUtil(TEST_SECRET);

        String email = "candidate@example.com";
        String role = "CANDIDATE";
        String userId = "user-123";
        String name = "Test Candidate";

        String token = jwtUtil.generateToken(email, role, userId, name);

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals(email, jwtUtil.extractEmail(token));
        assertEquals(role, jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("JwtUtil throws exception when secret is null or blank")
    void testJwtUtilMissingSecret() {
        assertThrows(IllegalArgumentException.class, () -> new JwtUtil(null));
        assertThrows(IllegalArgumentException.class, () -> new JwtUtil("   "));
    }

    @Test
    @DisplayName("User password field is write-only: never serialized to JSON")
    void testUserPasswordNotSerialized() throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        User user = new User();
        user.setId("usr-001");
        user.setName("Alice");
        user.setEmail("alice@example.com");
        user.setRole("CANDIDATE");
        user.setPassword("SuperSecretHashedBcryptPassword123");

        String json = mapper.writeValueAsString(user);

        assertFalse(json.contains("SuperSecretHashedBcryptPassword123"), "Password value must not be serialized");
        assertFalse(json.contains("\"password\""), "Password field key must not be present in JSON");
        assertTrue(json.contains("\"email\":\"alice@example.com\""));
    }

    @Test
    @DisplayName("User password field is write-only: correctly deserialized from incoming JSON")
    void testUserPasswordDeserialized() throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        String incomingJson = """
                {
                    "name": "Bob",
                    "email": "bob@example.com",
                    "password": "RawPasswordFromClientInput"
                }
                """;

        User user = mapper.readValue(incomingJson, User.class);

        assertEquals("Bob", user.getName());
        assertEquals("bob@example.com", user.getEmail());
        assertEquals("RawPasswordFromClientInput", user.getPassword(), "Password should be deserialized from request body");
    }
}
