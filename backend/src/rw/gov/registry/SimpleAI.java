package rw.gov.registry;

public class SimpleAI {

    public static String genzura(Umuntu u) {
        StringBuilder sb = new StringBuilder();
        int errors = 0;
        int warnings = 0;

        sb.append("📋 AI Validation Report\n");
        sb.append("─────────────────────────\n");

        // 1. Amazina
        if (u.getAmazina() == null || u.getAmazina().trim().length() < 3) {
            sb.append("❌ Name too short (min 3 chars)\n");
            errors++;
        } else if (!u.getAmazina().matches("[a-zA-Z\\s\\-']+")) {
            sb.append("⚠️ Name has invalid characters\n");
            warnings++;
        } else {
            sb.append("✅ Name is valid\n");
        }

        // 2. National ID (DEATH) cyangwa Cert No. (BIRTH)
        if ("DEATH".equals(u.getUbwoko())) {
            if (u.getIndangamuntu() != null && !u.getIndangamuntu().isEmpty()) {
                if (!u.getIndangamuntu().matches("\\d{16}")) {
                    sb.append("❌ National ID must be 16 digits\n");
                    errors++;
                } else {
                    sb.append("✅ National ID is valid\n");
                }
            } else {
                sb.append("⚠️ National ID missing\n");
                warnings++;
            }
        } else if ("BIRTH".equals(u.getUbwoko())) {
            if (u.getNumeroYIvuko() == null || u.getNumeroYIvuko().isEmpty()) {
                sb.append("⚠️ Birth Certificate No. missing\n");
                warnings++;
            } else {
                sb.append("✅ Birth Certificate No. provided\n");
            }
        }

        // 3. Mother's info (BIRTH)
        if ("BIRTH".equals(u.getUbwoko())) {
            if (u.getMamaAmazina() != null && !u.getMamaAmazina().isEmpty()) {
                sb.append("✅ Mother's name provided\n");
            } else {
                sb.append("❌ Mother's name missing\n");
                errors++;
            }

            if (u.getMamaIndangamuntu() != null &&
                u.getMamaIndangamuntu().matches("\\d{16}")) {
                sb.append("✅ Mother's ID valid\n");
            } else if (u.getMamaIndangamuntu() != null &&
                       !u.getMamaIndangamuntu().isEmpty()) {
                sb.append("❌ Mother's ID must be 16 digits\n");
                errors++;
            }

            if (u.getMamaTelefone() != null && !u.getMamaTelefone().isEmpty()) {
                if (!u.getMamaTelefone().matches("07[2389]\\d{7}")) {
                    sb.append("❌ Mother's phone invalid (07XXXXXXXX)\n");
                    errors++;
                } else {
                    sb.append("✅ Mother's phone valid\n");
                }
            }

            // Father
            if ("Yego".equals(u.getYasezeranye())) {
                if (u.getPapaAmazina() != null && !u.getPapaAmazina().isEmpty()) {
                    sb.append("✅ Father's info provided\n");
                } else {
                    sb.append("❌ Father's name required (married)\n");
                    errors++;
                }
                if (u.getPapaTelefone() != null && !u.getPapaTelefone().isEmpty()) {
                    if (!u.getPapaTelefone().matches("07[2389]\\d{7}")) {
                        sb.append("❌ Father's phone invalid\n");
                        errors++;
                    }
                }
            } else if ("Oya".equals(u.getYasezeranye())) {
                sb.append("ℹ️ Mother not married — Father Unknown\n");
            }
        }

        // 4. Birth date
        if (u.getItarikiYavukiye() != null && !u.getItarikiYavukiye().isEmpty()) {
            try {
                java.time.LocalDate d = java.time.LocalDate.parse(u.getItarikiYavukiye());
                if (d.isAfter(java.time.LocalDate.now())) {
                    sb.append("❌ Birth date in the future!\n");
                    errors++;
                } else if (d.isBefore(java.time.LocalDate.now().minusYears(150))) {
                    sb.append("⚠️ Birth date very old\n");
                    warnings++;
                } else {
                    sb.append("✅ Birth date valid\n");
                }
            } catch (Exception e) {
                sb.append("❌ Invalid birth date format\n");
                errors++;
            }
        }

        // 5. Death date
        if ("DEATH".equals(u.getUbwoko()) &&
            u.getItarikiYapfiriye() != null &&
            !u.getItarikiYapfiriye().isEmpty()) {
            try {
                java.time.LocalDate d = java.time.LocalDate.parse(u.getItarikiYapfiriye());
                if (d.isAfter(java.time.LocalDate.now())) {
                    sb.append("❌ Death date in the future!\n");
                    errors++;
                } else {
                    sb.append("✅ Death date valid\n");
                }
            } catch (Exception e) {
                sb.append("❌ Invalid death date format\n");
                errors++;
            }
        }

        // 6. Witnesses
        if ("BIRTH".equals(u.getUbwoko())) {
            int w = 0;
            if (u.getWitness1Amazina() != null && !u.getWitness1Amazina().isEmpty()) w++;
            if (u.getWitness2Amazina() != null && !u.getWitness2Amazina().isEmpty()) w++;
            if (w == 2) {
                sb.append("✅ Two witnesses provided\n");
            } else {
                sb.append("❌ Two witnesses required (have " + w + ")\n");
                errors++;
            }
        } else if ("DEATH".equals(u.getUbwoko())) {
            int w = 0;
            if (u.getDeathWitness1Amazina() != null && !u.getDeathWitness1Amazina().isEmpty()) w++;
            if (u.getDeathWitness2Amazina() != null && !u.getDeathWitness2Amazina().isEmpty()) w++;
            if (w == 2) {
                sb.append("✅ Two witnesses provided\n");
            } else {
                sb.append("❌ Two witnesses required (have " + w + ")\n");
                errors++;
            }
        }

        // Summary
        sb.append("─────────────────────────\n");
        if (errors == 0 && warnings == 0) {
            sb.append("✅ All validations passed!");
        } else if (errors == 0) {
            sb.append("✅ No errors (" + warnings + " warning" +
                      (warnings > 1 ? "s" : "") + ")");
        } else {
            sb.append("❌ " + errors + " error" + (errors > 1 ? "s" : ""));
            if (warnings > 0) sb.append(", " + warnings + " warning" +
                                (warnings > 1 ? "s" : ""));
        }

        return sb.toString();
    }
}