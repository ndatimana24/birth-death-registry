package rw.gov.registry;

import java.util.UUID;

public class Umuntu {
    private String id;
    private String amazina;
    private String indangamuntu;
    private String ababyeyi;
    private String ahoYavukiye;
    private String ahoYapfiriye;
    private String impamvuYurupfu;
    private String itarikiYavukiye;
    private String itarikiYapfiriye;
    private String ubwoko;
    private String aiIcyifuzo;

    // === BIRTH NSHYA ===
    private String numeroYIvuko;
    private String igitsina;
    private String mamaAmazina;
    private String mamaIndangamuntu;
    private String mamaTelefone;
    private String yasezeranye;
    private String papaAmazina;
    private String papaIndangamuntu;
    private String papaTelefone;
    private String akarere;
    private String umurenge;
    private String akagari;
    private String umudugudu;
    private String witness1Amazina;
    private String witness1Indangamuntu;
    private String witness1Telefone;
    private String witness2Amazina;
    private String witness2Indangamuntu;
    private String witness2Telefone;

    // === DEATH NSHYA ===
    private String deathWitness1Amazina;
    private String deathWitness1Indangamuntu;
    private String deathWitness1Telefone;
    private String deathWitness2Amazina;
    private String deathWitness2Indangamuntu;
    private String deathWitness2Telefone;

    public Umuntu() {
        this.id = UUID.randomUUID().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAmazina() { return amazina; }
    public void setAmazina(String amazina) { this.amazina = amazina; }
    public String getIndangamuntu() { return indangamuntu; }
    public void setIndangamuntu(String indangamuntu) { this.indangamuntu = indangamuntu; }
    public String getAbabyeyi() { return ababyeyi; }
    public void setAbabyeyi(String ababyeyi) { this.ababyeyi = ababyeyi; }
    public String getAhoYavukiye() { return ahoYavukiye; }
    public void setAhoYavukiye(String ahoYavukiye) { this.ahoYavukiye = ahoYavukiye; }
    public String getAhoYapfiriye() { return ahoYapfiriye; }
    public void setAhoYapfiriye(String ahoYapfiriye) { this.ahoYapfiriye = ahoYapfiriye; }
    public String getImpamvuYurupfu() { return impamvuYurupfu; }
    public void setImpamvuYurupfu(String impamvuYurupfu) { this.impamvuYurupfu = impamvuYurupfu; }
    public String getItarikiYavukiye() { return itarikiYavukiye; }
    public void setItarikiYavukiye(String itarikiYavukiye) { this.itarikiYavukiye = itarikiYavukiye; }
    public String getItarikiYapfiriye() { return itarikiYapfiriye; }
    public void setItarikiYapfiriye(String itarikiYapfiriye) { this.itarikiYapfiriye = itarikiYapfiriye; }
    public String getUbwoko() { return ubwoko; }
    public void setUbwoko(String ubwoko) { this.ubwoko = ubwoko; }
    public String getAiIcyifuzo() { return aiIcyifuzo; }
    public void setAiIcyifuzo(String aiIcyifuzo) { this.aiIcyifuzo = aiIcyifuzo; }

    public String getNumeroYIvuko() { return numeroYIvuko; }
    public void setNumeroYIvuko(String numeroYIvuko) { this.numeroYIvuko = numeroYIvuko; }
    public String getDigitsina() { return igitsina; }
    public void setDigitsina(String igitsina) { this.igitsina = igitsina; }
    public String getMamaAmazina() { return mamaAmazina; }
    public void setMamaAmazina(String mamaAmazina) { this.mamaAmazina = mamaAmazina; }
    public String getMamaIndangamuntu() { return mamaIndangamuntu; }
    public void setMamaIndangamuntu(String mamaIndangamuntu) { this.mamaIndangamuntu = mamaIndangamuntu; }
    public String getMamaTelefone() { return mamaTelefone; }
    public void setMamaTelefone(String mamaTelefone) { this.mamaTelefone = mamaTelefone; }
    public String getYasezeranye() { return yasezeranye; }
    public void setYasezeranye(String yasezeranye) { this.yasezeranye = yasezeranye; }
    public String getPapaAmazina() { return papaAmazina; }
    public void setPapaAmazina(String papaAmazina) { this.papaAmazina = papaAmazina; }
    public String getPapaIndangamuntu() { return papaIndangamuntu; }
    public void setPapaIndangamuntu(String papaIndangamuntu) { this.papaIndangamuntu = papaIndangamuntu; }
    public String getPapaTelefone() { return papaTelefone; }
    public void setPapaTelefone(String papaTelefone) { this.papaTelefone = papaTelefone; }
    public String getAkarere() { return akarere; }
    public void setAkarere(String akarere) { this.akarere = akarere; }
    public String getUmurenge() { return umurenge; }
    public void setUmurenge(String umurenge) { this.umurenge = umurenge; }
    public String getAkagari() { return akagari; }
    public void setAkagari(String akagari) { this.akagari = akagari; }
    public String getUmudugudu() { return umudugudu; }
    public void setUmudugudu(String umudugudu) { this.umudugudu = umudugudu; }
    public String getWitness1Amazina() { return witness1Amazina; }
    public void setWitness1Amazina(String w) { this.witness1Amazina = w; }
    public String getWitness1Indangamuntu() { return witness1Indangamuntu; }
    public void setWitness1Indangamuntu(String w) { this.witness1Indangamuntu = w; }
    public String getWitness1Telefone() { return witness1Telefone; }
    public void setWitness1Telefone(String w) { this.witness1Telefone = w; }
    public String getWitness2Amazina() { return witness2Amazina; }
    public void setWitness2Amazina(String w) { this.witness2Amazina = w; }
    public String getWitness2Indangamuntu() { return witness2Indangamuntu; }
    public void setWitness2Indangamuntu(String w) { this.witness2Indangamuntu = w; }
    public String getWitness2Telefone() { return witness2Telefone; }
    public void setWitness2Telefone(String w) { this.witness2Telefone = w; }
    public String getDeathWitness1Amazina() { return deathWitness1Amazina; }
    public void setDeathWitness1Amazina(String w) { this.deathWitness1Amazina = w; }
    public String getDeathWitness1Indangamuntu() { return deathWitness1Indangamuntu; }
    public void setDeathWitness1Indangamuntu(String w) { this.deathWitness1Indangamuntu = w; }
    public String getDeathWitness1Telefone() { return deathWitness1Telefone; }
    public void setDeathWitness1Telefone(String w) { this.deathWitness1Telefone = w; }
    public String getDeathWitness2Amazina() { return deathWitness2Amazina; }
    public void setDeathWitness2Amazina(String w) { this.deathWitness2Amazina = w; }
    public String getDeathWitness2Indangamuntu() { return deathWitness2Indangamuntu; }
    public void setDeathWitness2Indangamuntu(String w) { this.deathWitness2Indangamuntu = w; }
    public String getDeathWitness2Telefone() { return deathWitness2Telefone; }
    public void setDeathWitness2Telefone(String w) { this.deathWitness2Telefone = w; }
}