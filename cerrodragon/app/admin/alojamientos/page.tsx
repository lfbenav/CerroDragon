"use client";
import { useState, useEffect } from "react";
import {
  TopBar,
  TablaAlojamientosAdmin,
  SideBarAdmin,
  Cuadro,
  SearchBarAdmin,
} from "@/app/components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface ReservaAPI {
  id: string;
  customer_name: string;
  customer_email: string; // ✅ NUEVO
  accommodation_name: string;
  reserved_at: string;
  start_date: string;
  end_date: string;
  persons: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

interface Reserva {
  id: string;
  clienteNombre: string;
  clienteEmail: string; // ✅ NUEVO
  cabana: string;
  fechaReserva: string;
  fechaLlegada: string;
  fechaFinal: string;
  personas: number;
  estado: "confirmada" | "pendiente" | "reembolsada";
}

/* =====================
   PAGE
===================== */

export default function AlojamientosAdmin() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReservas();
  }, []);

  /* =====================
     FETCH RESERVAS
  ===================== */
  const fetchReservas = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${API_URL}/accomodations/reservations/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al cargar reservas");
      }

      const json = await res.json();

      const mapped: Reserva[] = json.data.map(
        (r: ReservaAPI): Reserva => ({
            id: r.id,
            clienteNombre: r.customer_name,
            clienteEmail: r.customer_email, // ✅ AQUÍ
            cabana: r.accommodation_name,
            fechaReserva: new Date(r.reserved_at).toLocaleDateString("es-CR"),
            fechaLlegada: new Date(r.start_date).toLocaleDateString("es-CR"),
            fechaFinal: new Date(r.end_date).toLocaleDateString("es-CR"),
            personas: r.persons,
            estado:
            r.status === "CONFIRMED"
                ? "confirmada"
                : r.status === "PENDING"
                ? "pendiente"
                : "reembolsada",
        })
    );

      setReservas(mapped);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las reservas");
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================
     MÉTRICAS
  ===================== */
  const reservasConfirmadas = reservas.filter(
    (r) => r.estado === "confirmada"
  ).length;

  const reservasPendientes = reservas.filter(
    (r) => r.estado === "pendiente"
  ).length;

  const reservasReembolsadas = reservas.filter(
    (r) => r.estado === "reembolsada"
  ).length;

  /* =====================
     FILTRO
  ===================== */
  const reservasFiltradas = reservas.filter(
    (r) =>
      r.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cabana.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 mb-6">
              <h3 className="text-3xl font-bold mb-1 text-black">
                Gestión de Reservas de Alojamientos
              </h3>
              <p className="text-verde3">
                Administre las reservaciones de cabañas realizadas por los
                clientes.
              </p>
              <hr className="border-1 border-borde1 mt-4 w-full" />
            </div>

            {/* Cuadros */}
            <div className="mb-6 flex gap-4">
              <Cuadro texto="Reservas Totales" cantidad={reservas.length} />
              <Cuadro texto="Confirmadas" cantidad={reservasConfirmadas} />
              <Cuadro texto="Pendientes" cantidad={reservasPendientes} />
              <Cuadro texto="Canceladas" cantidad={reservasReembolsadas} />
            </div>

            {/* Search */}
            <div className="mb-4">
              <SearchBarAdmin
                texto="Buscar reserva..."
                onChange={setSearchTerm}
              />
            </div>

            {/* Tabla */}
            {isLoading ? (
              <p className="text-verde3">Cargando reservas...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <TablaAlojamientosAdmin reservas={reservasFiltradas} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
