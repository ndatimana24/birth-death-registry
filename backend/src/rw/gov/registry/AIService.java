package rw.gov.registry;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class AIService {

    private static final String API_KEY = System.getenv("OPENAI_API_KEY") != null
        ? System.getenv("OPENAI_API_KEY")
        : "";

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    public static String genzura(Umuntu u) {
        if (API_KEY == null || API_KEY.isBlank()) {
            return "AI ntirahuza API key. Amakuru yabitswe neza.";
        }

        String prompt = String.format(
            "Genzura aya makuru y'umuntu wanditswe mu Rwanda muri make " +
            "mu Kinyarwanda gusa: Amazina: %s, Ubwoko: %s, Ababyeyi: %s, " +
            "Aho: %s. (1) Amakuru yuzuye? (2) Ikibazo? (3) Icyifuzo.",
            u.getAmazina(), u.getUbwoko(), u.getAbabyeyi(),
            "BIRTH".equals(u.getUbwoko()) ? u.getAhoYavukiye() : u.getAhoYapfiriye()
        );

        String json = "{"
            + "\"model\":\"gpt-4o-mini\","
            + "\"messages\":[{\"role\":\"user\",\"content\":\""
            + escapeJson(prompt) + "\"}]"
            + "}";

        try {
            HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + API_KEY)
                .timeout(Duration.ofSeconds(30))
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

            return extractContent(response.body());

        } catch (Exception e) {
            return "AI ikibazo: " + e.getMessage();
        }
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String extractContent(String responseBody) {
        try {
            int idx = responseBody.indexOf("\"content\"");
            if (idx == -1) return "AI ntisubije neza.";
            int start = responseBody.indexOf("\"", idx + 9) + 1;
            int end = start;
            while (end < responseBody.length()) {
                char c = responseBody.charAt(end);
                if (c == '\\') { end += 2; continue; }
                if (c == '"') break;
                end++;
            }
            String content = responseBody.substring(start, end);
            return content.replace("\\n", "\n").replace("\\\"", "\"");
        } catch (Exception e) {
            return "AI ntisubije neza.";
        }
    }
}