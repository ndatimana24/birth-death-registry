package rw.gov.registry;

import java.io.*;
import java.nio.file.*;
import java.util.*;

public class UserStorage {
    private static final String FILE_PATH = "data/users.json";
    private static List<User> users = new ArrayList<>();

    public static synchronized void load() {
        try {
            File file = new File(FILE_PATH);
            if (!file.exists()) {
                file.getParentFile().mkdirs();
                file.createNewFile();
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@registry.rw");
                admin.setPassword("admin123");
                admin.setRole("ADMIN");
                users.add(admin);
                save();
                System.out.println("[OK] Admin default: admin / admin123");
                return;
            }
            String content = new String(Files.readAllBytes(file.toPath()));
            users = parseJson(content);
            System.out.println("[OK] Users ziri muri file: " + users.size());
        } catch (IOException e) {
            System.err.println("[ERROR] " + e.getMessage());
        }
    }

    public static synchronized void save() {
        try {
            Files.write(Paths.get(FILE_PATH), toJson(users).getBytes());
        } catch (IOException e) {
            System.err.println("[ERROR] " + e.getMessage());
        }
    }

    public static synchronized List<User> findAll() {
        return new ArrayList<>(users);
    }

    public static synchronized Optional<User> findByUsername(String username) {
        return users.stream()
            .filter(u -> u.getUsername().equalsIgnoreCase(username))
            .findFirst();
    }

    public static synchronized Optional<User> findByEmail(String email) {
        return users.stream()
            .filter(u -> u.getEmail().equalsIgnoreCase(email))
            .findFirst();
    }

    public static synchronized Optional<User> findById(String id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public static synchronized User save(User user) {
        Optional<User> existing = findById(user.getId());
        if (existing.isPresent()) {
            int idx = users.indexOf(existing.get());
            users.set(idx, user);
        } else {
            users.add(user);
        }
        save();
        return user;
    }

    public static synchronized boolean delete(String id) {
        boolean removed = users.removeIf(u -> u.getId().equals(id));
        if (removed) save();
        return removed;
    }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String toJson(List<User> list) {
        StringBuilder sb = new StringBuilder("[\n");
        for (int i = 0; i < list.size(); i++) {
            User u = list.get(i);
            sb.append("  {\n");
            sb.append("    \"id\":\"").append(esc(u.getId())).append("\",\n");
            sb.append("    \"username\":\"").append(esc(u.getUsername())).append("\",\n");
            sb.append("    \"email\":\"").append(esc(u.getEmail())).append("\",\n");
            sb.append("    \"password\":\"").append(esc(u.getPassword())).append("\",\n");
            sb.append("    \"role\":\"").append(esc(u.getRole())).append("\"\n");
            sb.append("  }").append(i < list.size() - 1 ? "," : "").append("\n");
        }
        sb.append("]");
        return sb.toString();
    }

    private static List<User> parseJson(String content) {
        List<User> result = new ArrayList<>();
        content = content.trim();
        if (content.isEmpty() || content.equals("[]")) return result;

        content = content.substring(1, content.length() - 1).trim();
        if (content.isEmpty()) return result;

        String[] objects = content.split("\\},\\s*\\{");

        for (String obj : objects) {
            obj = obj.replace("{", "").replace("}", "").trim();
            User u = new User();
            List<String> pairs = splitPairs(obj);
            for (String pair : pairs) {
                String[] kv = pair.split(":", 2);
                if (kv.length < 2) continue;
                String key = kv[0].trim().replace("\"", "");
                String val = kv[1].trim().replaceAll("^\"|\"$", "");
                val = val.replace("\\\"", "\"").replace("\\n", "\n");

                switch (key) {
                    case "id": u.setId(val); break;
                    case "username": u.setUsername(val); break;
                    case "email": u.setEmail(val); break;
                    case "password": u.setPassword(val); break;
                    case "role": u.setRole(val); break;
                }
            }
            result.add(u);
        }
        return result;
    }

    private static List<String> splitPairs(String obj) {
        List<String> pairs = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        for (char c : obj.toCharArray()) {
            if (c == '"') inQuotes = !inQuotes;
            if (c == ',' && !inQuotes) {
                pairs.add(current.toString());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        if (current.length() > 0) pairs.add(current.toString());
        return pairs;
    }
}