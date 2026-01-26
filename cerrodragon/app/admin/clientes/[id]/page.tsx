"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AdminPageShell,
} from "../../../components";

import {
  TopBar,
  SideBarAdmin,
  Cuadro,
  SearchBar,
  TablaGestionReservas,
} from "@/app/components";

const API_URL = "http://localhost:3000";

/* =====================
   TIPOS API
===================== */
interface ReservaAPI {
  id: number;
  customer_id: number;
  tour_date: string;
  persons: number;
  total_usd: number;
  status: string;
  tour_title: string;
}

interface ClienteAPI {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

interface GuiaAPI {
  id: number;
  full_name: string;
  is_active: boolean;
}

/* =====================
   TIPOS UI
===================== */
interface ReservaDisplay {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  tour: string;
  monto: number;
  fecha: string;
  personas: number;
  guiaAsignado: string;
  estado: "confirmada" | "pendiente" | "reembolsada" | "cancelada";
}

interface GuiaDisplay {
  id: string;
  nombre: string;
}

/* =====================
   PAGE
===================== */
export default function ReservasClientePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = decodeURIComponent(params.id);

  const [loading, setLoading] = useState(true);

  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [customerId, setCustomerId] = useState<number | null>(null);

  const [reservas, setReservas] = useState<ReservaDisplay[]>([]);
  const [guias, setGuias] = useState<GuiaDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        /* === Cliente (user) === */
        const resCliente = await fetch(
          `${API_URL}/users/${userId}/client`,
          { headers }
        );

        if (resCliente.ok) {
          const json = await resCliente.json();
          const c: ClienteAPI = json.data;
          setClienteNombre(c.full_name);
          setClienteEmail(c.email);
          setClienteTelefono(c.phone);
        }

        /* === Customer ID === */
        const resCustomer = await fetch(
          `${API_URL}/users/${userId}/clientId`,
          { headers }
        );

        if (resCustomer.ok) {
          const json = await resCustomer.json();
          setCustomerId(json.data.id);
        }

        /* === Asignaciones de guías === */
        const assignmentMap: Record<number, string> = {};
        const resAssignments = await fetch(`${API_URL}/assign-guide`, {
          headers,
        });

        if (resAssignments.ok) {
          const json = await resAssignments.json();
          json.data.forEach(
            (a: { reservation_id: number; guide_name: string }) => {
              assignmentMap[a.reservation_id] = a.guide_name;
            }
          );
        }

        /* === Reservas del cliente === */
        const resReservas = await fetch(
          `${API_URL}/reservations/fromUser/${userId}`,
          { headers }
        );

        if (resReservas.ok) {
          const json = await resReservas.json();

          const mapped: ReservaDisplay[] = json.data.map(
            (r: ReservaAPI) => ({
              id: `RV-${r.id}`,
              clienteNombre: cOr(clienteNombre, "Cliente"),
              clienteEmail: clienteEmail ?? "",
              tour: r.tour_title,
              monto: r.total_usd,
              fecha: new Date(r.tour_date).toLocaleDateString("es-CR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              personas: r.persons,
              guiaAsignado: assignmentMap[r.id] || "",
              estado:
                r.status === "CONFIRMED"
                  ? "confirmada"
                  : r.status === "CANCELLED"
                  ? "cancelada"
                  : r.status === "REFUNDED"
                  ? "reembolsada"
                  : "pendiente",
            })
          );

          setReservas(mapped);
        }

        /* === Guías === */
        try {
          const resGuias = await fetch(`${API_URL}/guides`, { headers });
          if (resGuias.ok) {
            const json = await resGuias.json();
            const mapped: GuiaDisplay[] = json.data
              .filter((g: GuiaAPI) => g.is_active)
              .map((g: GuiaAPI) => ({
                id: `G-${g.id}`,
                nombre: g.full_name,
              }));
            setGuias(mapped);
          }
        } catch {
          setGuias([]);
        }
      } catch (err) {
        console.error("Error cargando información del cliente", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  /* =====================
     FILTRO
  ===================== */
  const filteredReservas = reservas.filter(
    (r) =>
      r.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmadas = reservas.filter(
    (r) => r.estado === "confirmada"
  ).length;

  const pendientes = reservas.filter(
    (r) => r.estado === "pendiente"
  ).length;

  /* =====================
     RENDER
  ===================== */
  if (loading) {
    return (
      <AdminPageShell
        title="Información del Cliente"
        subtitle="Información personal del cliente"
      >
        <div className="py-6 text-sm text-verde3">
          Cargando información del cliente...
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Información del Cliente"
      subtitle="Información personal del cliente"
      actions={
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
        >
          <BackIcon />
          Volver
        </button>
      }
    >
      <div className="py-6 w-full max-w-7xl">
        {/* ===== ENCABEZADO LINDO ===== */}
        <h2 className="text-2xl font-serif text-black mb-6">
          {clienteNombre}
        </h2>

        <div className="space-y-3 mb-6">
          <p className="text-black">
            <span className="font-bold">User ID:</span>{" "}
            <span>{userId}</span>
          </p>

          {customerId !== null && (
            <p className="text-black">
              <span className="font-bold">Customer ID:</span>{" "}
              <span>{customerId}</span>
            </p>
          )}

          <p className="text-black">
            <span className="font-bold">Correo electrónico:</span>{" "}
            <span>{clienteEmail}</span>
          </p>

          <p className="text-black">
            <span className="font-bold">Teléfono:</span>{" "}
            <span>{clienteTelefono}</span>
          </p>
        </div>

        {/* ===== STATS ===== */}
        <div className="justify-center items-center flex gap-12 mb-4">
          <Cuadro texto="Total de Reservas" cantidad={reservas.length} />
          <Cuadro
            texto="Reservas Confirmadas"
            cantidad={confirmadas}
          />
          <Cuadro
            texto="Reservas Pendientes"
            cantidad={pendientes}
          />
        </div>

        <SearchBar
          texto="Buscar reservas..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <TablaGestionReservas
          reservas={filteredReservas}
          guias={guias}
        />
      </div>
    </AdminPageShell>
  );
}

/* =====================
   HELPERS
===================== */
function cOr(v: string, fallback: string) {
  return v && v.trim() !== "" ? v : fallback;
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
