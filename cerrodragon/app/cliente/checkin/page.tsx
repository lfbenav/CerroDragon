"use client";

import { useState } from "react";
import { SideBarClient, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

export default function CheckinCliente() {
  const [code, setCode] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [phone, setPhone] = useState("");

  const [loadingForm, setLoadingForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // =========================
  // VALIDAR CÓDIGO
  // =========================
  const handleValidateCode = async () => {
    if (!code.trim()) {
      setError("Debe ingresar un código");
      return;
    }

    setLoadingForm(true);
    setError(null);
    setSuccess(false);

    try {
      // Solo validamos que exista y esté activo
      const res = await fetch(
        `${API_URL}/checkin/formularios/${encodeURIComponent(code.trim())}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Código inválido o formulario cerrado");
      }

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Formulario inválido");
      }

      setFormValid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al validar código");
      setFormValid(false);
    } finally {
      setLoadingForm(false);
    }
  };

  // =========================
  // ENVIAR CHECK-IN
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participantName.trim()) {
      setError("El nombre es requerido");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/checkin/formularios/${encodeURIComponent(code)}/entries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participant_name: participantName.trim(),
            phone: phone.trim() || null,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al registrar check-in");
      }

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Error al guardar");
      }

      setSuccess(true);
      setParticipantName("");
      setPhone("");
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
                Registro de Check-in
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
                placeholder="CK-101"
                className="flex-1 bg-tabla-header border border-borde1 text-heading 
                           rounded-xl px-3 py-2.5 shadow-xs text-black"
                disabled={loadingForm || submitting}
              />

              <button
                type="button"
                onClick={handleValidateCode}
                disabled={loadingForm}
                className="px-4 py-2 rounded-xl bg-verde3 text-white hover:bg-verde2"
              >
                {loadingForm ? "Validando..." : "Validar"}
              </button>
            </div>

            {/* Formulario */}
            {formValid && (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <input
                  type="text"
                  placeholder="Nombre del participante"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full bg-tabla-header border border-borde1 text-heading 
                             rounded-xl px-3 py-2.5 shadow-xs text-black"
                />

                <input
                  type="text"
                  placeholder="Teléfono (opcional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-tabla-header border border-borde1 text-heading 
                             rounded-xl px-3 py-2.5 shadow-xs text-black"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-verde3 text-white rounded-xl px-6 py-2.5 hover:bg-verde2"
                  >
                    {submitting ? "Registrando..." : "Registrar Check-in"}
                  </button>
                </div>
              </form>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && (
              <p className="text-green-600 mt-4">
                Check-in registrado correctamente ✔
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
