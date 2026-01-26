'use client';
import { SideBarClient, TopBar, WhatsAppButton } from "@/app/components";
import { useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:3000";

export default function Consultas() {
  const [telefono, setTelefono] = useState("");
  const [consulta, setConsulta] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!telefono.trim() || !consulta.trim()) {
      alert("Debe completar todos los campos");
      return;
    }

    try {
      setLoading(true);

      const userRaw = localStorage.getItem("user");
      const token = localStorage.getItem("access_token");

      if (!userRaw || !token) {
        throw new Error("Usuario no autenticado");
      }

      const { id: userId } = JSON.parse(userRaw);

      const clientRes = await fetch(
        `${API_URL}/users/${userId}/client`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
      );

      if (!clientRes.ok) {
        throw new Error("No se pudo obtener la información del cliente");
      }

      const clientJson = await clientRes.json();
      const clienteNombre = clientJson.data.full_name;

      const res = await fetch(`${API_URL}/others/consultations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            customer_name: clienteNombre, // 👈 AHORA SÍ
            phone: telefono,
            message: consulta,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al enviar la consulta");
      }

      alert("Consulta enviada correctamente");
      setTelefono("");
      setConsulta("");
    } catch (err) {
      console.error(err);
      alert("No se pudo enviar la consulta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                    Consultas
                  </h1>
                  <p className="mb-4 text-verde3">
                    Envíe sus consultas y lo contactaremos con la respuesta, o
                    escríbanos directamente al WhatsApp.
                  </p>
                </div>
                <WhatsAppButton />
              </div>
              <hr className="border-1 border-borde1 my-4 w-full" />
            </div>

            <div className="flex-1 flex flex-row justify-between mb-6 gap-8">
              {/* FORM */}
              <form onSubmit={handleSubmit} className="max-w-xl w-full">
                <label className="block mb-2.5 text-md font-medium text-black">
                  Número de teléfono de contacto:
                </label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                  rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                  shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                  placeholder="8888-8888"
                />

                <label className="block mt-4 mb-2.5 text-md font-medium text-black">
                  Consulta:
                </label>
                <textarea
                  rows={4}
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl 
                  focus:ring-verde2 focus:border-verde2 block w-full p-3.5 shadow-xs 
                  placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                  placeholder="Escriba su consulta aquí..."
                />

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                    text-md px-5 py-2.5 text-center flex items-center justify-center gap-2
                    disabled:opacity-50"
                  >
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {loading ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>

              {/* FAQ */}
              <Link href="/cliente/preguntas" className="self-start">
                <button className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl text-md px-5 py-2.5 text-center flex items-center justify-center gap-2">
                    <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z"
                        />
                    </svg>
                    Preguntas frecuentes
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
