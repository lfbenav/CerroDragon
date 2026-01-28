"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type AdminUser = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  activo: boolean;
  permisos: Record<PermKey, boolean>;
};

type AdminAPI = {
  user_id: string;
  email: string;
  is_active: boolean;
  full_name: string;
  phone: string;
};

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

export default function VerInternoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<PermissionAPI[]>([]);
  const [roleId, setRoleId] = useState<string | null>(null);

  /* =========================
     FETCH ADMIN + PERMISSIONS
  ========================== */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          adminRes,
          allPermsRes,
          userPermsRes,
          roleRes,
        ] = await Promise.all([
          fetch(`${API_URL}/users/${id}/admin`),
          fetch(`${API_URL}/users/permissions`),
          fetch(`${API_URL}/users/${id}/permissions`),
          fetch(`${API_URL}/users/${id}/role`),
        ]);

        if (!adminRes.ok) throw new Error("Error cargando admin");

        const admin: AdminAPI = (await adminRes.json()).data;
        const allPerms: PermissionAPI[] =
          allPermsRes.ok ? (await allPermsRes.json()).data : [];
        const userPerms: { code: PermKey }[] =
          userPermsRes.ok ? (await userPermsRes.json()).data : [];
        const roleJson = await roleRes.json();

        const permisosMap = allPerms.reduce((acc, p) => {
          acc[p.code] = userPerms.some((up) => up.code === p.code);
          return acc;
        }, {} as Record<PermKey, boolean>);

        setPermissions(allPerms);
        setRoleId(roleJson.role_id);

        setUser({
          id: admin.user_id,
          nombre: admin.full_name,
          correo: admin.email,
          telefono: admin.phone,
          activo: admin.is_active,
          permisos: permisosMap,
        });
      } catch (err) {
        console.error("Error cargando administrador", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  /* =========================
     ACTIONS
  ========================== */

  const handleBack = () => router.back();

  const toggleActive = async (next: boolean) => {
    if (!user) return;

    await fetch(
      `${API_URL}/users/${user.id}/${next ? "activate" : "deactivate"}`,
      { method: "PATCH" }
    );

    setUser({ ...user, activo: next });
  };

  const togglePermission = async (
    perm: PermissionAPI,
    next: boolean
  ) => {
    if (!user || !roleId) return;

    setUser((u) =>
      u ? { ...u, permisos: { ...u.permisos, [perm.code]: next } } : u
    );

    await fetch(
      `${API_URL}/users/permissions/${next ? "assign" : "remove"}`,
      {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id: roleId,
          permission_id: perm.id,
        }),
      }
    );
  };

  const requestDelete = () => setConfirmOpen(true);
  const cancelDelete = () => setConfirmOpen(false);

  const confirmDelete = async () => {
    setConfirmOpen(false);
    router.push("/admin/administradores");
  };

  if (loading || !user) {
    return (
      <AdminPageShell
        title="Información del Usuario"
        subtitle="Información personal del administrador"
      >
        <div className="py-6 text-sm text-verde3">
          Cargando información del usuario...
        </div>
      </AdminPageShell>
    );
  }

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

          {/* <button
            onClick={requestDelete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:opacity-95"
          >
            <TrashIcon />
            Eliminar
          </button> */}
        </div>
      }
    >
      <div className="py-6 w-full max-w-7xl">
        <h2 className="text-2xl font-serif text-black mb-6">
          {user.nombre}
        </h2>

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
              onChange={toggleActive}
            />
          </div>
        </div>

        <h3 className="font-bold text-black mb-3">
          Permisos Asignados:
        </h3>

        <div className="w-full">
          <PermissionsTable
            permissions={permissions}
            value={user.permisos}
            onToggle={togglePermission}
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

/* =========================
   PERMISSIONS TABLE (INLINE)
   ⚠️ MISMO JSX / MISMAS CLASES
========================= */

function PermissionsTable({
  permissions,
  value,
  onToggle,
  disabled,
}: {
  permissions: PermissionAPI[];
  value: Record<PermKey, boolean>;
  onToggle: (perm: PermissionAPI, next: boolean) => void;
  disabled?: boolean;
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
                disabled={disabled}
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

function TrashIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
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
