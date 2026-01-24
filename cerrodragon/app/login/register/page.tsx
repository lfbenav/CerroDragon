"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ) : (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.7 10.7a3 3 0 0 0 4.1 4.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.6 6.6C4.2 8.2 2.6 10.6 2 12c0 0 3.5 7 10 7 1.7 0 3.2-.3 4.5-.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.5 5.3C10.3 5.1 11.1 5 12 5c6.5 0 10 7 10 7-.5 1-1.6 3.2-3.6 4.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/register/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      // Registro exitoso
      window.location.href = "/login";

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al registrarse";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <Image
        src="/imagen.png"
        alt="Cerro Dragón"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 via-transparent to-transparent" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <section className="text-white text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Descubre la Magia de{" "}
              <span className="text-amber-400">Cerro Dragón</span>
            </h1>
            <p className="mt-5 max-w-xl text-white/90">
              Vive la experiencia. Tours guiados, cabañas acogedoras y paisajes
              imponentes
            </p>
          </section>
          <section className="flex lg:justify-end">
            <div className="w-full max-w-md rounded-xl border border-white/45 bg-black/25 backdrop-blur-sm p-6 text-white">
              <form className="space-y-4" onSubmit={handleRegister}>
                {/* Nombre completo */}
                <Field
                  label="Nombre Completo"
                  placeholder="Ingrese su nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                {/* Email */}
                <Field
                  label="Correo Electrónico"
                  placeholder="Ingrese su correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Teléfono */}
                <Field
                  label="Número Telefónico"
                  placeholder="Ingrese su número telefónico"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                {/* Password */}
                <PasswordField
                  label="Contraseña"
                  placeholder="Ingrese su contraseña"
                  show={showPass}
                  toggle={() => setShowPass((v) => !v)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Confirmar password */}
                <PasswordField
                  label="Confirmar Contraseña"
                  placeholder="Ingrese su contraseña de nuevo"
                  show={showPass2}
                  toggle={() => setShowPass2((v) => !v)}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />

                {/* ERROR */}
                {error && (
                  <p className="text-sm text-red-300 text-center">
                    {error}
                  </p>
                )}

                {/* BOTÓN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-amber-400 text-black font-semibold py-2 hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? "Registrando..." : "Registrarse"}
                </button>

                {/* LINK LOGIN */}
                <p className="text-md text-white/90 text-center pt-3">
                  ¿Ya tiene una cuenta? <br />
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

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-md mb-1 text-white/90">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-white/45 bg-white/10 px-3 py-2 outline-none placeholder:text-white/55 focus:border-white"
      />
    </div>
  );
}


function PasswordField({
  label,
  placeholder,
  show,
  toggle,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  show: boolean;
  toggle: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-md mb-1 text-white/90">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-md border border-white/45 bg-white/10 px-3 py-2 pr-10 outline-none placeholder:text-white/55 focus:border-white"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

