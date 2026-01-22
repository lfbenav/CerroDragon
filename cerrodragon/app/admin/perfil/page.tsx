"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AdminPageShell,
  PermissionsTable,
  PERMISSIONS,
  PermKey,
  ToggleSwitch,
} from "../../components";

type AdminProfile = {
  nombre: string;
  correo: string;
  telefono: string;
  activo: boolean;
  permisos: Record<PermKey, boolean>;
};

export default function AdminPerfilPage() {
    const router = useRouter();
  // Datos dummy (luego lo conectas a tu API/auth)
  const initialProfile: AdminProfile = useMemo(() => {
    const perms = {} as Record<PermKey, boolean>;
    PERMISSIONS.forEach((p) => (perms[p.key] = true)); // en perfil solo mostrar
    return {
      nombre: "Admin",
      correo: "ad.min@gmail.com",
      telefono: "8888-8884",
      activo: true,
      permisos: perms,
    };
  }, []);

  const [profile] = useState<AdminProfile>(initialProfile);

  const handleLogout = () => {
  router.push("/login");
  // LLAMAR LOGOUT EN BACKEND 
    };


  return (
    <AdminPageShell
      title="Información del Usuario"
      subtitle="Información personal del administrador"
      actions={
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
        >
          Cerrar Sesión
        </button>
      }
    >
      <div className="py-6 w-full max-w-7xl">
        {/* Nombre */}
        <div className="mb-6">
        <h2 className="text-2xl font-serif text-black">{profile.nombre}</h2>
        </div>


        {/* Info */}
        <div className="space-y-4 mb-6">
          <p className="text-black">
            <span className="font-bold">Correo electrónico:</span>{" "}
            <span>{profile.correo}</span>
          </p>

        <div className="flex items-center gap-2 text-black">
        <span className="font-bold">Teléfono:</span>
        <span>{profile.telefono}</span>
        </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-black">Activo:</span>
            <ToggleSwitch
              checked={profile.activo}
              onChange={() => {}}
              disabled
            />
          </div>
        </div>

        {/* Permisos */}
        <h3 className="font-bold text-black mb-3">Permisos Asignados:</h3>

        <div className="w-full">
          <PermissionsTable
            value={profile.permisos}
            onChange={() => {}}
            disabled
          />
        </div>
      </div>
    </AdminPageShell>
  );
}

