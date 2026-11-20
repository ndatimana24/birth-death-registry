import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LocationSelector from "../components/LocationSelector";
import {
  wandikaUmwana,
  andikuzaUwapfuye,
  shakishaByose,
  sibaUmuntu,
  updateUmuntu,
} from "../services/api";
import API from "../services/api";
import { validateIndangamuntu, validatePhone } from "../utils/validation";
import { generateCertificate } from "../utils/pdf";

const emptyBirthForm = {
  amazina: "",
  numeroYIvuko: "",
  igitsina: "Gabo",
  itarikiYavukiye: "",
  mamaAmazina: "",
  mamaIndangamuntu: "",
  mamaTelefone: "",
  yasezeranye: "Yego",
  papaAmazina: "",
  papaIndangamuntu: "",
  papaTelefone: "",
  akarere: "",
  umurenge: "",
  akagari: "",
  umudugudu: "",
  provinceCode: "",
  districtCode: "",
  sectorCode: "",
  cellCode: "",
  villageCode: "",
  witness1Amazina: "",
  witness1Indangamuntu: "",
  witness1Telefone: "",
  witness2Amazina: "",
  witness2Indangamuntu: "",
  witness2Telefone: "",
};

const emptyDeathForm = {
  amazina: "",
  indangamuntu: "",
  ababyeyi: "",
  ahoYapfiriye: "",
  impamvuYurupfu: "",
  itarikiYapfiriye: "",
  deathWitness1Amazina: "",
  deathWitness1Indangamuntu: "",
  deathWitness1Telefone: "",
  deathWitness2Amazina: "",
  deathWitness2Indangamuntu: "",
  deathWitness2Telefone: "",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("BIRTH");
  const [abantu, setAbantu] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [birthForm, setBirthForm] = useState(emptyBirthForm);
  const [deathForm, setDeathForm] = useState(emptyDeathForm);
  const [errors, setErrors] = useState({});

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadData = async () => {
    try {
      const res = await shakishaByose();
      setAbantu(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    loadUsers();
  }, []);

  // ========== BIRTH ==========
  const handleBirthChange = (e) => {
    setBirthForm({ ...birthForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateBirth = () => {
    const errs = {};
    if (!birthForm.amazina.trim()) errs.amazina = "Child's name is required";
    if (!birthForm.numeroYIvuko.trim())
      errs.numeroYIvuko = "Certificate No. is required";
    if (!birthForm.itarikiYavukiye)
      errs.itarikiYavukiye = "Date of birth is required";
    if (!birthForm.mamaAmazina.trim())
      errs.mamaAmazina = "Mother's name is required";

    const mId = validateIndangamuntu(birthForm.mamaIndangamuntu, true);
    if (mId) errs.mamaIndangamuntu = mId;
    const mPh = validatePhone(birthForm.mamaTelefone, true);
    if (mPh) errs.mamaTelefone = mPh;

    if (birthForm.yasezeranye === "Yego") {
      if (!birthForm.papaAmazina.trim())
        errs.papaAmazina = "Father's name is required";
      const pId = validateIndangamuntu(birthForm.papaIndangamuntu, true);
      if (pId) errs.papaIndangamuntu = pId;
      const pPh = validatePhone(birthForm.papaTelefone, true);
      if (pPh) errs.papaTelefone = pPh;
    }

    if (!birthForm.akarere.trim()) errs.akarere = "District is required";
    if (!birthForm.umurenge.trim()) errs.umurenge = "Sector is required";

    if (!birthForm.witness1Amazina.trim())
      errs.witness1Amazina = "Witness 1 name is required";
    const w1Id = validateIndangamuntu(birthForm.witness1Indangamuntu, true);
    if (w1Id) errs.witness1Indangamuntu = w1Id;
    const w1Ph = validatePhone(birthForm.witness1Telefone, true);
    if (w1Ph) errs.witness1Telefone = w1Ph;

    if (!birthForm.witness2Amazina.trim())
      errs.witness2Amazina = "Witness 2 name is required";
    const w2Id = validateIndangamuntu(birthForm.witness2Indangamuntu, true);
    if (w2Id) errs.witness2Indangamuntu = w2Id;
    const w2Ph = validatePhone(birthForm.witness2Telefone, true);
    if (w2Ph) errs.witness2Telefone = w2Ph;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBirthSubmit = async (e) => {
    e.preventDefault();
    if (!validateBirth()) return;
    setLoading(true);
    try {
      const fullData = {
        ...birthForm,
        papaAmazina:
          birthForm.yasezeranye === "Yego" ? birthForm.papaAmazina : "Unknown",
        papaIndangamuntu:
          birthForm.yasezeranye === "Yego" ? birthForm.papaIndangamuntu : "",
        papaTelefone:
          birthForm.yasezeranye === "Yego" ? birthForm.papaTelefone : "",
        ahoYavukiye: `${birthForm.akarere}, ${birthForm.umurenge}, ${birthForm.akagari}, ${birthForm.umudugudu}`,
        ababyeyi: `${birthForm.mamaAmazina} & ${
          birthForm.yasezeranye === "Yego" ? birthForm.papaAmazina : "Unknown"
        }`,
      };
      await wandikaUmwana(fullData);
      alert("✅ Birth recorded successfully!");
      setBirthForm(emptyBirthForm);
      setErrors({});
      loadData();
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== DEATH ==========
  const handleDeathChange = (e) => {
    setDeathForm({ ...deathForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateDeath = () => {
    const errs = {};
    if (!deathForm.amazina.trim()) errs.amazina = "Name is required";
    const idErr = validateIndangamuntu(deathForm.indangamuntu, true);
    if (idErr) errs.indangamuntu = idErr;
    if (!deathForm.ahoYapfiriye.trim())
      errs.ahoYapfiriye = "Place of death is required";
    if (!deathForm.itarikiYapfiriye)
      errs.itarikiYapfiriye = "Date of death is required";

    if (!deathForm.deathWitness1Amazina.trim())
      errs.deathWitness1Amazina = "Witness 1 name is required";
    const w1Id = validateIndangamuntu(
      deathForm.deathWitness1Indangamuntu,
      true
    );
    if (w1Id) errs.deathWitness1Indangamuntu = w1Id;
    const w1Ph = validatePhone(deathForm.deathWitness1Telefone, true);
    if (w1Ph) errs.deathWitness1Telefone = w1Ph;

    if (!deathForm.deathWitness2Amazina.trim())
      errs.deathWitness2Amazina = "Witness 2 name is required";
    const w2Id = validateIndangamuntu(
      deathForm.deathWitness2Indangamuntu,
      true
    );
    if (w2Id) errs.deathWitness2Indangamuntu = w2Id;
    const w2Ph = validatePhone(deathForm.deathWitness2Telefone, true);
    if (w2Ph) errs.deathWitness2Telefone = w2Ph;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDeathSubmit = async (e) => {
    e.preventDefault();
    if (!validateDeath()) return;
    setLoading(true);
    try {
      await andikuzaUwapfuye(deathForm);
      alert("✅ Death recorded successfully!");
      setDeathForm(emptyDeathForm);
      setErrors({});
      loadData();
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== UPDATE ==========
  const handleEdit = (umuntu) => {
    setEditing(umuntu);
    setEditForm({ ...umuntu });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUmuntu(editing.id, editForm);
      alert("✅ Record updated successfully!");
      setEditing(null);
      setEditForm({});
      loadData();
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUmuntu = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      await sibaUmuntu(id);
      loadData();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await API.delete(`/auth/users/${id}`);
      loadUsers();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  const handlePDF = (umuntu) => {
    try {
      generateCertificate(umuntu);
    } catch (err) {
      alert("❌ PDF error: " + err.message);
    }
  };

  const abavutse = abantu.filter((u) => u.ubwoko === "BIRTH").length;
  const abapfuye = abantu.filter((u) => u.ubwoko === "DEATH").length;

  const filteredAbantu = abantu
    .filter((u) =>
      tab === "BIRTH" ? u.ubwoko === "BIRTH" : u.ubwoko === "DEATH"
    )
    .filter((u) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (u.amazina || "").toLowerCase().includes(q) ||
        (u.numeroYIvuko || "").toLowerCase().includes(q) ||
        (u.indangamuntu || "").includes(q)
      );
    });

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (u.username || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          🛡️ Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-blue-800">{abantu.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Births</p>
            <p className="text-2xl font-bold text-green-700">{abavutse}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Deaths</p>
            <p className="text-2xl font-bold text-red-700">{abapfuye}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Users</p>
            <p className="text-2xl font-bold text-yellow-700">
              {users.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setTab("BIRTH")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              tab === "BIRTH"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            👶 Register Birth
          </button>
          <button
            onClick={() => setTab("DEATH")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              tab === "DEATH"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            ⚰️ Register Death
          </button>
          <button
            onClick={() => setTab("USERS")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              tab === "USERS"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            👥 Users ({users.length})
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search..."
            className="w-full md:w-80 border p-2 rounded-lg"
          />
        </div>

        {/* BIRTH FORM */}
        {tab === "BIRTH" && (
          <form
            onSubmit={handleBirthSubmit}
            className="bg-white shadow p-4 md:p-6 rounded-lg mb-6 space-y-4"
            noValidate
          >
            <h2 className="text-lg font-bold text-green-800 border-b pb-2">
              👶 Child Information
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  name="amazina"
                  value={birthForm.amazina}
                  onChange={handleBirthChange}
                  className={`w-full border p-3 rounded ${
                    errors.amazina ? "border-red-500" : ""
                  }`}
                />
                {errors.amazina && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ {errors.amazina}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Birth Certificate No. *
                </label>
                <input
                  name="numeroYIvuko"
                  value={birthForm.numeroYIvuko}
                  onChange={handleBirthChange}
                  placeholder="2026/BIRTH/00123"
                  className={`w-full border p-3 rounded ${
                    errors.numeroYIvuko ? "border-red-500" : ""
                  }`}
                />
                {errors.numeroYIvuko && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ {errors.numeroYIvuko}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Gender
                </label>
                <select
                  name="igitsina"
                  value={birthForm.igitsina}
                  onChange={handleBirthChange}
                  className="w-full border p-3 rounded"
                >
                  <option>Gabo</option>
                  <option>Gore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="itarikiYavukiye"
                  value={birthForm.itarikiYavukiye}
                  onChange={handleBirthChange}
                  className={`w-full border p-3 rounded ${
                    errors.itarikiYavukiye ? "border-red-500" : ""
                  }`}
                />
                {errors.itarikiYavukiye && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ {errors.itarikiYavukiye}
                  </p>
                )}
              </div>
            </div>

            <h2 className="text-lg font-bold text-pink-700 border-b pb-2">
              👩 Mother
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              <input
                name="mamaAmazina"
                value={birthForm.mamaAmazina}
                onChange={handleBirthChange}
                placeholder="Full name *"
                className={`border p-3 rounded ${
                  errors.mamaAmazina ? "border-red-500" : ""
                }`}
              />
              <input
                name="mamaIndangamuntu"
                value={birthForm.mamaIndangamuntu}
                onChange={handleBirthChange}
                placeholder="ID (16 digits) *"
                maxLength={16}
                className={`border p-3 rounded ${
                  errors.mamaIndangamuntu ? "border-red-500" : ""
                }`}
              />
              <input
                name="mamaTelefone"
                value={birthForm.mamaTelefone}
                onChange={handleBirthChange}
                placeholder="Phone 07XXXXXXXX *"
                maxLength={10}
                className={`border p-3 rounded ${
                  errors.mamaTelefone ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="text-red-500 text-xs space-y-0.5">
              {errors.mamaAmazina && <p>⚠️ {errors.mamaAmazina}</p>}
              {errors.mamaIndangamuntu && <p>⚠️ {errors.mamaIndangamuntu}</p>}
              {errors.mamaTelefone && <p>⚠️ {errors.mamaTelefone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setBirthForm({ ...birthForm, yasezeranye: "Yego" })
                }
                className={`py-3 rounded-lg border-2 font-semibold ${
                  birthForm.yasezeranye === "Yego"
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                ✅ Married
              </button>
              <button
                type="button"
                onClick={() =>
                  setBirthForm({ ...birthForm, yasezeranye: "Oya" })
                }
                className={`py-3 rounded-lg border-2 font-semibold ${
                  birthForm.yasezeranye === "Oya"
                    ? "border-red-600 bg-red-50 text-red-800"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                ❌ Not married
              </button>
            </div>

            {birthForm.yasezeranye === "Yego" && (
              <>
                <h2 className="text-lg font-bold text-blue-700 border-b pb-2">
                  👨 Father
                </h2>
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    name="papaAmazina"
                    value={birthForm.papaAmazina}
                    onChange={handleBirthChange}
                    placeholder="Full name *"
                    className={`border p-3 rounded ${
                      errors.papaAmazina ? "border-red-500" : ""
                    }`}
                  />
                  <input
                    name="papaIndangamuntu"
                    value={birthForm.papaIndangamuntu}
                    onChange={handleBirthChange}
                    placeholder="ID (16 digits) *"
                    maxLength={16}
                    className={`border p-3 rounded ${
                      errors.papaIndangamuntu ? "border-red-500" : ""
                    }`}
                  />
                  <input
                    name="papaTelefone"
                    value={birthForm.papaTelefone}
                    onChange={handleBirthChange}
                    placeholder="Phone 07XXXXXXXX *"
                    maxLength={10}
                    className={`border p-3 rounded ${
                      errors.papaTelefone ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <div className="text-red-500 text-xs space-y-0.5">
                  {errors.papaAmazina && <p>⚠️ {errors.papaAmazina}</p>}
                  {errors.papaIndangamuntu && (
                    <p>⚠️ {errors.papaIndangamuntu}</p>
                  )}
                  {errors.papaTelefone && <p>⚠️ {errors.papaTelefone}</p>}
                </div>
              </>
            )}

            {/* LOCATION SELECTOR */}
            <LocationSelector
              value={{
                akarere: birthForm.akarere,
                umurenge: birthForm.umurenge,
                akagari: birthForm.akagari,
                umudugudu: birthForm.umudugudu,
              }}
              onChange={(loc) => {
                setBirthForm({ ...birthForm, ...loc });
                setErrors({
                  ...errors,
                  akarere: "",
                  umurenge: "",
                  akagari: "",
                  umudugudu: "",
                });
              }}
              errors={errors}
            />

            <h2 className="text-lg font-bold text-orange-700 border-b pb-2">
              🧑‍🤝‍🧑 Witnesses
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="border-2 border-orange-200 rounded p-3 bg-orange-50 space-y-2">
                <p className="font-semibold text-orange-800">Witness 1</p>
                <input
                  name="witness1Amazina"
                  value={birthForm.witness1Amazina}
                  onChange={handleBirthChange}
                  placeholder="Full name *"
                  className={`w-full border p-2 rounded text-sm ${
                    errors.witness1Amazina ? "border-red-500" : ""
                  }`}
                />
                <input
                  name="witness1Indangamuntu"
                  value={birthForm.witness1Indangamuntu}
                  onChange={handleBirthChange}
                  placeholder="ID (16 digits) *"
                  maxLength={16}
                  className={`w-full border p-2 rounded text-sm ${
                    errors.witness1Indangamuntu ? "border-red-500" : ""
                  }`}
                />
                <input
                  name="witness1Telefone"
                  value={birthForm.witness1Telefone}
                  onChange={handleBirthChange}
                  placeholder="Phone 07XXXXXXXX *"
                  maxLength={10}
                  className={`w-full border p-2 rounded text-sm ${
                    errors.witness1Telefone ? "border-red-500" : ""
                  }`}
                />
                {errors.witness1Amazina && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.witness1Amazina}
                  </p>
                )}
                {errors.witness1Indangamuntu && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.witness1Indangamuntu}
                  </p>
                )}
                {errors.witness1Telefone && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.witness1Telefone}
                  </p>
                )}
              </div>
              <div className="border-2 border-orange-200 rounded p-3 bg-orange-50 space-y-2">
                <p className="font-semibold text-orange-800">Witness 2</p>
                <input
                  name="witness2Amazina"
                  value={birthForm.witness2Amazina}
                  onChange={handleBirthChange}
                  placeholder="Full name *"
                  className={`w-full border p-2 rounded text-sm ${
                    errors.witness2Amazina ? "border-red-500" : ""
                  }`}
                />
                <input
                  name="witness2Indangamuntu"
                  value={birthForm.witness2Indangamuntu}
                  onChange={handleBirthChange}
                  placeholder="ID (16 digits) *"
                  maxLength={16}
                  className={`w-full border p-2 rounded text-sm ${
                    errors.witness2Indangamuntu ? "border-red-500" : ""
                  }`}
                />
                <input
                  name="witness2Telefone"
                  value={birthForm.witness2Telefone}
                  onChange={handleBirthChange}
                  placeholder="Phone 07XXXXXXXX *"
                  maxLength={10}
                  className={`w-full border p-2 rounded text-sm ${
                    errors.witness2Telefone ? "border-red-500" : ""
                  }`}
                />
                {errors.witness2Amazina && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.witness2Amazina}
                  </p>
                )}
                {errors.witness2Indangamuntu && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.witness2Indangamuntu}
                  </p>
                )}
                {errors.witness2Telefone && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.witness2Telefone}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? "⏳ Saving..." : "➕ Register Birth"}
            </button>
          </form>
        )}

        {/* DEATH FORM */}
        {tab === "DEATH" && (
          <form
            onSubmit={handleDeathSubmit}
            className="bg-white shadow p-4 md:p-6 rounded-lg mb-6 space-y-4"
            noValidate
          >
            <h2 className="text-lg font-bold text-red-800 border-b pb-2">
              ⚰️ Deceased Information
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  name="amazina"
                  value={deathForm.amazina}
                  onChange={handleDeathChange}
                  className={`w-full border p-3 rounded ${
                    errors.amazina ? "border-red-500" : ""
                  }`}
                />
                {errors.amazina && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ {errors.amazina}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  National ID *
                </label>
                <input
                  name="indangamuntu"
                  value={deathForm.indangamuntu}
                  onChange={handleDeathChange}
                  placeholder="16 digits"
                  maxLength={16}
                  className={`w-full border p-3 rounded ${
                    errors.indangamuntu ? "border-red-500" : ""
                  }`}
                />
                {errors.indangamuntu && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ {errors.indangamuntu}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Date of Death *
                </label>
                <input
                  type="date"
                  name="itarikiYapfiriye"
                  value={deathForm.itarikiYapfiriye}
                  onChange={handleDeathChange}
                  className={`w-full border p-3 rounded ${
                    errors.itarikiYapfiriye ? "border-red-500" : ""
                  }`}
                />
                {errors.itarikiYapfiriye && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ {errors.itarikiYapfiriye}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Parents
                </label>
                <input
                  name="ababyeyi"
                  value={deathForm.ababyeyi}
                  onChange={handleDeathChange}
                  className="w-full border p-3 rounded"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Place of Death *
                </label>
                <input
                  name="ahoYapfiriye"
                  value={deathForm.ahoYapfiriye}
                  onChange={handleDeathChange}
                  className={`w-full border p-3 rounded ${
                    errors.ahoYapfiriye ? "border-red-500" : ""
                  }`}
                />
                {errors.ahoYapfiriye && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ {errors.ahoYapfiriye}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Cause of Death
                </label>
                <input
                  name="impamvuYurupfu"
                  value={deathForm.impamvuYurupfu}
                  onChange={handleDeathChange}
                  className="w-full border p-3 rounded"
                />
              </div>
            </div>

            <h2 className="text-lg font-bold text-orange-700 border-b pb-2">
              🧑‍🤝‍🧑 Witnesses who confirm the death
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="border-2 border-orange-200 rounded p-3 bg-orange-50 space-y-2">
                <p className="font-semibold text-orange-800">Witness 1</p>
                <input
                  name="deathWitness1Amazina"
                  value={deathForm.deathWitness1Amazina}
                  onChange={handleDeathChange}
                  placeholder="Full name *"
                  className={`w-full border p-2 rounded text-sm ${
                    errors.deathWitness1Amazina ? "border-red-500" : ""
                  }`}
                />
                <input
                  name="deathWitness1Indangamuntu"
                  value={deathForm.deathWitness1Indangamuntu}
                  onChange={handleDeathChange}
                  placeholder="ID (16 digits) *"
                  maxLength={16}
                  className={`w-full border p-2 rounded text-sm ${
                    errors.deathWitness1Indangamuntu ? "border-red-500" : ""
                  }`}
                />
                <input
                  name="deathWitness1Telefone"
                  value={deathForm.deathWitness1Telefone}
                  onChange={handleDeathChange}
                  placeholder="Phone 07XXXXXXXX *"
                  maxLength={10}
                  className={`w-full border p-2 rounded text-sm ${
                    errors.deathWitness1Telefone ? "border-red-500" : ""
                  }`}
                />
                {errors.deathWitness1Amazina && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.deathWitness1Amazina}
                  </p>
                )}
                {errors.deathWitness1Indangamuntu && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.deathWitness1Indangamuntu}
                  </p>
                )}
                {errors.deathWitness1Telefone && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.deathWitness1Telefone}
                  </p>
                )}
              </div>
              <div className="border-2 border-orange-200 rounded p-3 bg-orange-50 space-y-2">
                <p className="font-semibold text-orange-800">Witness 2</p>
                <input
                  name="deathWitness2Amazina"
                  value={deathForm.deathWitness2Amazina}
                  onChange={handleDeathChange}
                  placeholder="Full name *"
                  className={`w-full border p-2 rounded text-sm ${
                    errors.deathWitness2Amazina ? "border-red-500" : ""
                  }`}
                />
                <input
                  name="deathWitness2Indangamuntu"
                  value={deathForm.deathWitness2Indangamuntu}
                  onChange={handleDeathChange}
                  placeholder="ID (16 digits) *"
                  maxLength={16}
                  className={`w-full border p-2 rounded text-sm ${
                    errors.deathWitness2Indangamuntu ? "border-red-500" : ""
                  }`}
                />
                <input
                  name="deathWitness2Telefone"
                  value={deathForm.deathWitness2Telefone}
                  onChange={handleDeathChange}
                  placeholder="Phone 07XXXXXXXX *"
                  maxLength={10}
                  className={`w-full border p-2 rounded text-sm ${
                    errors.deathWitness2Telefone ? "border-red-500" : ""
                  }`}
                />
                {errors.deathWitness2Amazina && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.deathWitness2Amazina}
                  </p>
                )}
                {errors.deathWitness2Indangamuntu && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.deathWitness2Indangamuntu}
                  </p>
                )}
                {errors.deathWitness2Telefone && (
                  <p className="text-red-500 text-xs">
                    ⚠️ {errors.deathWitness2Telefone}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? "⏳ Saving..." : "➕ Register Death"}
            </button>
          </form>
        )}

        {/* USERS TABLE */}
        {tab === "USERS" && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 text-sm">Username</th>
                    <th className="text-left p-3 text-sm">Email</th>
                    <th className="text-left p-3 text-sm">Role</th>
                    <th className="text-left p-3 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-semibold">{u.username}</td>
                      <td className="p-3 text-sm text-gray-600">{u.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            u.role === "ADMIN"
                              ? "bg-yellow-400 text-blue-900"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {u.role !== "ADMIN" && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RECORDS LIST */}
        {(tab === "BIRTH" || tab === "DEATH") && (
          <>
            <h2 className="text-xl font-bold mb-3">
              📋 Records ({filteredAbantu.length})
            </h2>
            <div className="space-y-2">
              {filteredAbantu.map((u) => (
                <div
                  key={u.id}
                  className={`border-l-4 p-3 bg-white shadow rounded ${
                    u.ubwoko === "BIRTH"
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="font-bold">
                        {u.ubwoko === "BIRTH" ? "👶" : "⚰️"} {u.amazina}{" "}
                        {u.igitsina && `(${u.igitsina})`}
                      </p>
                      {u.numeroYIvuko && (
                        <p className="text-sm text-green-700 font-semibold">
                          📜 Cert No: {u.numeroYIvuko}
                        </p>
                      )}
                      {u.indangamuntu && (
                        <p className="text-sm text-gray-600">
                          ID: {u.indangamuntu}
                        </p>
                      )}
                      {u.mamaAmazina && (
                        <p className="text-xs text-gray-500">
                          👩 Mother: {u.mamaAmazina} | 📞 {u.mamaTelefone}
                        </p>
                      )}
                      {u.yasezeranye === "Yego" && u.papaAmazina && (
                        <p className="text-xs text-gray-500">
                          👨 Father: {u.papaAmazina} | 📞 {u.papaTelefone}
                        </p>
                      )}
                      {u.ahoYavukiye && (
                        <p className="text-xs text-gray-500">
                          Born: {u.ahoYavukiye} ({u.itarikiYavukiye})
                        </p>
                      )}
                      {u.ahoYapfiriye && (
                        <p className="text-xs text-gray-500">
                          Died: {u.ahoYapfiriye} ({u.itarikiYapfiriye})
                        </p>
                      )}
                      {u.witness1Amazina && (
                        <p className="text-xs text-gray-500">
                          🧑‍🤝‍🧑 Witnesses: {u.witness1Amazina},{" "}
                          {u.witness2Amazina}
                        </p>
                      )}
                      {u.deathWitness1Amazina && (
                        <p className="text-xs text-gray-500">
                          🧑‍🤝‍🧑 Death Witnesses: {u.deathWitness1Amazina},{" "}
                          {u.deathWitness2Amazina}
                        </p>
                      )}
                      {u.aiIcyifuzo && (
                        <div className="text-xs mt-2 text-blue-700 bg-blue-50 p-2 rounded whitespace-pre-line">
                          🤖 AI: {u.aiIcyifuzo}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handlePDF(u)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUmuntu(u.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center sticky top-0">
              <h2 className="text-lg font-bold">✏️ Edit Record</h2>
              <button onClick={() => setEditing(null)} className="text-2xl">
                ✖
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Full Name
                </label>
                <input
                  name="amazina"
                  value={editForm.amazina || ""}
                  onChange={handleEditChange}
                  className="w-full border p-3 rounded"
                />
              </div>

              {editForm.ubwoko === "BIRTH" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Birth Certificate No.
                    </label>
                    <input
                      name="numeroYIvuko"
                      value={editForm.numeroYIvuko || ""}
                      onChange={handleEditChange}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="itarikiYavukiye"
                      value={editForm.itarikiYavukiye || ""}
                      onChange={handleEditChange}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Mother's Name
                    </label>
                    <input
                      name="mamaAmazina"
                      value={editForm.mamaAmazina || ""}
                      onChange={handleEditChange}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Mother's Phone
                    </label>
                    <input
                      name="mamaTelefone"
                      value={editForm.mamaTelefone || ""}
                      onChange={handleEditChange}
                      maxLength={10}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Father's Name
                    </label>
                    <input
                      name="papaAmazina"
                      value={editForm.papaAmazina || ""}
                      onChange={handleEditChange}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Place of Birth
                    </label>
                    <input
                      name="ahoYavukiye"
                      value={editForm.ahoYavukiye || ""}
                      onChange={handleEditChange}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                </>
              )}

              {editForm.ubwoko === "DEATH" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      National ID
                    </label>
                    <input
                      name="indangamuntu"
                      value={editForm.indangamuntu || ""}
                      onChange={handleEditChange}
                      maxLength={16}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Date of Death
                    </label>
                    <input
                      type="date"
                      name="itarikiYapfiriye"
                      value={editForm.itarikiYapfiriye || ""}
                      onChange={handleEditChange}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Place of Death
                    </label>
                    <input
                      name="ahoYapfiriye"
                      value={editForm.ahoYapfiriye || ""}
                      onChange={handleEditChange}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Cause of Death
                    </label>
                    <input
                      name="impamvuYurupfu"
                      value={editForm.impamvuYurupfu || ""}
                      onChange={handleEditChange}
                      className="w-full border p-3 rounded"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  {loading ? "⏳ Saving..." : "💾 Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-6 py-3 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}