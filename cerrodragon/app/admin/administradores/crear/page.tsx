"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminPageShell,
  ToggleSwitch,
  ConfirmModal,
  PaginationControls,
  PermKey,
} from "../../../components";

/* =========================
   TYPES
========================= */

type PermissionAPI = {
  id: string;
  code: PermKey;
  description: string;
};

/* =========================
   CONSTS
========================= */

const API_URL = "http://localhost:3000";

/* =========================
   PAGE
========================= */

export default function CrearInternoPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [permissions, setPermissions] = useState<PermissionAPI[]>([]);
  const [permisos, setPermisos] =
    useState<Record<PermKey, boolean>>(
      () => ({} as Record<PermKey, boolean>)
    );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  /* =========================
     FETCH ALL PERMISSIONS
  ========================== */
  useEffect(() => {
    const fetchPerms = async () => {
      const res = await fetch(`${API_URL}/users/permissions`);
      const json = await res.json();

      const perms: PermissionAPI[] = json.data;

      const base = {} as Record<PermKey, boolean>;
      perms.forEach((p) => (base[p.code] = false));

      setPermissions(perms);
      setPermisos(base);
    };

    fetchPerms();
  }, []);

  const canSubmit =
    nombre.trim().length > 0 &&
    correo.trim().length > 0 &&
    contrasena.trim().length > 0 &&
    !isCreating;

  const handleBack = () => router.back();

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const cancelCreate = () => setConfirmOpen(false);

  const confirmCreate = async () => {
    setConfirmOpen(false);
    setIsCreating(true);

    const token = localStorage.getItem("access_token");

    try {
      /* =========================
        CREATE ADMIN
      ========================== */
      const res = await fetch(`${API_URL}/auth/register/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: correo,
          password: contrasena,
          full_name: nombre,
          phone: telefono || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error creando administrador");
      }

      const json = await res.json();
      const userId = json.user.id;

      /* =========================
        GET ROLE ID
      ========================== */
      const roleRes = await fetch(`${API_URL}/users/${userId}/role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!roleRes.ok) {
        throw new Error("Error obteniendo rol");
      }

      const roleJson = await roleRes.json();
      const roleId = roleJson.role_id;

      /* =========================
        REMOVE UNCHECKED PERMS
      ========================== */
      const toRemove = permissions.filter(
        (p) => !permisos[p.code]
      );

      await Promise.all(
        toRemove.map((p) =>
          fetch(`${API_URL}/users/permissions/remove`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              role_id: roleId,
              permission_id: p.id,
            }),
          })
        )
      );

      router.push("/admin/administradores");
    } catch (e) {
      console.error(e);
      const message = "No tiene permisos para esta acción";
      alert(message);
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

          {/* Teléfono */}
          <div className="mb-4">
            <label className="block text-xs text-black mb-1">
              Teléfono
            </label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ingrese el número de teléfono"
              className="w-full max-w-md bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black placeholder:text-black/40 outline-none focus:ring-2 focus:ring-verde2"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label className="block text-xs text-black mb-1">
              Contraseña
            </label>
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
            <PermissionsTable
              permissions={permissions}
              value={permisos}
              onToggle={(p, next) =>
                setPermisos({ ...permisos, [p.code]: next })
              }
            />
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

          <ConfirmModal
            open={confirmOpen}
            title="Crear usuario interno"
            message={`¿Desea crear este usuario interno?\n\nNombre: ${nombre}\nCorreo: ${correo}\nTeléfono: ${telefono || "N/A"}`}
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

/* =========================
   PERMISSIONS TABLE (INLINE)
   MISMO JSX / MISMAS CLASES
========================= */

function PermissionsTable({
  permissions,
  value,
  onToggle,
}: {
  permissions: PermissionAPI[];
  value: Record<PermKey, boolean>;
  onToggle: (perm: PermissionAPI, next: boolean) => void;
}) {
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(permissions.length / PAGE_SIZE)
  );
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = permissions.slice(start, start + PAGE_SIZE);

  return (
    <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
      <div className="grid grid-cols-2 px-4 py-2 bg-black/5 text-xs font-semibold text-black">
        <div>Permiso</div>
        <div className="text-right">Estado</div>
      </div>

      <div className="divide-y divide-black/10">
        {pageItems.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-2 px-4 py-2 items-center"
          >
            <div className="text-sm text-black">
              {p.description}
            </div>
            <div className="flex justify-end">
              <ToggleSwitch
                checked={!!value[p.code]}
                onChange={(nextVal) => onToggle(p, nextVal)}
              />
            </div>
          </div>
        ))}
      </div>

      <PaginationControls
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        showCounter={false}
      />
    </div>
  );
}

/* =========================
   ICONS
========================= */

function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
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
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
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
