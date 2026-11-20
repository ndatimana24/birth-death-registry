import { useState, useEffect } from "react";
import {
  wandikaUmwana,
  andikuzaUwapfuye,
  shakishaByose,
  sibaUmuntu,
} from "../services/api";

export default function Home() {
  const [ubwoko, setUbwoko] = useState("BIRTH");
  const [abantu, setAbantu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amazina: "",
    indangamuntu: "",
    ababyeyi: "",
    ahoYavukiye: "",
    ahoYapfiriye: "",
    impamvuYurupfu: "",
  });

  const loadData = async () => {
    try {
      const res = await shakishaByose();
      setAbantu(res.data);
    } catch (err) {
      console.error("Ikibazo:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (ubwoko === "BIRTH") {
        await wandikaUmwana(form);
        alert("✅ Umwana yanditswe neza!");
      } else {
        await andikuzaUwapfuye(form);
        alert("✅ Uwapfuye yanditswe neza!");
      }
      setForm({
        amazina: "",
        indangamuntu: "",
        ababyeyi: "",
        ahoYavukiye: "",
        ahoYapfiriye: "",
        impamvuYurupfu: "",
      });
      loadData();
    } catch (err) {
      alert("❌ Ikibazo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Urabyemeza gusiba?")) return;
    try {
      await sibaUmuntu(id);
      loadData();
    } catch (err) {
      alert("❌ Ikibazo: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        🇷🇼 Ibaruwa y'Abaturage
      </h1>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setUbwoko("BIRTH")}
          className={`flex-1 py-3 rounded-lg font-semibold ${
            ubwoko === "BIRTH"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          👶 Kwandika Umwana
        </button>
        <button
          type="button"
          onClick={() => setUbwoko("DEATH")}
          className={`flex-1 py-3 rounded-lg font-semibold ${
            ubwoko === "DEATH"
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          ⚰️ Kwandukuza Uwapfuye
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white shadow p-6 rounded-lg mb-8"
      >
        <input
          name="amazina"
          value={form.amazina}
          onChange={handleChange}
          placeholder="Amazina yuzuye *"
          required
          className="w-full border p-3 rounded"
        />
        <input
          name="indangamuntu"
          value={form.indangamuntu}
          onChange={handleChange}
          placeholder="Indangamuntu"
          className="w-full border p-3 rounded"
        />
        <input
          name="ababyeyi"
          value={form.ababyeyi}
          onChange={handleChange}
          placeholder="Ababyeyi"
          className="w-full border p-3 rounded"
        />

        {ubwoko === "BIRTH" ? (
          <input
            name="ahoYavukiye"
            value={form.ahoYavukiye}
            onChange={handleChange}
            placeholder="Aho yavukiye"
            className="w-full border p-3 rounded"
          />
        ) : (
          <>
            <input
              name="ahoYapfiriye"
              value={form.ahoYapfiriye}
              onChange={handleChange}
              placeholder="Aho yapfiriye"
              className="w-full border p-3 rounded"
            />
            <input
              name="impamvuYurupfu"
              value={form.impamvuYurupfu}
              onChange={handleChange}
              placeholder="Impamvu y'urupfu"
              className="w-full border p-3 rounded"
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            ubwoko === "BIRTH"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } ${loading ? "opacity-50" : ""}`}
        >
          {loading
            ? "⏳ Turimo..."
            : ubwoko === "BIRTH"
            ? "➕ Andika Umwana"
            : "➕ Andukuza Uwapfuye"}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-3">📋 Abanditswe ({abantu.length})</h2>
      <div className="space-y-2">
        {abantu.length === 0 && (
          <p className="text-gray-500 text-center py-4">Nta muntu wanditswe.</p>
        )}
        {abantu.map((u) => (
          <div
            key={u.id}
            className={`border-l-4 p-3 bg-white shadow rounded ${
              u.ubwoko === "BIRTH" ? "border-green-500" : "border-red-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">
                  {u.ubwoko === "BIRTH" ? "👶" : "⚰️"} {u.amazina}
                </p>
                <p className="text-sm text-gray-600">
                  {u.indangamuntu && `ID: ${u.indangamuntu} | `}
                  {u.ababyeyi && `Ababyeyi: ${u.ababyeyi}`}
                </p>
                <p className="text-xs text-gray-500">
                  {u.ubwoko === "BIRTH"
                    ? `Yavukiye: ${u.ahoYavukiye || "-"} (${
                        u.itarikiYavukiye || "-"
                      })`
                    : `Yapfiriye: ${u.ahoYapfiriye || "-"} (${
                        u.itarikiYapfiriye || "-"
                      })`}
                </p>
                {u.aiIcyifuzo && (
                  <p className="text-xs mt-2 text-blue-700 bg-blue-50 p-2 rounded">
                    🤖 AI: {u.aiIcyifuzo}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(u.id)}
                className="text-red-500 hover:text-red-700 text-lg ml-2"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}