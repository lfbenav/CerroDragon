"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminPageShell,
  PermissionsTable,
  PERMISSIONS,
  PermKey,
  ConfirmModal,
} from "../../../components";

export default function CrearInternoPage() {
  const router = useRouter();

  const defaultPerms = useMemo(() => {
    const base = {} as Record<PermKey, boolean>;
    PERMISSIONS.forEach((p) => (base[p.key] = false));
    return base;
  }, []);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [permisos, setPermisos] =
    useState<Record<PermKey, boolean>>(defaultPerms);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const canSubmit =
    nombre.trim().length > 0 &&
    correo.trim().length > 0 &&
    contrasena.trim().length > 0 &&
    !isCreating;

  const handleBack = () => {
    router.back();
  };

  // Abre modal (no crea todavía)
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const cancelCreate = () => setConfirmOpen(false);

  const confirmCreate = async () => {
    setConfirmOpen(false);
    setIsCreating(true);

    try {
      // TODO: llamar API de crear aquí
      // await fetch("/api/admin/internos", { method: "POST", body: JSON.stringify({...}) })

      // Redirigir al listado (cambia la ruta si tu listado es /admin/internos)
      router.push("/admin/administradores");
      // router.push("/admin/internos");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AdminPageShell
      title="Crear Usuario Interno"
      subtitle="Ingrese la información y permisos del administrador"
    >
      <div className="py-6 w-full max-w-7xl">
        <form onSubmit={handleCreateRequest} className="w-full px-4">
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-xs text-black mb-1">
              Nombre de Usuario
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre de usuario"
              className="w-full max-w-md bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black placeholder:text-black/40 outline-none focus:ring-2 focus:ring-verde2"
            />
          </div>

          {/* Correo */}
          <div className="mb-4">
            <label className="block text-xs text-black mb-1">
              Correo Electrónico
            </label>
            <input
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingrese el correo electrónico"
              type="email"
              className="w-full max-w-md bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black placeholder:text-black/40 outline-none focus:ring-2 focus:ring-verde2"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label className="block text-xs text-black mb-1">Contraseña</label>
            <input
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Cree una contraseña segura para el administrador"
              type="password"
              className="w-full max-w-md bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black placeholder:text-black/40 outline-none focus:ring-2 focus:ring-verde2"
            />
          </div>

          {/* Permisos */}
          <h3 className="font-bold text-black mb-3">Permisos:</h3>

          <div className="w-full">
            <PermissionsTable value={permisos} onChange={setPermisos} />
          </div>

          {/* Acciones */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
            >
              <BackIcon />
              Volver
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition",
                canSubmit
                  ? "bg-verde2 text-white hover:opacity-95"
                  : "bg-black/20 text-black/50 cursor-not-allowed",
              ].join(" ")}
            >
              <PlusIcon />
              {isCreating ? "Creando..." : "Crear Usuario"}
            </button>
          </div>

          {/* Confirm Modal */}
          <ConfirmModal
            open={confirmOpen}
            title="Crear usuario interno"
            message={`¿Desea crear este usuario interno?\n\nNombre: ${nombre}\nCorreo: ${correo}`}
            confirmText="Crear"
            cancelText="Cancelar"
            confirmVariant="primary"
            onConfirm={confirmCreate}
            onCancel={cancelCreate}
          />
        </form>
      </div>
    </AdminPageShell>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
