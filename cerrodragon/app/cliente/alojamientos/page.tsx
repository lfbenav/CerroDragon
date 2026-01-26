"use client";
import {
  SideBarClient,
  TopBar,
  WhatsAppButton,
  TablaMisAlojamientos,
} from "@/app/components";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface ReservaAPI {
  id: string;
  accommodation_name: string;
  reserved_at: string;
  start_date: string;
  end_date: string;
  persons: number;
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "REFUND_REQUESTED"
}

export interface Reserva {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  cabana: string;
  fechaReserva: string;
  fechaLlegada: string;
  fechaFinal: string;
  personas: number;
  estado: 
    | "confirmada"
    | "pendiente"
    | "cancelada"
    | "reembolsada"
    | "solicitado";
}

/* =====================
   PAGE
===================== */

export default function MisAlojamientos() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================
     FETCH MIS RESERVAS
  ===================== */
  useEffect(() => {
    const fetchMisReservas = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");
        const userRaw = localStorage.getItem("user");

        const userId = userRaw
          ? (JSON.parse(userRaw) as { id: string }).id
          : null;

        if (!userId) {
          throw new Error("Usuario no autenticado");
        }

        const res = await fetch(
          `${API_URL}/accomodations/my-reservations?userId=${userId}`,
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
            clienteNombre: "", // vista cliente
            clienteEmail: "",  // vista cliente
            cabana: r.accommodation_name,
            fechaReserva: new Date(r.reserved_at).toLocaleDateString("es-CR"),
            fechaLlegada: new Date(r.start_date).toLocaleDateString("es-CR"),
            fechaFinal: new Date(r.end_date).toLocaleDateString("es-CR"),
            personas: r.persons,
            estado:
                r.status === "CONFIRMED" ? "confirmada"
                : r.status === "PENDING" ? "pendiente"
                : r.status === "REFUND_REQUESTED" ? "solicitado"
                : r.status === "CANCELLED" ? "cancelada"
                : "reembolsada",
          })
        );

        setReservas(mapped);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar sus reservas");
      } finally {
        setLoading(false);
      }
    };

    fetchMisReservas();
  }, []);

  /* =====================
     PDF COMPROBANTE
  ===================== */
  const handleDescargarComprobante = async (reserva: Reserva) => {
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const verdeOscuro = [34, 87, 57];
    const grisOscuro = [51, 51, 51];

    // Header
    doc.setFillColor(...verdeOscuro);
    doc.rect(0, 0, pageWidth, 45, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("CERRO DRAGÓN", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Comprobante de Reserva de Alojamiento", pageWidth / 2, 32, {
      align: "center",
    });

    doc.setDrawColor(255, 255, 255);
    doc.line(40, 38, pageWidth - 40, 38);

    let y = 60;
    doc.setTextColor(...grisOscuro);

    // ID Reserva
    doc.setFillColor(245, 245, 245);
    doc.rect(15, y - 5, pageWidth - 30, 15, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Número de Reserva:", 20, y + 5);
    doc.setTextColor(...verdeOscuro);
    doc.text(reserva.id, pageWidth - 20, y + 5, { align: "right" });

    y += 25;
    doc.setTextColor(...grisOscuro);

    // Alojamiento
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Alojamiento", 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Cabaña: ${reserva.cabana}`, 25, y);
    y += 8;
    doc.text(`Llegada: ${reserva.fechaLlegada}`, 25, y);
    y += 8;
    doc.text(`Salida: ${reserva.fechaFinal}`, 25, y);
    y += 8;
    doc.text(`Personas: ${reserva.personas}`, 25, y);
    y += 15;

    // Estado
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Estado de la Reserva", 20, y);
    y += 10;

    const estadoTexto: Record<Reserva["estado"], string> = {
        confirmada: "CONFIRMADA",
        pendiente: "PENDIENTE",
        cancelada: "CANCELADA",
        reembolsada: "REEMBOLSADA",
        solicitado: "REEMBOLSO SOLICITADO",
        };

    const estadoColor: Record<Reserva["estado"], number[]> = {
        confirmada: [34, 139, 34],
        pendiente: [218, 165, 32],
        cancelada: [178, 34, 34],
        reembolsada: [70, 130, 180],
        solicitado: [255, 140, 0],
        };

    doc.setFillColor(...estadoColor[reserva.estado]);
    doc.roundedRect(25, y - 5, 60, 12, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(estadoTexto[reserva.estado], 55, y + 3, { align: "center" });

    y += 25;

    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(9);
    const fechaGen = new Date().toLocaleDateString("es-CR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(
      `Documento generado el ${fechaGen}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );

    doc.save(`Reserva_Alojamiento_${reserva.id}.pdf`);
  };

  const handleReembolso = async (reserva: Reserva) => {
    if (!confirm("¿Desea solicitar un reembolso?")) return;

    try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
        `http://localhost:3000/accomodations/reservations/${reserva.id}/request-refund`,
        {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        if (!res.ok) {
        throw new Error("Error al solicitar reembolso");
        }

        alert("Reembolso solicitado correctamente");
        
        window.location.reload();

        } catch (err) {
            alert("No se pudo solicitar el reembolso");
        }
    };

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="flex-shrink-0 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-3xl font-bold mb-1 text-black">
                    Mis Reservas de alojamientos
                  </h3>
                  <p className="text-verde3">
                    Revise todas sus reservas de alojamientos
                  </p>
                </div>
                <WhatsAppButton />
              </div>
              <hr className="border-1 border-borde1 w-full" />
            </div>

            {loading ? (
              <p className="text-verde3">Cargando reservas...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <TablaMisAlojamientos
                reservas={reservas}
                onDescargarComprobante={handleDescargarComprobante}
                onReembolso={handleReembolso}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
