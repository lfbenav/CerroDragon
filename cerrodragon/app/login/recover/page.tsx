"use client";

import Image from "next/image";
import Link from "next/link";

export default function RecoverPasswordPage() {
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
              <form className="space-y-4">
                <div>
                  <label className="block text-md mb-1 text-white/90">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    className="w-full rounded-md border border-white/45 bg-white/10 px-3 py-2 outline-none placeholder:text-white/55 focus:border-white"
                  />
                </div>
                  <Link
                    href="/login/change-password"
                    className="block w-full text-center rounded-md bg-amber-400 text-black font-semibold py-2 hover:opacity-95"
                  >
                    Enviar Código
                  </Link>
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
