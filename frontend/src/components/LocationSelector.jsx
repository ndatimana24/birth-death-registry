import { useState, useEffect } from "react";
import { rwandaLocation } from "@devrw/rwanda-location";

export default function LocationSelector({ value, onChange, errors = {} }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);

  // Codes zo kubika
  const [selectedCodes, setSelectedCodes] = useState({
    provinceCode: "",
    districtCode: "",
    sectorCode: "",
    cellCode: "",
    villageCode: "",
  });

  // 1. Load provinces ku itangira
  useEffect(() => {
    setProvinces(rwandaLocation.getProvinces());
  }, []);

  // 2. Iyo province ihindutse → districts
  useEffect(() => {
    if (selectedCodes.provinceCode) {
      setDistricts(rwandaLocation.getDistricts(selectedCodes.provinceCode));
    } else {
      setDistricts([]);
    }
  }, [selectedCodes.provinceCode]);

  // 3. Iyo district ihindutse → sectors
  useEffect(() => {
    if (selectedCodes.districtCode) {
      setSectors(rwandaLocation.getSectors(selectedCodes.districtCode));
    } else {
      setSectors([]);
    }
  }, [selectedCodes.districtCode]);

  // 4. Iyo sector ihindutse → cells
  useEffect(() => {
    if (selectedCodes.sectorCode) {
      setCells(rwandaLocation.getCells(selectedCodes.sectorCode));
    } else {
      setCells([]);
    }
  }, [selectedCodes.sectorCode]);

  // 5. Iyo cell ihindutse → villages
  useEffect(() => {
    if (selectedCodes.cellCode) {
      setVillages(rwandaLocation.getVillages(selectedCodes.cellCode));
    } else {
      setVillages([]);
    }
  }, [selectedCodes.cellCode]);

  // ===== HANDLERS =====
  const handleProvince = (e) => {
    const code = parseInt(e.target.value) || "";
    setSelectedCodes({
      provinceCode: code,
      districtCode: "",
      sectorCode: "",
      cellCode: "",
      villageCode: "",
    });
    onChange({
      akarere: "",
      umurenge: "",
      akagari: "",
      umudugudu: "",
      provinceCode: code,
      districtCode: "",
      sectorCode: "",
      cellCode: "",
    });
  };

  const handleDistrict = (e) => {
    const code = parseInt(e.target.value) || "";
    const district = districts.find((d) => d.code === code);
    setSelectedCodes({
      ...selectedCodes,
      districtCode: code,
      sectorCode: "",
      cellCode: "",
      villageCode: "",
    });
    onChange({
      akarere: district?.name || "",
      umurenge: "",
      akagari: "",
      umudugudu: "",
      provinceCode: selectedCodes.provinceCode,
      districtCode: code,
      sectorCode: "",
      cellCode: "",
    });
  };

  const handleSector = (e) => {
    const code = e.target.value;
    const sector = sectors.find((s) => s.code === code);
    setSelectedCodes({
      ...selectedCodes,
      sectorCode: code,
      cellCode: "",
      villageCode: "",
    });
    onChange({
      akarere: value.akarere,
      umurenge: sector?.name || "",
      akagari: "",
      umudugudu: "",
      provinceCode: selectedCodes.provinceCode,
      districtCode: selectedCodes.districtCode,
      sectorCode: code,
      cellCode: "",
    });
  };

  const handleCell = (e) => {
    const code = parseInt(e.target.value) || "";
    const cell = cells.find((c) => c.code === code);
    setSelectedCodes({
      ...selectedCodes,
      cellCode: code,
      villageCode: "",
    });
    onChange({
      akarere: value.akarere,
      umurenge: value.umurenge,
      akagari: cell?.name || "",
      umudugudu: "",
      provinceCode: selectedCodes.provinceCode,
      districtCode: selectedCodes.districtCode,
      sectorCode: selectedCodes.sectorCode,
      cellCode: code,
    });
  };

  const handleVillage = (e) => {
    const code = parseInt(e.target.value) || "";
    const village = villages.find((v) => v.code === code);
    setSelectedCodes({ ...selectedCodes, villageCode: code });
    onChange({
      akarere: value.akarere,
      umurenge: value.umurenge,
      akagari: value.akagari,
      umudugudu: village?.name || "",
      provinceCode: selectedCodes.provinceCode,
      districtCode: selectedCodes.districtCode,
      sectorCode: selectedCodes.sectorCode,
      cellCode: code,
      villageCode: code,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-purple-700 border-b pb-2 mb-3">
        📍 Place of Birth
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Province */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Province (Intara) *
          </label>
          <select
            value={selectedCodes.provinceCode}
            onChange={handleProvince}
            className="w-full border p-3 rounded"
          >
            <option value="">-- Select Province --</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            District (Akarere) *
          </label>
          <select
            value={selectedCodes.districtCode}
            onChange={handleDistrict}
            disabled={!selectedCodes.provinceCode}
            className={`w-full border p-3 rounded ${
              errors.akarere ? "border-red-500" : ""
            } ${!selectedCodes.provinceCode ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <option value="">
              {!selectedCodes.provinceCode
                ? "-- Select Province first --"
                : "-- Select District --"}
            </option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.akarere && (
            <p className="text-red-500 text-xs mt-1">⚠️ {errors.akarere}</p>
          )}
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Sector (Umurenge) *
          </label>
          <select
            value={selectedCodes.sectorCode}
            onChange={handleSector}
            disabled={!selectedCodes.districtCode}
            className={`w-full border p-3 rounded ${
              errors.umurenge ? "border-red-500" : ""
            } ${!selectedCodes.districtCode ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <option value="">
              {!selectedCodes.districtCode
                ? "-- Select District first --"
                : "-- Select Sector --"}
            </option>
            {sectors.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.umurenge && (
            <p className="text-red-500 text-xs mt-1">⚠️ {errors.umurenge}</p>
          )}
        </div>

        {/* Cell */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Cell (Akagari)
          </label>
          <select
            value={selectedCodes.cellCode}
            onChange={handleCell}
            disabled={!selectedCodes.sectorCode}
            className={`w-full border p-3 rounded ${
              !selectedCodes.sectorCode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">
              {!selectedCodes.sectorCode
                ? "-- Select Sector first --"
                : "-- Select Cell --"}
            </option>
            {cells.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Village */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Village (Umudugudu)
          </label>
          <select
            value={selectedCodes.villageCode}
            onChange={handleVillage}
            disabled={!selectedCodes.cellCode}
            className={`w-full border p-3 rounded ${
              !selectedCodes.cellCode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">
              {!selectedCodes.cellCode
                ? "-- Select Cell first --"
                : "-- Select Village --"}
            </option>
            {villages.map((v) => (
              <option key={v.code} value={v.code}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview */}
      {value.akarere && value.umurenge && (
        <div className="mt-3 p-2 bg-purple-50 rounded text-sm text-purple-800">
          📍 <strong>Selected:</strong> {value.akarere}
          {value.umurenge && ` › ${value.umurenge}`}
          {value.akagari && ` › ${value.akagari}`}
          {value.umudugudu && ` › ${value.umudugudu}`}
        </div>
      )}
    </div>
  );
}