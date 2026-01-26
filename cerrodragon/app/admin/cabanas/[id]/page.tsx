"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SideBarAdmin, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface AccommodationAPI {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  price: number | null;
  image_url: string | null;
}

/* =====================
   PAGE
===================== */

export default function ModificarAlojamiento() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [colones, setColones] = useState("");
  const [personas, setPersonas] = useState("");

  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenActual, setImagenActual] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  /* =====================
     FETCH ALOJAMIENTO
  ===================== */
  useEffect(() => {
    const fetchAlojamiento = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API_URL}/accomodations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error cargando alojamiento");

        const json = await res.json();
        const data: AccommodationAPI = json.data;

        setNombre(data.name);
        setDescripcion(data.description ?? "");
        setPersonas(String(data.capacity));
        setColones(data.price ? String(data.price) : "");
        setImagenActual(data.image_url);
      } catch (err) {
        console.error(err);
        setError("Error cargando la información del alojamiento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlojamiento();
  }, [id]);

  /* =====================
     IMAGE
  ===================== */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const displayImage = imagen
    ? URL.createObjectURL(imagen)
    : imagenActual || "/tour3.png";

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre de la cabaña es requerido");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let imageUrl = imagenActual;

      /* =====================
         1. SUBIR IMAGEN (opcional)
      ===================== */
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
          throw new Error(imgJson.message || "Error subiendo imagen");
        }

        imageUrl = `${API_URL}${imgJson.file.path}`;
      }

      /* =====================
         2. UPDATE ALOJAMIENTO
      ===================== */
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/accomodations/${id}`, {
        method: "PUT",
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
        throw new Error(json.message || "Error actualizando alojamiento");
      }

      router.push("/admin/cabanas");
    } catch (err) {
      console.error(err);
      setError(
        "Error al actualizar la cabaña. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================
     RENDER
  ===================== */
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
                Modificar Alojamiento
              </h1>
              <p className="mb-8 text-verde3">
                Actualizar los datos de una cabaña
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
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ingrese nombre aquí"
                        disabled={isLoading}
                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block mb-2.5 text-md font-medium text-black">
                        Descripción
                      </label>
                      <textarea
                        rows={4}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción del alojamiento"
                        disabled={isLoading}
                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2.5 text-md font-medium text-black">
                          Colones por persona por noche
                        </label>
                        <input
                          type="number"
                          value={colones}
                          onChange={(e) => setColones(e.target.value)}
                          placeholder="5000"
                          disabled={isLoading}
                          min="0"
                          className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                          rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                          shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block mb-2.5 text-md font-medium text-black">
                          Personas
                        </label>
                        <input
                          type="number"
                          value={personas}
                          onChange={(e) => setPersonas(e.target.value)}
                          placeholder="4"
                          disabled={isLoading}
                          min="1"
                          className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                          rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                          shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div>
                    <label className="block mb-2.5 text-md font-medium text-black">
                      Imagen
                    </label>
                    <div className="border-2 border-borde1 rounded-xl h-64 bg-tabla-header overflow-hidden relative">
                      <img
                        src={displayImage}
                        alt="Alojamiento"
                        className="w-full h-full object-cover"
                      />
                      <label
                        htmlFor="imagen-upload"
                        className="absolute bottom-2 right-2 bg-verde3 hover:bg-verde2 text-white px-3 py-1.5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                      >
                        Cambiar
                        <input
                          id="imagen-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </label>
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
                    onClick={() => router.push("/admin/cabanas")}
                    disabled={isLoading}
                    className="mt-1 text-verde3 bg-white hover:bg-gray-50 font-medium rounded-xl 
                    text-md px-5 py-2.5 text-center border border-verde3"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                    text-md px-5 py-2.5 text-center disabled:opacity-50"
                  >
                    {isLoading ? "Guardando..." : "Guardar"}
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
