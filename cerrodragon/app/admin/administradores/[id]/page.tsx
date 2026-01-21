"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AdminPageShell,
  PermissionsTable,
  ToggleSwitch,
  PERMISSIONS,
  PermKey,
  ConfirmModal,
} from "../../../components";

type AdminUser = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  activo: boolean;
  permisos: Record<PermKey, boolean>;
};

export default function VerInternoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const initialUser: AdminUser = useMemo(
    () => ({
      id,
      nombre: id === "A-001" ? "Alex Naranjo" : "Admin",
      correo: id === "A-001" ? "sr.alex@gmail.com" : "ad.min@gmail.com",
      telefono: id === "A-001" ? "8888-8883" : "8888-8884",
      activo: true,
      permisos: PERMISSIONS.reduce((acc, p) => {
        acc[p.key] = true;
        return acc;
      }, {} as Record<PermKey, boolean>),
    }),
    [id]
  );

  const [user, setUser] = useState<AdminUser>(initialUser);

  const handleBack = () => {
    router.back();
  };

  const requestDelete = () => setConfirmOpen(true);

  const cancelDelete = () => setConfirmOpen(false);

  const confirmDelete = () => {
    setConfirmOpen(false);

    // TODO: llamar API de delete aquí
    // await fetch(...)

    router.push("/admin/administradores"); // <- cambia a /admin/internos si ese es tu listado
  };

  return (
    <AdminPageShell
      title="Información del Usuario"
      subtitle="Información personal del administrador"
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
          >
            <BackIcon />
            Volver
          </button>

          <button
            onClick={requestDelete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:opacity-95"
          >
            <TrashIcon />
            Eliminar
          </button>
        </div>
      }
    >
      <div className="py-6 w-full max-w-7xl">
        <h2 className="text-2xl font-serif text-black mb-6">{user.nombre}</h2>

        <div className="space-y-4 mb-6">
          <p className="text-black">
            <span className="font-bold">Correo electrónico:</span>{" "}
            <span>{user.correo}</span>
          </p>

          <p className="text-black">
            <span className="font-bold">Teléfono:</span>{" "}
            <span>{user.telefono}</span>
          </p>

          <div className="flex items-center gap-3">
            <span className="font-bold text-black">Activo:</span>
            <ToggleSwitch
              checked={user.activo}
              onChange={(next) => setUser((u) => ({ ...u, activo: next }))}
            />
          </div>
        </div>

        <h3 className="font-bold text-black mb-3">Permisos Asignados:</h3>

        <div className="w-full">
          <PermissionsTable
            value={user.permisos}
            onChange={(next) => setUser((u) => ({ ...u, permisos: next }))}
          />
        </div>

        <ConfirmModal
          open={confirmOpen}
          title="Eliminar administrador"
          message={`¿Está seguro de que desea eliminar al administrador "${user.nombre}"?\n\nEsta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </AdminPageShell>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h12m-10 0 1 14h8l1-14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
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
