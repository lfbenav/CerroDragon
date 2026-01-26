"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SideBarAdmin, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

export default function AgregarAlojamiento() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [colones, setColones] = useState("");
  const [personas, setPersonas] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre de la cabaña es requerido");
      return;
    }

    if (!personas || Number(personas) <= 0) {
      setError("La capacidad debe ser mayor a 0");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let imageUrl: string | null = null;

      /* =========================
         1. SUBIR IMAGEN (si existe)
      ========================== */
      if (imagen) {
        const formData = new FormData();
        formData.append("image", imagen);

        const imgRes = await fetch(
          `${API_URL}/images/upload/accomodations`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imgJson = await imgRes.json();

        if (!imgRes.ok) {
          throw new Error(
            imgJson.message || "Error al subir la imagen"
          );
        }

        imageUrl = `${API_URL}${imgJson.file.path}`;
      }

      /* =========================
         2. CREAR ALOJAMIENTO
      ========================== */
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/accomodations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nombre.trim(),
          description: descripcion.trim() || null,
          capacity: Number(personas),
          price: colones ? Number(colones) : null,
          image_url: imageUrl,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || "Error al crear el alojamiento"
        );
      }

      router.push("/admin/cabanas");
    } catch (err) {
      console.error(err);
      setError(
        "Error al guardar la cabaña. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Agregar Alojamiento
              </h1>
              <p className="mb-8 text-verde3">
                Registrar los datos de una cabaña
              </p>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2.5 text-md font-medium text-black">
                        Nombre de la Cabaña
                      </label>
                      <input
                        value={nombre}
                        placeholder="Ingrese un nombre para la cabaña"
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={isLoading}
                        className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl block w-full px-3 py-2.5"
                      />
                    </div>

                    <div>
                      <label className="block mb-2.5 text-md font-medium text-black">
                        Descripción
                      </label>
                      <textarea
                        rows={4}
                        value={descripcion}
                        onChange={(e) =>
                          setDescripcion(e.target.value)
                        }
                        disabled={isLoading}
                        placeholder="Ingrese una descripción atractiva para la cabaña"
                        className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl block w-full px-3 py-2.5 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2.5 text-md font-medium text-black">
                          Colones por persona por noche
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={colones}
                          onChange={(e) =>
                            setColones(e.target.value)
                          }
                          disabled={isLoading}
                          placeholder="Ingrese el precio en colones"
                          className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl block w-full px-3 py-2.5"
                        />
                      </div>

                      <div>
                        <label className="block mb-2.5 text-md font-medium text-black">
                          Personas
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={personas}
                          onChange={(e) =>
                            setPersonas(e.target.value)
                          }
                          disabled={isLoading}
                          placeholder="Ingrese la cantidad máxima de personas"
                          className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl block w-full px-3 py-2.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div>
                    <label className="block mb-2.5 text-md font-medium text-black">
                      Imagen
                    </label>
                    <div className="border-2 border-dashed border-borde1 rounded-xl h-64 flex items-center justify-center bg-tabla-header">
                      {imagen ? (
                        <div className="text-center">
                          <img
                            src={URL.createObjectURL(imagen)}
                            alt="Preview"
                            className="max-h-56 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setImagen(null)}
                            className="mt-2 text-sm text-red-500"
                          >
                            Eliminar imagen
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer text-verde2">
                          Haga clic para subir imagen
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isLoading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="flex justify-end space-x-4 pb-8">
                  <button
                    type="button"
                    onClick={() =>
                      router.push("/admin/cabanas")
                    }
                    disabled={isLoading}
                    className="border border-verde3 px-5 py-2.5 rounded-xl text-verde3"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-verde3 text-white px-5 py-2.5 rounded-xl disabled:opacity-50"
                  >
                    {isLoading ? "Guardando..." : "Añadir"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
