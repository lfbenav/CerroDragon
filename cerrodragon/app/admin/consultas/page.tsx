'use client';
import { useState, useEffect } from 'react';
import { SideBarAdmin, TopBar, SearchBar, TablaConsultas, Cuadro } from "@/app/components";

interface ConsultaProps {
    id: string;
    clienteNombre: string;
    telefono: string;
    consulta: string;
    fecha: string;
    estado: 'pendiente' | 'resuelta';
}

export default function ConsultasAdmin() {
    const [consultas, setConsultas] = useState<ConsultaProps[]>([]);

    // Mock data - reemplazar con llamada real a API cuando esté
    const mockConsultas: ConsultaProps[] = [
        {
            id: '1',
            clienteNombre: 'María González',
            telefono: '8888-1234',
            consulta: 'Hola, me gustaría saber si tienen tours disponibles para el próximo fin de semana para 4 personas. ¿Qué opciones tienen disponibles?',
            fecha: '2025-01-15',
            estado: 'pendiente'
        },
        {
            id: '2',
            clienteNombre: 'Carlos Rodríguez',
            telefono: '7777-5678',
            consulta: '¿Cuál es la política de cancelación para las reservas? Necesito información urgente.',
            fecha: '2025-01-14',
            estado: 'pendiente'
        },
        {
            id: '3',
            clienteNombre: 'Ana Jiménez',
            telefono: '6666-9012',
            consulta: 'Me interesa el tour de aventura extrema, ¿qué nivel de dificultad tiene y qué debo llevar?',
            fecha: '2025-01-13',
            estado: 'pendiente'
        },
        {
            id: '4',
            clienteNombre: 'José Mora',
            telefono: '5555-3456',
            consulta: '¿Tienen descuentos para grupos grandes? Somos una empresa y queremos organizar un tour corporativo.',
            fecha: '2025-01-12',
            estado: 'resuelta'
        }
    ];

    useEffect(() => {
        const loadConsultas = async () => {
            try {
                // TODO: Replace with actual API call when backend is ready
                // const response = await fetch('/api/consultas');
                // const data = await response.json();
                // setConsultas(data);
                
                // mock data - quitar cuando ya se conecte al backend
                setTimeout(() => {
                    setConsultas(mockConsultas);
                }, 1000);
            } catch (error) {
                console.error('Error cargando consultas:', error);
            }
        };

        loadConsultas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMarcarResuelta = async (id: string) => {
        setConsultas(prev => prev.filter(consulta => consulta.id !== id));
        
        // TODO: Implement backend call when ready
        // try {
        //   const response = await fetch(`/api/consultas/${id}/resolver`, {
        //     method: 'PATCH',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       estado: 'resuelta'
        //     })
        //   });
        //   
        //   if (!response.ok) {
        //     throw new Error('Error al marcar consulta como resuelta');
        //   }
        //   
        //   console.log('Consulta marcada como resuelta exitosamente');
        // } catch (error) {
        //   console.error('Error:', error);
        //   // Revert local changes on error
        //   setConsultas(mockConsultas);
        // }
    };

    const consultasPendientes = consultas.filter(c => c.estado === 'pendiente');

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Gestión de Consultas</h1>
                            <p className="mb-4 text-verde3">
                                Administre las consultas de los clientes y contacte vía WhatsApp
                            </p>
                            
                            <div className="flex gap-6 mb-6">
                                <Cuadro texto="Consultas Pendientes" cantidad={consultasPendientes.length} />
                                <Cuadro texto="Total de Consultas" cantidad={consultas.length} />
                            </div>
                            
                            <SearchBar texto="Buscar consultas..." />
                            
                            <div className="border-b border-black/20 mb-2" />
                        </div>
                        
                        <TablaConsultas 
                            consultas={consultas} 
                            onMarcarResuelta={handleMarcarResuelta}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}