"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageShell } from "../../components";

/* =========================
   TYPES
========================= */

type PermissionAPI = {
  code: string;
  description: string;
};

type AdminProfile = {
  nombre: string;
  correo: string;
  telefono: string;
  activo: boolean;
};

/* =========================
   CONSTS
========================= */

const API_URL = "http://localhost:3000";

/* =========================
   PAGE
========================= */

export default function AdminPerfilPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [permissions, setPermissions] = useState<PermissionAPI[]>([]);
  const [saving, setSaving] = useState(false);

  /* =========================
     LOAD USER ID
  ========================== */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUserId(parsed.id);
  }, []);

  /* =========================
     FETCH PROFILE + PERMS
  ========================== */
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const [adminRes, permsRes] = await Promise.all([
        fetch(`${API_URL}/users/${userId}/admin`),
        fetch(`${API_URL}/users/${userId}/permissions`),
      ]);

      const adminJson = await adminRes.json();
      const permsJson = await permsRes.json();

      const admin = adminJson.data;

      setProfile({
        nombre: admin.full_name,
        correo: admin.email,
        telefono: admin.phone || "",
        activo: admin.is_active,
      });

      setPermissions(permsJson.data || []);
    };

    fetchData();
  }, [userId]);

  /* =========================
     ACTIONS
  ========================== */

  const handleSave = async () => {
    if (!userId || !profile) return;

    setSaving(true);

    try {
      await fetch(`${API_URL}/users/${userId}/admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.correo,
          full_name: profile.nombre,
          phone: profile.telefono,
        }),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (!profile) {
    return (
      <AdminPageShell
        title="Información del Usuario"
        subtitle="Información personal del administrador"
      >
        <div className="py-6 text-sm text-verde3">
          Cargando perfil...
        </div>
      </AdminPageShell>
    );
  }

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
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif text-black">
            Perfil del Administrador
          </h2>
        </div>

        {/* Editable Info */}
        <div className="space-y-4 mb-6 w-full max-w-md">
          {/* Nombre */}
          <div>
            <label className="block text-xs text-black mb-1">
              Nombre
            </label>
            <input
              value={profile.nombre}
              onChange={(e) =>
                setProfile({ ...profile, nombre: e.target.value })
              }
              className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-xs text-black mb-1">
              Correo electrónico
            </label>
            <input
              value={profile.correo}
              onChange={(e) =>
                setProfile({ ...profile, correo: e.target.value })
              }
              className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs text-black mb-1">
              Teléfono
            </label>
            <input
              value={profile.telefono}
              onChange={(e) =>
                setProfile({ ...profile, telefono: e.target.value })
              }
              className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-3 inline-flex items-center px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

        {/* Permissions (READ ONLY) */}
        <h3 className="font-bold text-black mb-3">
          Permisos Asignados:
        </h3>

        <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
          <div className="px-4 py-2 bg-black/5 text-xs font-semibold text-black">
            Permiso
          </div>

          <div className="divide-y divide-black/10">
            {permissions.map((p) => (
              <div
                key={p.code}
                className="px-4 py-3 text-sm text-black"
              >
                {p.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
