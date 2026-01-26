"use client";

import {
  ImageUpload,
  SideBarAdmin,
  TopBar,
  ConfirmModal,
} from "@/app/components";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = "http://localhost:3000";

export default function NewPunto() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagen, setImagen] = useState<File | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const router = useRouter();

  /* =====================
     VALIDATION
  ===================== */
  const nombreValid = nombre.trim().length >= 3;
  const descripcionValid = descripcion.trim().length >= 10;
  const direccionValid =
    direccion.trim().length >= 10 &&
    (direccion.includes("google") ||
      direccion.includes("waze") ||
      direccion.includes("maps"));

  const canSubmit = !isLoading && nombreValid && descripcionValid && direccionValid;

  /* =====================
     HANDLERS
  ===================== */

  const requestCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const cancelCreate = () => setConfirmOpen(false);

  const confirmCreate = async () => {
    setConfirmOpen(false);
    setIsLoading(true);

    try {
      let imageUrl: string | null = null;

      /* =====================
         1. UPLOAD IMAGE
      ===================== */
      if (imagen) {
        const formData = new FormData();
        formData.append("image", imagen);

        const imgRes = await fetch(
          `${API_URL}/images/upload/meeting-points`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imgJson = await imgRes.json();

        if (!imgRes.ok) {
          throw new Error(imgJson.message || "Error al subir imagen");
        }

        imageUrl = `${API_URL}${imgJson.file.path}`;
      }

      /* =====================
         2. CREATE MEETING POINT
      ===================== */
      const res = await fetch(`${API_URL}/others/meeting-points`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre.trim(),
          description: descripcion.trim(),
          link: direccion.trim(),
          image_url: imageUrl,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Error creando punto de encuentro");
      }

      router.push("/admin/puntos");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Error creando punto de encuentro"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h1 className="text-3xl font-serif text-black">
                    Nuevo Punto de Encuentro
                  </h1>
                  <p className="text-verde3 mb-4">
                    Complete la información del nuevo punto de encuentro
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                >
                  <BackIcon />
                  Volver
                </button>
              </div>
              <div className="border-b border-black/20" />
            </div>

            {/* Form */}
            <div className="flex-1 flex justify-start mt-6">
              <form onSubmit={requestCreate} className="min-w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left */}
                  <div>
                    <label className="block mb-2.5 text-md font-medium text-black">
                      Nombre del punto de encuentro:
                    </label>
                    <input
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Uruca"
                      maxLength={60}
                      disabled={isLoading}
                      className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl block w-full px-3 py-2.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                    />
                    {nombre.length > 0 && !nombreValid && (
                      <p className="text-xs text-rojovino mt-1">
                        El nombre debe tener al menos 3 caracteres.
                      </p>
                    )}

                    <label className="block mt-4 mb-2.5 text-md font-medium text-black">
                      Descripción del punto de encuentro:
                    </label>
                    <textarea
                      rows={4}
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      maxLength={300}
                      disabled={isLoading}
                      placeholder="Escriba la descripción aquí..."
                      className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl block w-full p-3.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                    />
                    {descripcion.length > 0 && !descripcionValid && (
                      <p className="text-xs text-rojovino mt-1">
                        La descripción debe tener al menos 10 caracteres.
                      </p>
                    )}

                    <label className="block mt-4 mb-2.5 text-md font-medium text-black">
                      Dirección al punto de encuentro (Google Maps / Waze):
                    </label>
                    <input
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="https://share.google/..."
                      maxLength={200}
                      disabled={isLoading}
                      className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl block w-full px-3 py-2.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                    />
                    {direccion.length > 0 && !direccionValid && (
                      <p className="text-xs text-rojovino mt-1">
                        Debe ingresar un enlace válido de Google Maps o Waze.
                      </p>
                    )}
                  </div>

                  {/* Right */}
                  <div>
                    <ImageUpload imagen={imagen} onImageChange={setImagen} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isLoading}
                    className="mt-1 text-verde3 bg-white hover:bg-gray-50 font-medium rounded-xl text-md px-5 py-2.5 border border-verde3"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={[
                      "mt-1 font-medium rounded-xl text-md px-5 py-2.5 flex items-center gap-2 transition",
                      canSubmit
                        ? "text-white bg-verde3 hover:bg-verde2"
                        : "bg-black/20 text-black/50 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {isLoading ? "Guardando..." : "Agregar"}
                  </button>
                </div>
              </form>
            </div>

            {/* Confirm modal */}
            <ConfirmModal
              open={confirmOpen}
              title="Crear punto de encuentro"
              message={`¿Desea crear este punto de encuentro?\n\nNombre: ${nombre}\nDescripción: ${descripcion.slice(
                0,
                50
              )}${descripcion.length > 50 ? "..." : ""}`}
              confirmText="Crear"
              cancelText="Cancelar"
              confirmVariant="primary"
              onConfirm={confirmCreate}
              onCancel={cancelCreate}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
