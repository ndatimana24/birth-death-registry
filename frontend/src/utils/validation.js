// ===== PHONE VALIDATION (Rwanda) =====
export const validatePhone = (phone, required = false) => {
  if (!phone || !phone.trim()) {
    return required ? "Phone number is required" : "";
  }
  const cleaned = phone.replace(/\s+/g, "").replace(/^\+250/, "0");
  if (!/^07[2389]\d{7}$/.test(cleaned)) {
    return "Invalid phone. Use: 07XXXXXXXX (10 digits)";
  }
  return "";
};

// ===== ID VALIDATION (16 digits) =====
export const validateIndangamuntu = (id, required = false) => {
  if (!id || !id.trim()) {
    return required ? "National ID is required" : "";
  }
  if (!/^\d{16}$/.test(id)) {
    return "National ID must be exactly 16 digits";
  }
  return "";
};

// ===== NAME VALIDATION =====
export const validateAmazina = (name, required = true) => {
  if (!name || !name.trim()) {
    return required ? "Name is required" : "";
  }
  if (name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }
  if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
    return "Name can only contain letters, spaces, hyphen";
  }
  return "";
};

// ===== PLACE VALIDATION =====
export const validateAho = (place, required = false) => {
  if (!place || !place.trim()) {
    return required ? "This field is required" : "";
  }
  if (place.trim().length < 2) {
    return "Must be at least 2 characters";
  }
  return "";
};

// ===== MAIN VALIDATOR =====
export const validateForm = (form) => {
  const errs = {};

  if (form.amazina !== undefined) {
    const e = validateAmazina(form.amazina, true);
    if (e) errs.amazina = e;
  }

  if (form.numeroYIvuko !== undefined && !form.numeroYIvuko.trim()) {
    errs.numeroYIvuko = "Birth certificate number is required";
  }

  if (form.itarikiYavukiye !== undefined && !form.itarikiYavukiye) {
    errs.itarikiYavukiye = "Date of birth is required";
  }

  if (form.mamaAmazina !== undefined) {
    const e = validateAmazina(form.mamaAmazina, true);
    if (e) errs.mamaAmazina = "Mother: " + e;
  }
  if (form.mamaIndangamuntu !== undefined) {
    const e = validateIndangamuntu(form.mamaIndangamuntu, true);
    if (e) errs.mamaIndangamuntu = "Mother: " + e;
  }
  if (form.mamaTelefone !== undefined) {
    const e = validatePhone(form.mamaTelefone, true);
    if (e) errs.mamaTelefone = "Mother: " + e;
  }

  if (form.yasezeranye === "Yego") {
    if (form.papaAmazina !== undefined) {
      const e = validateAmazina(form.papaAmazina, true);
      if (e) errs.papaAmazina = "Father: " + e;
    }
    if (form.papaIndangamuntu !== undefined) {
      const e = validateIndangamuntu(form.papaIndangamuntu, true);
      if (e) errs.papaIndangamuntu = "Father: " + e;
    }
    if (form.papaTelefone !== undefined) {
      const e = validatePhone(form.papaTelefone, true);
      if (e) errs.papaTelefone = "Father: " + e;
    }
  }

  if (form.akarere !== undefined) {
    const e = validateAho(form.akarere, true);
    if (e) errs.akarere = e;
  }
  if (form.umurenge !== undefined) {
    const e = validateAho(form.umurenge, true);
    if (e) errs.umurenge = e;
  }

  if (form.witness1Amazina !== undefined) {
    const e = validateAmazina(form.witness1Amazina, true);
    if (e) errs.witness1Amazina = "Witness 1: " + e;
  }
  if (form.witness1Indangamuntu !== undefined) {
    const e = validateIndangamuntu(form.witness1Indangamuntu, true);
    if (e) errs.witness1Indangamuntu = "Witness 1: " + e;
  }
  if (form.witness1Telefone !== undefined) {
    const e = validatePhone(form.witness1Telefone, true);
    if (e) errs.witness1Telefone = "Witness 1: " + e;
  }

  if (form.witness2Amazina !== undefined) {
    const e = validateAmazina(form.witness2Amazina, true);
    if (e) errs.witness2Amazina = "Witness 2: " + e;
  }
  if (form.witness2Indangamuntu !== undefined) {
    const e = validateIndangamuntu(form.witness2Indangamuntu, true);
    if (e) errs.witness2Indangamuntu = "Witness 2: " + e;
  }
  if (form.witness2Telefone !== undefined) {
    const e = validatePhone(form.witness2Telefone, true);
    if (e) errs.witness2Telefone = "Witness 2: " + e;
  }

  return errs;
};