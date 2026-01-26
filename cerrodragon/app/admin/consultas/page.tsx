'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  SideBarAdmin,
  TopBar,
  SearchBar,
  TablaConsultas,
  Cuadro
} from "@/app/components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface ConsultaAPI {
  id: string;
  customer_name: string;
  phone: string;
  message: string;
  created_at: string;
  status: 'PENDING' | 'RESOLVED';
}

interface ConsultaProps {
  id: string;
  clienteNombre: string;
  telefono: string;
  consulta: string;
  fecha: string;
  estado: 'pendiente' | 'resuelta';
}

/* =====================
   PAGE
===================== */

export default function ConsultasAdmin() {
  const [consultas, setConsultas] = useState<ConsultaProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* =====================
     FETCH CONSULTAS
  ===================== */
  useEffect(() => {
    const loadConsultas = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API_URL}/others/consultations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al cargar consultas");
        }

        const json = await res.json();

        const mapped: ConsultaProps[] = json.data.map(
          (c: ConsultaAPI): ConsultaProps => ({
            id: c.id,
            clienteNombre: c.customer_name,
            telefono: c.phone,
            consulta: c.message,
            fecha: new Date(c.created_at).toLocaleDateString("es-CR"),
            estado: c.status === "PENDING" ? "pendiente" : "resuelta",
          })
        );

        setConsultas(mapped);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las consultas");
      } finally {
        setLoading(false);
      }
    };

    loadConsultas();
  }, []);

  /* =====================
     MARCAR RESUELTA
  ===================== */
  const handleMarcarResuelta = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${API_URL}/others/consultations/${id}/resolve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al marcar consulta como resuelta");
      }

      setConsultas(prev =>
        prev.map(c =>
          c.id === id ? { ...c, estado: "resuelta" } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo marcar la consulta como resuelta");
    }
  };

  /* =====================
     FILTRO SEARCH
  ===================== */
  const consultasFiltradas = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return consultas;

    return consultas.filter(c =>
      c.clienteNombre.toLowerCase().includes(q) ||
      c.telefono.includes(q) ||
      c.consulta.toLowerCase().includes(q)
    );
  }, [consultas, search]);

  /* =====================
     MÉTRICAS
  ===================== */
  const consultasPendientes = consultas.filter(
    c => c.estado === "pendiente"
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
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Gestión de Consultas
              </h1>
              <p className="mb-4 text-verde3">
                Administre las consultas de los clientes y contacte vía WhatsApp
              </p>

              <div className="flex gap-6 mb-6">
                <Cuadro
                  texto="Consultas Pendientes"
                  cantidad={consultasPendientes.length}
                />
                <Cuadro
                  texto="Total de Consultas"
                  cantidad={consultas.length}
                />
              </div>

              <SearchBar
                texto="Buscar consultas..."
                value={search}
                onChange={setSearch}
              />

              <div className="border-b border-black/20 mb-2" />
            </div>

            {loading ? (
              <p className="text-verde3 mt-6">Cargando consultas...</p>
            ) : error ? (
              <p className="text-red-500 mt-6">{error}</p>
            ) : (
              <TablaConsultas
                consultas={consultasFiltradas}
                onMarcarResuelta={handleMarcarResuelta}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
