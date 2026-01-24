"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Debe ingresar su correo electrónico");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al enviar el código");
      }

      // Mensaje
      setSuccess("Si el correo existe, se enviará un código de recuperación");

      // Guardar el email para usarlo en change-password
      localStorage.setItem("recover_email", email);

      // Redirigir a la pantalla donde se ingresa el código y nueva contraseña
      window.location.href = "/login/change-password";

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al enviar el código";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <Image src="/imagen.png" alt="Cerro Dragón" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 via-transparent to-transparent" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <section className="text-white text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Recuperar{" "}
              <span className="text-amber-400">Contraseña</span>
            </h1>
            <p className="mt-5 max-w-xl text-white/90">
              Ingrese su correo electrónico y le enviaremos los pasos necesarios
              para restablecer su contraseña
            </p>
          </section>
          <section className="flex lg:justify-end">
            <div className="w-full max-w-md rounded-xl border border-sky-400/70 bg-black/25 backdrop-blur-sm p-6 text-white">
              <form className="space-y-4" onSubmit={handleRecover}>
                {/* Email */}
                <div>
                  <label className="block text-md mb-1 text-white/90">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su correo electrónico"
                    className="w-full rounded-md border border-white/45 bg-white/10 px-3 py-2 outline-none placeholder:text-white/55 focus:border-white"
                  />
                </div>

                {/* ERROR */}
                {error && (
                  <p className="text-sm text-red-300 text-center">
                    {error}
                  </p>
                )}

                {/* SUCCESS */}
                {success && (
                  <p className="text-sm text-green-300 text-center">
                    {success}
                  </p>
                )}

                {/* BOTÓN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-amber-400 text-black font-semibold py-2 hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Enviar Código"}
                </button>

                {/* LINK LOGIN */}
                <p className="text-md text-white/90 text-center pt-2">
                  ¿Recuerda su contraseña? <br />
                  Inicie sesión{" "}
                  <Link
                    className="underline text-amber-400 hover:text-amber-300"
                    href="/login"
                  >
                    aquí
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
