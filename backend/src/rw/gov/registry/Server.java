package rw.gov.registry;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class Server {

    public static void main(String[] args) throws IOException {
        Storage.load();
        UserStorage.load();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/registry/all", Server::handleAll);
        server.createContext("/api/registry/birth", Server::handleBirth);
        server.createContext("/api/registry/death", Server::handleDeath);
        server.createContext("/api/registry/", Server::handleById);

        server.createContext("/api/auth/signup", Server::handleSignup);
        server.createContext("/api/auth/login", Server::handleLogin);
        server.createContext("/api/auth/users", Server::handleUsers);
        server.createContext("/api/auth/users/", Server::handleUserById);

        server.setExecutor(null);
        server.start();
        System.out.println("===========================================");
        System.out.println("  Server ikora kuri: http://localhost:8080");
        System.out.println("  Amakuru abikwa:   backend/data/");
        System.out.println("===========================================");
    }

    // ========== REGISTRY ==========

    private static void handleAll(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { sendOptions(ex); return; }
        if ("GET".equals(ex.getRequestMethod())) {
            sendJson(ex, 200, listToJson(Storage.findAll()));
        } else {
            sendJson(ex, 405, "{\"error\":\"Method not allowed\"}");
        }
    }

    private static void handleBirth(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { sendOptions(ex); return; }
        if ("POST".equals(ex.getRequestMethod())) {
            String body = readBody(ex);
            Umuntu u = parseUmuntu(body);
            u.setUbwoko("BIRTH");
            if (u.getItarikiYavukiye() == null || u.getItarikiYavukiye().isEmpty()) {
                u.setItarikiYavukiye(LocalDate.now().toString());
            }
            u.setAiIcyifuzo(SimpleAI.genzura(u));
            Storage.save(u);
            System.out.println("[BIRTH] " + u.getAmazina());
            sendJson(ex, 200, umuntuToJson(u));
        } else if ("GET".equals(ex.getRequestMethod())) {
            sendJson(ex, 200, listToJson(Storage.findByUbwoko("BIRTH")));
        } else {
            sendJson(ex, 405, "{\"error\":\"Method not allowed\"}");
        }
    }

    private static void handleDeath(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { sendOptions(ex); return; }
        if ("POST".equals(ex.getRequestMethod())) {
            String body = readBody(ex);
            Umuntu u = parseUmuntu(body);
            u.setUbwoko("DEATH");
            if (u.getItarikiYapfiriye() == null || u.getItarikiYapfiriye().isEmpty()) {
                u.setItarikiYapfiriye(LocalDate.now().toString());
            }
            u.setAiIcyifuzo(SimpleAI.genzura(u));
            Storage.save(u);
            System.out.println("[DEATH] " + u.getAmazina());
            sendJson(ex, 200, umuntuToJson(u));
        } else if ("GET".equals(ex.getRequestMethod())) {
            sendJson(ex, 200, listToJson(Storage.findByUbwoko("DEATH")));
        } else {
            sendJson(ex, 405, "{\"error\":\"Method not allowed\"}");
        }
    }

    private static void handleById(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { sendOptions(ex); return; }
        String path = ex.getRequestURI().getPath();
        String id = path.substring("/api/registry/".length());
        if (id.isEmpty()) { sendJson(ex, 404, "{\"error\":\"Not found\"}"); return; }

        if ("GET".equals(ex.getRequestMethod())) {
            Optional<Umuntu> u = Storage.findById(id);
            if (u.isPresent()) sendJson(ex, 200, umuntuToJson(u.get()));
            else sendJson(ex, 404, "{\"error\":\"Ntabashije kubona\"}");
        } else if ("PUT".equals(ex.getRequestMethod())) {
            Optional<Umuntu> existing = Storage.findById(id);
            if (existing.isEmpty()) {
                sendJson(ex, 404, "{\"error\":\"Ntabashije kubona\"}");
                return;
            }
            String body = readBody(ex);
            Umuntu updated = parseUmuntu(body);
            updated.setId(id);
            updated.setUbwoko(existing.get().getUbwoko());
            if (updated.getItarikiYavukiye() == null || updated.getItarikiYavukiye().isEmpty()) {
                updated.setItarikiYavukiye(existing.get().getItarikiYavukiye());
            }
            if (updated.getItarikiYapfiriye() == null || updated.getItarikiYapfiriye().isEmpty()) {
                updated.setItarikiYapfiriye(existing.get().getItarikiYapfiriye());
            }
            // Ongera igenzura na AI nyuma yo guhindura
            updated.setAiIcyifuzo(SimpleAI.genzura(updated));
            Storage.save(updated);
            System.out.println("[UPDATE] " + updated.getAmazina());
            sendJson(ex, 200, umuntuToJson(updated));
        } else if ("DELETE".equals(ex.getRequestMethod())) {
            if (Storage.delete(id)) sendJson(ex, 200, "{\"ok\":true}");
            else sendJson(ex, 404, "{\"error\":\"Ntabashije kubona\"}");
        } else {
            sendJson(ex, 405, "{\"error\":\"Method not allowed\"}");
        }
    }

    // ========== AUTH ==========

    private static void handleSignup(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { sendOptions(ex); return; }
        if (!"POST".equals(ex.getRequestMethod())) {
            sendJson(ex, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }
        String body = readBody(ex);
        String username = extractValue(body, "username");
        String email = extractValue(body, "email");
        String password = extractValue(body, "password");
        String role = extractValue(body, "role");

        if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
            sendJson(ex, 400, "{\"error\":\"Amakuru yose arakenewe\"}");
            return;
        }
        if (UserStorage.findByUsername(username).isPresent()) {
            sendJson(ex, 400, "{\"error\":\"Username isanzwe ikoreshwa\"}");
            return;
        }
        if (UserStorage.findByEmail(email).isPresent()) {
            sendJson(ex, 400, "{\"error\":\"Email isanzwe ikoreshwa\"}");
            return;
        }
        if (role == null || role.isEmpty() ||
            (!role.equals("USER") && !role.equals("ADMIN"))) {
            role = "USER";
        }

        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(password);
        u.setRole(role);
        UserStorage.save(u);
        System.out.println("[SIGNUP] " + username + " (" + role + ")");
        sendJson(ex, 200, "{"
            + "\"id\":\"" + esc(u.getId()) + "\","
            + "\"username\":\"" + esc(u.getUsername()) + "\","
            + "\"email\":\"" + esc(u.getEmail()) + "\","
            + "\"role\":\"" + esc(u.getRole()) + "\""
            + "}");
    }

    private static void handleLogin(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { sendOptions(ex); return; }
        if (!"POST".equals(ex.getRequestMethod())) {
            sendJson(ex, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }
        String body = readBody(ex);
        String username = extractValue(body, "username");
        String password = extractValue(body, "password");

        Optional<User> userOpt = UserStorage.findByUsername(username);
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            sendJson(ex, 401, "{\"error\":\"Username cyangwa password ntibyemewe\"}");
            return;
        }
        User u = userOpt.get();
        System.out.println("[LOGIN] " + username);
        sendJson(ex, 200, "{"
            + "\"id\":\"" + esc(u.getId()) + "\","
            + "\"username\":\"" + esc(u.getUsername()) + "\","
            + "\"email\":\"" + esc(u.getEmail()) + "\","
            + "\"role\":\"" + esc(u.getRole()) + "\""
            + "}");
    }

    private static void handleUsers(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { sendOptions(ex); return; }
        if ("GET".equals(ex.getRequestMethod())) {
            List<User> users = UserStorage.findAll();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < users.size(); i++) {
                User u = users.get(i);
                sb.append("{")
                  .append("\"id\":\"").append(esc(u.getId())).append("\",")
                  .append("\"username\":\"").append(esc(u.getUsername())).append("\",")
                  .append("\"email\":\"").append(esc(u.getEmail())).append("\",")
                  .append("\"role\":\"").append(esc(u.getRole())).append("\"")
                  .append("}");
                if (i < users.size() - 1) sb.append(",");
            }
            sb.append("]");
            sendJson(ex, 200, sb.toString());
        } else {
            sendJson(ex, 405, "{\"error\":\"Method not allowed\"}");
        }
    }

    private static void handleUserById(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) { sendOptions(ex); return; }
        String path = ex.getRequestURI().getPath();
        String id = path.substring("/api/auth/users/".length());
        if ("DELETE".equals(ex.getRequestMethod())) {
            if (UserStorage.delete(id)) sendJson(ex, 200, "{\"ok\":true}");
            else sendJson(ex, 404, "{\"error\":\"Ntabashije kubona\"}");
        } else {
            sendJson(ex, 405, "{\"error\":\"Method not allowed\"}");
        }
    }

    // ========== HELPERS ==========

    private static void addCors(HttpExchange ex) {
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
        ex.getResponseHeaders().set("Access-Control-Max-Age", "86400");
    }

    private static void sendOptions(HttpExchange ex) throws IOException {
        ex.sendResponseHeaders(204, -1);
        ex.close();
    }

    private static String readBody(HttpExchange ex) throws IOException {
        return new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
    }

    private static void sendJson(HttpExchange ex, int code, String json) throws IOException {
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        ex.sendResponseHeaders(code, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static Umuntu parseUmuntu(String json) {
        Umuntu u = new Umuntu();
        json = json.trim();
        if (json.startsWith("{")) json = json.substring(1);
        if (json.endsWith("}")) json = json.substring(0, json.length() - 1);
        String[] pairs = json.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
        for (String pair : pairs) {
            String[] kv = pair.split(":", 2);
            if (kv.length < 2) continue;
            String key = kv[0].trim().replace("\"", "");
            String val = kv[1].trim().replaceAll("^\"|\"$", "");
            val = val.replace("\\\"", "\"").replace("\\n", "\n");
            switch (key) {
                case "amazina": u.setAmazina(val); break;
                case "indangamuntu": u.setIndangamuntu(val); break;
                case "ababyeyi": u.setAbabyeyi(val); break;
                case "ahoYavukiye": u.setAhoYavukiye(val); break;
                case "ahoYapfiriye": u.setAhoYapfiriye(val); break;
                case "impamvuYurupfu": u.setImpamvuYurupfu(val); break;
                case "itarikiYavukiye": u.setItarikiYavukiye(val); break;
                case "itarikiYapfiriye": u.setItarikiYapfiriye(val); break;
                case "numeroYIvuko": u.setNumeroYIvuko(val); break;
                case "igitsina": u.setDigitsina(val); break;
                case "mamaAmazina": u.setMamaAmazina(val); break;
                case "mamaIndangamuntu": u.setMamaIndangamuntu(val); break;
                case "mamaTelefone": u.setMamaTelefone(val); break;
                case "yasezeranye": u.setYasezeranye(val); break;
                case "papaAmazina": u.setPapaAmazina(val); break;
                case "papaIndangamuntu": u.setPapaIndangamuntu(val); break;
                case "papaTelefone": u.setPapaTelefone(val); break;
                case "akarere": u.setAkarere(val); break;
                case "umurenge": u.setUmurenge(val); break;
                case "akagari": u.setAkagari(val); break;
                case "umudugudu": u.setUmudugudu(val); break;
                case "witness1Amazina": u.setWitness1Amazina(val); break;
                case "witness1Indangamuntu": u.setWitness1Indangamuntu(val); break;
                case "witness1Telefone": u.setWitness1Telefone(val); break;
                case "witness2Amazina": u.setWitness2Amazina(val); break;
                case "witness2Indangamuntu": u.setWitness2Indangamuntu(val); break;
                case "witness2Telefone": u.setWitness2Telefone(val); break;
                case "deathWitness1Amazina": u.setDeathWitness1Amazina(val); break;
                case "deathWitness1Indangamuntu": u.setDeathWitness1Indangamuntu(val); break;
                case "deathWitness1Telefone": u.setDeathWitness1Telefone(val); break;
                case "deathWitness2Amazina": u.setDeathWitness2Amazina(val); break;
                case "deathWitness2Indangamuntu": u.setDeathWitness2Indangamuntu(val); break;
                case "deathWitness2Telefone": u.setDeathWitness2Telefone(val); break;
            }
        }
        return u;
    }

    private static String extractValue(String json, String key) {
        try {
            String pattern = "\"" + key + "\"";
            int idx = json.indexOf(pattern);
            if (idx == -1) return "";
            int colon = json.indexOf(":", idx);
            int start = json.indexOf("\"", colon) + 1;
            int end = start;
            while (end < json.length()) {
                char c = json.charAt(end);
                if (c == '\\') { end += 2; continue; }
                if (c == '"') break;
                end++;
            }
            return json.substring(start, end);
        } catch (Exception e) {
            return "";
        }
    }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String umuntuToJson(Umuntu u) {
        return "{"
            + "\"id\":\"" + esc(u.getId()) + "\","
            + "\"amazina\":\"" + esc(u.getAmazina()) + "\","
            + "\"indangamuntu\":\"" + esc(u.getIndangamuntu()) + "\","
            + "\"ababyeyi\":\"" + esc(u.getAbabyeyi()) + "\","
            + "\"ahoYavukiye\":\"" + esc(u.getAhoYavukiye()) + "\","
            + "\"ahoYapfiriye\":\"" + esc(u.getAhoYapfiriye()) + "\","
            + "\"impamvuYurupfu\":\"" + esc(u.getImpamvuYurupfu()) + "\","
            + "\"itarikiYavukiye\":\"" + esc(u.getItarikiYavukiye()) + "\","
            + "\"itarikiYapfiriye\":\"" + esc(u.getItarikiYapfiriye()) + "\","
            + "\"ubwoko\":\"" + esc(u.getUbwoko()) + "\","
            + "\"aiIcyifuzo\":\"" + esc(u.getAiIcyifuzo()) + "\","
            + "\"numeroYIvuko\":\"" + esc(u.getNumeroYIvuko()) + "\","
            + "\"igitsina\":\"" + esc(u.getDigitsina()) + "\","
            + "\"mamaAmazina\":\"" + esc(u.getMamaAmazina()) + "\","
            + "\"mamaIndangamuntu\":\"" + esc(u.getMamaIndangamuntu()) + "\","
            + "\"mamaTelefone\":\"" + esc(u.getMamaTelefone()) + "\","
            + "\"yasezeranye\":\"" + esc(u.getYasezeranye()) + "\","
            + "\"papaAmazina\":\"" + esc(u.getPapaAmazina()) + "\","
            + "\"papaIndangamuntu\":\"" + esc(u.getPapaIndangamuntu()) + "\","
            + "\"papaTelefone\":\"" + esc(u.getPapaTelefone()) + "\","
            + "\"akarere\":\"" + esc(u.getAkarere()) + "\","
            + "\"umurenge\":\"" + esc(u.getUmurenge()) + "\","
            + "\"akagari\":\"" + esc(u.getAkagari()) + "\","
            + "\"umudugudu\":\"" + esc(u.getUmudugudu()) + "\","
            + "\"witness1Amazina\":\"" + esc(u.getWitness1Amazina()) + "\","
            + "\"witness1Indangamuntu\":\"" + esc(u.getWitness1Indangamuntu()) + "\","
            + "\"witness1Telefone\":\"" + esc(u.getWitness1Telefone()) + "\","
            + "\"witness2Amazina\":\"" + esc(u.getWitness2Amazina()) + "\","
            + "\"witness2Indangamuntu\":\"" + esc(u.getWitness2Indangamuntu()) + "\","
            + "\"witness2Telefone\":\"" + esc(u.getWitness2Telefone()) + "\","
            + "\"deathWitness1Amazina\":\"" + esc(u.getDeathWitness1Amazina()) + "\","
            + "\"deathWitness1Indangamuntu\":\"" + esc(u.getDeathWitness1Indangamuntu()) + "\","
            + "\"deathWitness1Telefone\":\"" + esc(u.getDeathWitness1Telefone()) + "\","
            + "\"deathWitness2Amazina\":\"" + esc(u.getDeathWitness2Amazina()) + "\","
            + "\"deathWitness2Indangamuntu\":\"" + esc(u.getDeathWitness2Indangamuntu()) + "\","
            + "\"deathWitness2Telefone\":\"" + esc(u.getDeathWitness2Telefone()) + "\""
            + "}";
    }

    private static String listToJson(List<Umuntu> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append(umuntuToJson(list.get(i)));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}