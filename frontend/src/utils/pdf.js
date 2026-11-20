import jsPDF from "jspdf";

export const generateCertificate = (umuntu) => {
  const doc = new jsPDF();
  const isBirth = umuntu.ubwoko === "BIRTH";

  doc.setFillColor(isBirth ? 34 : 220, isBirth ? 139 : 38, isBirth ? 34 : 38);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("REPUBLIC OF RWANDA", 105, 18, { align: "center" });
  doc.setFontSize(16);
  doc.text("IBARUWA Y'ABATURAGE", 105, 28, { align: "center" });

  doc.setFillColor(250, 250, 250);
  doc.rect(0, 40, 210, 257, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const title = isBirth ? "ICYEMEZO CY'AMAVUKO" : "ICYEMEZO CY'URUPFU";
  doc.text(title, 105, 60, { align: "center" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(40, 68, 170, 68);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`No: ${umuntu.id.substring(0, 8).toUpperCase()}`, 105, 78, {
    align: "center",
  });

  doc.setFontSize(12);
  let y = 100;

  const addField = (label, value) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 30, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${value || "-"}`, 90, y);
    y += 12;
  };

  addField("Amazina", umuntu.amazina);
  addField("Indangamuntu", umuntu.indangamuntu);
  addField("Ababyeyi", umuntu.ababyeyi);

  if (isBirth) {
    addField("Aho yavukiye", umuntu.ahoYavukiye);
    addField("Itariki yavukiye", umuntu.itarikiYavukiye);
  } else {
    addField("Aho yapfiriye", umuntu.ahoYapfiriye);
    addField("Itariki yapfiriye", umuntu.itarikiYapfiriye);
    addField("Impamvu y'urupfu", umuntu.impamvuYurupfu);
  }

  y = 200;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Iri cyemezo ryatanzwe na Sisitemu y'Ibaruwa y'Abaturage",
    105,
    y,
    { align: "center" }
  );

  y += 8;
  doc.text(
    `Itariki: ${new Date().toLocaleDateString("fr-FR")}`,
    105,
    y,
    { align: "center" }
  );

  doc.line(30, 245, 90, 245);
  doc.line(120, 245, 180, 245);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Umuyobozi w'Akarere", 60, 250, { align: "center" });
  doc.text("Umukono n'Itariki", 150, 250, { align: "center" });

  doc.save(`icyemezo_${umuntu.amazina.replace(/\s+/g, "_")}.pdf`);
};