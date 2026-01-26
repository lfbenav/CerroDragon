"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SideBarClient, TopBar } from "../../components";

/* =========================
   ICON
========================= */

function PencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================
   TYPES
========================= */

type ClienteProfile = {
  nombre: string;
  correo: string;
  telefono: string;
};

/* =========================
   CONSTS
========================= */

const API_URL = "http://localhost:3000";

/* =========================
   PAGE
========================= */

export default function PerfilClientePage() {
  const router = useRouter();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [cliente, setCliente] = useState<ClienteProfile | null>(null);

  const [editingNombre, setEditingNombre] = useState(false);
  const [editingCorreo, setEditingCorreo] = useState(false);
  const [editingTelefono, setEditingTelefono] = useState(false);

  /* =========================
     LOAD USER ID
  ========================== */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUserId(parsed.id);
  }, []);

  /* =========================
     FETCH CLIENT
  ========================== */
  useEffect(() => {
    if (!userId) return;

    const fetchClient = async () => {
      const res = await fetch(`${API_URL}/users/${userId}/client`);
      const json = await res.json();

      setCliente({
        nombre: json.data.full_name,
        correo: json.data.email,
        telefono: json.data.phone || "",
      });
    };

    fetchClient();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  /* =========================
     SAVE
  ========================== */
  const saveChanges = async (next: ClienteProfile) => {
    if (!userId) return;

    setCliente(next);

    await fetch(`${API_URL}/users/${userId}/client`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: next.nombre,
        email: next.correo,
        phone: next.telefono,
      }),
    });
  };

  if (!cliente) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <SideBarClient />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 ml-72 pt-20 px-8">
            <p className="text-sm text-verde3">Cargando perfil...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-serif text-black">
                    Información del Cliente
                  </h1>
                  <p className="mt-1 text-md text-verde2">
                    Información personal del cliente
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                    >Cerrar Sesión
                  </button>

                  <Link
                    href="/cliente/alojamientos"
                    className="px-5 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                  >
                    Alojamientos
                  </Link>

                  <Link
                    href="/cliente/reservas"
                    className="px-5 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                  >
                    Reservas
                  </Link>
                </div>
              </div>

              <div className="border-b border-black/20" />
            </div>

            {/* Content */}
            <div className="pt-8">
              {/* Nombre */}
              <div className="flex items-center gap-3">
                {editingNombre ? (
                  <input
                    autoFocus
                    value={cliente.nombre}
                    onChange={(e) =>
                      setCliente({ ...cliente, nombre: e.target.value })
                    }
                    onBlur={() => {
                      saveChanges(cliente);
                      setEditingNombre(false);
                    }}
                    className="text-3xl font-serif bg-beige2 border border-borde2 rounded-md px-3 py-1 text-black outline-none focus:ring-2 focus:ring-verde2"
                  />
                ) : (
                  <h2 className="text-3xl font-serif text-black">
                    {cliente.nombre}
                  </h2>
                )}

                <button
                  onClick={() => setEditingNombre(true)}
                  className="text-black/70 hover:text-black"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-10 space-y-6">
                {/* Correo */}
                <div className="flex items-center gap-3">
                  <p className="text-black font-bold">
                    Correo electrónico:
                  </p>

                  {editingCorreo ? (
                    <input
                      autoFocus
                      value={cliente.correo}
                      onChange={(e) =>
                        setCliente({ ...cliente, correo: e.target.value })
                      }
                      onBlur={() => {
                        saveChanges(cliente);
                        setEditingCorreo(false);
                      }}
                      className="bg-beige2 border border-borde2 rounded-md px-3 py-1 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
                    />
                  ) : (
                    <span className="text-black">
                      {cliente.correo}
                    </span>
                  )}

                  <button
                    onClick={() => setEditingCorreo(true)}
                    className="text-black/70 hover:text-black"
                  >
                    <PencilIcon />
                  </button>
                </div>

                {/* Teléfono */}
                <div className="flex items-center gap-3">
                  <p className="text-black font-bold">Teléfono:</p>

                  {editingTelefono ? (
                    <input
                      autoFocus
                      value={cliente.telefono}
                      onChange={(e) =>
                        setCliente({ ...cliente, telefono: e.target.value })
                      }
                      onBlur={() => {
                        saveChanges(cliente);
                        setEditingTelefono(false);
                      }}
                      className="bg-beige2 border border-borde2 rounded-md px-3 py-1 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
                    />
                  ) : (
                    <span className="text-black">
                      {cliente.telefono}
                    </span>
                  )}

                  <button
                    onClick={() => setEditingTelefono(true)}
                    className="text-black/70 hover:text-black"
                  >
                    <PencilIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1" />
          </div>
        </main>
      </div>
    </div>
  );
}
