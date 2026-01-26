"use client";

import { useState } from "react";
import { SideBarClient, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

type MealOption = {
  id: string;
  option_name: string;
};

export default function ComidaCliente() {
  const [code, setCode] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [note, setNote] = useState("");

  const [options, setOptions] = useState<MealOption[]>([]);
  const [responsibleName, setResponsibleName] = useState<string | null>(null);

  const [loadingForm, setLoadingForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // =========================
  // Validar código
  // =========================
  const handleLoadForm = async () => {
    if (!code.trim()) {
      setError("Debe ingresar un código");
      return;
    }

    setLoadingForm(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `${API_URL}/foods/formularios/${encodeURIComponent(code.trim())}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Código inválido o formulario inactivo");
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Formulario inválido");
      }

      setResponsibleName(json.data.responsibleName);
      setOptions(json.data.options);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar formulario");
      setOptions([]);
      setResponsibleName(null);
    } finally {
      setLoadingForm(false);
    }
  };

  // =========================
  // Enviar respuesta
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participantName || !selectedOption) {
      setError("Debe completar los campos requeridos");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/foods/formularios/${encodeURIComponent(code)}/respuestas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participant_name: participantName,
            selected_option_id: selectedOption,
            note: note || null,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al enviar respuesta");
      }

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Error al guardar");
      }

      setSuccess(true);
      setParticipantName("");
      setSelectedOption("");
      setNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-black mt-4">
                Registro de preferencias de comida
              </h1>
              <p className="mb-6 text-verde3">
                Ingrese el código proporcionado por el administrador
              </p>
            </div>

            {/* Código */}
            <div className="flex gap-4 mb-6 max-w-xl">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="XV-101"
                className="flex-1 bg-tabla-header border border-borde1 text-heading 
                           rounded-xl px-3 py-2.5 shadow-xs text-black"
                disabled={loadingForm || submitting}
              />

              <button
                type="button"
                onClick={handleLoadForm}
                disabled={loadingForm}
                className="px-4 py-2 rounded-xl bg-verde3 text-white hover:bg-verde2"
              >
                {loadingForm ? "Cargando..." : "Validar"}
              </button>
            </div>

            {responsibleName && (
              <p className="text-sm text-verde3 mb-4">
                Responsable: {responsibleName}
              </p>
            )}

            {/* Formulario */}
            {options.length > 0 && (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <input
                  type="text"
                  placeholder="Nombre del participante"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full bg-tabla-header border border-borde1 text-heading 
                             rounded-xl px-3 py-2.5 shadow-xs text-black"
                />

                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full bg-tabla-header border border-borde1 text-heading 
                             rounded-xl px-3 py-2.5 shadow-xs text-black"
                >
                  <option value="">Seleccione la comida…</option>
                  {options.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.option_name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Alergias o restricciones (opcional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-tabla-header border border-borde1 text-heading 
                             rounded-xl px-3 py-2.5 shadow-xs text-black"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-verde3 text-white rounded-xl px-6 py-2.5 hover:bg-verde2"
                  >
                    {submitting ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && (
              <p className="text-green-600 mt-4">
                Preferencia registrada correctamente ✔
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
