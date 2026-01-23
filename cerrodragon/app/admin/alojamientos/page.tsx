/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from 'react';
import { TopBar, TablaAlojamientosAdmin, SideBarAdmin, Cuadro, SearchBarAdmin } from "@/app/components";

interface Reserva {
    id: string;
    clienteNombre: string;
    clienteEmail: string;
    cabana: string;
    fechaReserva: string;
    personas: number;
    fechaLlegada: string;
    fechaFinal: string;
    estado: "confirmada" | "pendiente" | "reembolsada";
}

export default function AlojamientosAdmin() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        try {
            setIsLoading(true);
            // TODO: Implementar llamada al backend
            // const response = await fetch('/api/reservas');
            // if (!response.ok) throw new Error('Error al cargar reservas');
            // const data = await response.json();
            // setReservas(data);
            
            // Datos temporales hasta que esté el backend
            const reservasTemp: Reserva[] = [
                {
                    id: "RV-502",
                    clienteNombre: "Carlos Alvarado",
                    clienteEmail: "c.alvarado@gmail.com",
                    cabana: "Cabaña del Lago",
                    fechaReserva: "15 de Diciembre de 2025",
                    personas: 4,
                    fechaLlegada: "22 de Diciembre de 2025",
                    fechaFinal: "27 de Diciembre de 2025",
                    estado: "confirmada",
                },
                {
                    id: "RV-503",
                    clienteNombre: "María González",
                    clienteEmail: "maria.g@hotmail.com",
                    cabana: "Cabaña Montañesa",
                    fechaReserva: "20 de Diciembre de 2025",
                    fechaLlegada: "28 de Diciembre de 2025",
                    fechaFinal: "02 de Enero de 2026",
                    personas: 2,
                    estado: "pendiente",
                },
                {
                    id: "RV-504",
                    clienteNombre: "Pedro Martínez",
                    clienteEmail: "p.martinez@company.com",
                    cabana: "Cabaña Sol y Sombra",
                    fechaReserva: "18 de Diciembre de 2025",
                    fechaLlegada: "25 de Diciembre de 2025",
                    fechaFinal: "30 de Diciembre de 2025",
                    personas: 3,
                    estado: "reembolsada",
                }
            ];
            setReservas(reservasTemp);
        } catch (error) {
            console.error('Error fetching reservas:', error);
            setError('Error al cargar las reservas');
        } finally {
            setIsLoading(false);
        }
    };

    const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada').length;
    const reservasPendientes = reservas.filter(r => r.estado === 'pendiente').length;
    const reservasReembolsadas = reservas.filter(r => r.estado === 'reembolsada').length;

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0"> 
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 mb-6">
                            <div className="flex-shrink-0 mb-4">
                                <h3 className="text-3xl font-bold mb-1 text-black">Gestión de Reserva de Alojamientos</h3>
                                <p className="text-verde3">
                                    Administre los alojamientos reservados por los clientes, revise los detalles de cada reserva y realice modificaciones si es necesario.
                                </p>
                            </div>
                            <hr className="border-1 border-borde1 w-full" />
                        </div>
                        <div className="mb-6 gap-4 flex space-x-4">
                            <Cuadro texto="Reservas Totales" cantidad={reservas.length} />
                            <Cuadro texto="Reservas Confirmadas" cantidad={reservasConfirmadas} />
                            <Cuadro texto="Reservas Pendientes" cantidad={reservasPendientes} />
                            <Cuadro texto="Reservas Reembolsadas" cantidad={reservasReembolsadas} />
                        </div>
                        <div className="mb-1">
                            <SearchBarAdmin texto="Buscar reserva..." />
                        </div>
                        <TablaAlojamientosAdmin reservas={reservas} />
                    </div>
                </main>
            </div>
        </div>
    );
}