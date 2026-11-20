package rw.gov.registry;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

public class Storage {
    private static final String FILE_PATH = "data/abantu.json";
    private static List<Umuntu> abantu = new ArrayList<>();

    public static synchronized void load() {
        try {
            File file = new File(FILE_PATH);
            if (!file.exists()) {
                file.getParentFile().mkdirs();
                file.createNewFile();
                return;
            }
            String content = new String(Files.readAllBytes(file.toPath()));
            abantu = parseJson(content);
            System.out.println("[OK] Records ziri muri file: " + abantu.size());
        } catch (IOException e) {
            System.err.println("[ERROR] " + e.getMessage());
        }
    }

    public static synchronized void save() {
        try {
            Files.write(Paths.get(FILE_PATH), toJson(abantu).getBytes());
        } catch (IOException e) {
            System.err.println("[ERROR] " + e.getMessage());
        }
    }

    public static synchronized List<Umuntu> findAll() {
        return new ArrayList<>(abantu);
    }

    public static synchronized List<Umuntu> findByUbwoko(String ubwoko) {
        return abantu.stream()
            .filter(u -> ubwoko.equals(u.getUbwoko()))
            .collect(Collectors.toList());
    }

    public static synchronized Optional<Umuntu> findById(String id) {
        return abantu.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public static synchronized Umuntu save(Umuntu umuntu) {
        Optional<Umuntu> existing = findById(umuntu.getId());
        if (existing.isPresent()) {
            int idx = abantu.indexOf(existing.get());
            abantu.set(idx, umuntu);
        } else {
            abantu.add(umuntu);
        }
        save();
        return umuntu;
    }

    public static synchronized boolean delete(String id) {
        boolean removed = abantu.removeIf(u -> u.getId().equals(id));
        if (removed) save();
        return removed;
    }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String toJson(List<Umuntu> list) {
        StringBuilder sb = new StringBuilder("[\n");
        for (int i = 0; i < list.size(); i++) {
            Umuntu u = list.get(i);
            sb.append("  {\n");
            sb.append("    \"id\":\"").append(esc(u.getId())).append("\",\n");
            sb.append("    \"amazina\":\"").append(esc(u.getAmazina())).append("\",\n");
            sb.append("    \"indangamuntu\":\"").append(esc(u.getIndangamuntu())).append("\",\n");
            sb.append("    \"ababyeyi\":\"").append(esc(u.getAbabyeyi())).append("\",\n");
            sb.append("    \"ahoYavukiye\":\"").append(esc(u.getAhoYavukiye())).append("\",\n");
            sb.append("    \"ahoYapfiriye\":\"").append(esc(u.getAhoYapfiriye())).append("\",\n");
            sb.append("    \"impamvuYurupfu\":\"").append(esc(u.getImpamvuYurupfu())).append("\",\n");
            sb.append("    \"itarikiYavukiye\":\"").append(esc(u.getItarikiYavukiye())).append("\",\n");
            sb.append("    \"itarikiYapfiriye\":\"").append(esc(u.getItarikiYapfiriye())).append("\",\n");
            sb.append("    \"ubwoko\":\"").append(esc(u.getUbwoko())).append("\",\n");
            sb.append("    \"aiIcyifuzo\":\"").append(esc(u.getAiIcyifuzo())).append("\"\n");
            sb.append("  }").append(i < list.size() - 1 ? "," : "").append("\n");
        }
        sb.append("]");
        return sb.toString();
    }

    private static List<Umuntu> parseJson(String content) {
        List<Umuntu> result = new ArrayList<>();
        content = content.trim();
        if (content.isEmpty() || content.equals("[]")) return result;

        content = content.substring(1, content.length() - 1).trim();
        if (content.isEmpty()) return result;

        String[] objects = content.split("\\},\\s*\\{");

        for (String obj : objects) {
            obj = obj.replace("{", "").replace("}", "").trim();
            Umuntu u = new Umuntu();
            List<String> pairs = splitPairs(obj);
            for (String pair : pairs) {
                String[] kv = pair.split(":", 2);
                if (kv.length < 2) continue;
                String key = kv[0].trim().replace("\"", "");
                String val = kv[1].trim().replaceAll("^\"|\"$", "");
                val = val.replace("\\\"", "\"").replace("\\n", "\n");

                switch (key) {
                    case "id": u.setId(val); break;
                    case "amazina": u.setAmazina(val); break;
                    case "indangamuntu": u.setIndangamuntu(val); break;
                    case "ababyeyi": u.setAbabyeyi(val); break;
                    case "ahoYavukiye": u.setAhoYavukiye(val); break;
                    case "ahoYapfiriye": u.setAhoYapfiriye(val); break;
                    case "impamvuYurupfu": u.setImpamvuYurupfu(val); break;
                    case "itarikiYavukiye": u.setItarikiYavukiye(val); break;
                    case "itarikiYapfiriye": u.setItarikiYapfiriye(val); break;
                    case "ubwoko": u.setUbwoko(val); break;
                    case "aiIcyifuzo": u.setAiIcyifuzo(val); break;
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