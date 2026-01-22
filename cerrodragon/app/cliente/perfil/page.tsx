"use client";

import Link from "next/link";
import { SideBarClient, TopBar } from "../../components";

function PencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
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

export default function PerfilClientePage() {
  // Placeholder data (later you can load from API)
  const cliente = {
    correo: "cliente@gmail.com",
    telefono: "8888-8885",
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Header row */}
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

                {/* Buttons (right) */}
                <div className="flex items-center gap-3 pt-2">
                  <button className="px-5 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95">
                    Cerrar Sesión
                  </button>

                  <Link
                    href="/client/alojamientos"
                    className="px-5 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                  >
                    Alojamientos
                  </Link>

                  <Link
                    href="/client/reservas"
                    className="px-5 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                  >
                    Reservas
                  </Link>
                </div>
              </div>

              {/* Divider */}
              <div className="border-b border-black/20" />
            </div>

            {/* Content section */}
            <div className="pt-8">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-serif text-black">Cliente</h2>
                <button
                  type="button"
                  className="text-black/70 hover:text-black"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-10 space-y-6">
                {/* Correo */}
                <div className="flex items-center gap-3">
                  <p className="text-black">
                    <span className="font-bold">Correo electrónico:</span>{" "}
                    <span>{cliente.correo}</span>
                  </p>
                  <button
                    type="button"
                    className="text-black/70 hover:text-black"
                  >
                    <PencilIcon />
                  </button>
                </div>

                {/* Teléfono */}
                <div className="flex items-center gap-3">
                  <p className="text-black">
                    <span className="font-bold">Teléfono:</span>{" "}
                    <span>{cliente.telefono}</span>
                  </p>
                  <button
                    type="button"
                    className="text-black/70 hover:text-black"
                  >
                    <PencilIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* (optional) push content to top like screenshot */}
            <div className="flex-1" />
          </div>
        </main>
      </div>
    </div>
  );
}
