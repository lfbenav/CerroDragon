'use client';
import { CuadroTexto, SideBarAdmin, TopBar } from "@/app/components";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

type EstadoReserva = "confirmada" | "cancelada";

interface ReservaAPI {
  id: string;
  start_date: string;
  end_date: string;
  persons: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  accommodation_name: string;
  customer_name: string;
  customer_email: string;
}

interface ReservaData {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  cabana: string;
  fechaInicio: string;
  fechaFinal: string;
  personas: number;
  estado: EstadoReserva;
}

/* =====================
   PAGE
===================== */

export default function EditarReservas() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reservaId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reserva, setReserva] = useState<ReservaData | null>(null);
  const [estado, setEstado] = useState<EstadoReserva>("confirmada");

  /* =====================
     FETCH RESERVA
  ===================== */
  useEffect(() => {
    if (!reservaId) {
      setError("ID de reserva no válido");
      setLoading(false);
      return;
    }

    const fetchReserva = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `${API_URL}/accomodations/reservations/${reservaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Error al cargar la reserva");
        }

        const json = await res.json();
        const r: ReservaAPI = json.data;

        const mapped: ReservaData = {
          id: r.id,
          clienteNombre: r.customer_name,
          clienteEmail: r.customer_email,
          cabana: r.accommodation_name,
          fechaInicio: new Date(r.start_date).toLocaleDateString("es-CR"),
          fechaFinal: new Date(r.end_date).toLocaleDateString("es-CR"),
          personas: r.persons,
          estado: r.status === "CONFIRMED" ? "confirmada" : "cancelada",
        };

        setReserva(mapped);
        setEstado(mapped.estado);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información de la reserva");
      } finally {
        setLoading(false);
      }
    };

    fetchReserva();
  }, [reservaId]);

  /* =====================
     GUARDAR (CONFIRM / CANCEL)
  ===================== */
  const handleGuardar = async () => {
    if (!reserva) return;

    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem("access_token");

      const endpoint =
        estado === "confirmada"
          ? "confirm"
          : "cancel";

      const res = await fetch(
        `${API_URL}/accomodations/reservations/${reserva.id}/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al actualizar la reserva");
      }

      router.push("/admin/alojamientos");
    } catch (err) {
      console.error(err);
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  /* =====================
     RENDER
  ===================== */

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <SideBarAdmin />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex items-center justify-center ml-72 pt-20">
            <p className="text-verde3">Cargando información de la reserva...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <SideBarAdmin />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex items-center justify-center ml-72 pt-20">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error || "No se pudo cargar la reserva"}
              </p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-verde2 text-white rounded-lg"
              >
                Volver
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-bold mb-4 text-black">
              Editar reserva #{reserva.id}
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <CuadroTexto titulo="Cliente" texto={reserva.clienteNombre} />
              <CuadroTexto titulo="Cabaña" texto={reserva.cabana} />
              <CuadroTexto
                titulo="Fechas"
                texto={`${reserva.fechaInicio} - ${reserva.fechaFinal}`}
              />
              <CuadroTexto
                titulo="Personas"
                texto={reserva.personas.toString()}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-verde1">
                Estado de la reserva
              </label>
              <select
                value={estado}
                onChange={(e) =>
                  setEstado(e.target.value as EstadoReserva)
                }
                className="block w-full px-3 py-2.5 bg-beigeclaro border border-verde3 text-verde1 rounded-lg"
                disabled={saving}
              >
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleGuardar}
                disabled={saving}
                className="px-4 py-2 bg-verde2 text-white rounded-lg hover:bg-verde3 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>

              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-verde3 text-verde3 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
