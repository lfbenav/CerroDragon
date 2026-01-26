"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SideBarClient, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface AccommodationAPI {
  id: number;
  name: string;
  price: number | null;
  capacity: number;
}

interface UserLocal {
  id: string;
  email: string;
  type: string;
}

/* =====================
   PAGE
===================== */

export default function ReservarAlojamiento() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cabanaId = searchParams.get("id");

  const [cabana, setCabana] = useState<AccommodationAPI | null>(null);
  const [user, setUser] = useState<UserLocal | null>(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [montoFinal, setMontoFinal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* =====================
     FETCH CABANA + USER
  ===================== */
  useEffect(() => {
    if (!cabanaId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/accomodations/${cabanaId}`);
        if (!res.ok) throw new Error();

        const json = await res.json();
        setCabana(json.data);

        const rawUser = localStorage.getItem("user");
        if (!rawUser) throw new Error();

        const parsedUser: UserLocal = JSON.parse(rawUser);
        setUser(parsedUser);
      } catch {
        setError("Error cargando la información de la cabaña");
      }
    };

    fetchData();
  }, [cabanaId]);

  /* =====================
     CALCULAR MONTO
  ===================== */
  useEffect(() => {
    if (!cabana || !fechaInicio || !fechaFin) {
      setMontoFinal(0);
      return;
    }

    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    if (end <= start) {
      setMontoFinal(0);
      return;
    }

    const nights =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    setMontoFinal(
      nights * cantidadPersonas * (cabana.price ?? 0)
    );
  }, [fechaInicio, fechaFin, cantidadPersonas, cabana]);

  /* =====================
     VALIDACIONES
  ===================== */
  const validateForm = (): string => {
    if (!fechaInicio || !fechaFin)
      return "Debe seleccionar las fechas";

    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today)
      return "No se permiten fechas pasadas";

    if (end <= start)
      return "La fecha de salida debe ser posterior a la de entrada";

    if (!cabana)
      return "Cabaña inválida";

    if (cantidadPersonas > cabana.capacity)
      return `Máximo ${cabana.capacity} personas`;

    if (!user)
      return "Usuario no válido";

    return "";
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token || !user) throw new Error("No autenticado");

      const res = await fetch(
        `${API_URL}/accomodations/${cabanaId}/reserve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_date: fechaInicio,
            end_date: fechaFin,
            persons: cantidadPersonas,
            userId: user.id,
          }),
        }
      );

      const json: { message?: string } = await res.json();
      if (!res.ok) throw new Error(json.message);

      router.push("/cliente/reservas");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Error al reservar");
      } else {
        setError("Error al reservar");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!cabana || !user) return null;

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-black mt-4">
              Reservar Alojamiento
            </h1>

            <p className="text-verde3 mb-6">
              {cabana.name}
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 rounded-xl border border-borde1"
            >
              {/* Cliente */}
              <div>
                <label className="block text-black font-medium mb-1">
                  Cliente
                </label>
                <div className="text-black">{user.email}</div>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-black font-medium mb-1">
                  Precio por persona por noche
                </label>
                <div className="text-2xl font-bold text-verde3">
                  ₡ {cabana.price?.toLocaleString() ?? 0}
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-black font-medium mb-1">
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-black"
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-1">
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-black"
                  />
                </div>
              </div>

              {/* Personas */}
              <div>
                <label className="block text-black font-medium mb-1">
                  Personas (máx. {cabana.capacity})
                </label>
                <input
                  type="number"
                  min={1}
                  value={cantidadPersonas}
                  onChange={(e) =>
                    setCantidadPersonas(Number(e.target.value))
                  }
                  className="w-32 border rounded-xl px-3 py-2 text-black"
                />
              </div>

              {/* Total */}
              <div className="bg-beige1 p-4 rounded-xl">
                <p className="text-verde3 font-semibold">
                  Total a pagar
                </p>
                <p className="text-4xl font-bold text-verde3">
                  ₡ {montoFinal.toLocaleString()}
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-verde3 hover:bg-verde2 text-white py-3 rounded-xl font-medium"
              >
                {isLoading ? "Procesando..." : "Reservar"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
