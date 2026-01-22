"use client";
import { CardPolitica, SideBarClient, TopBar } from "@/app/components";

export default function Politicas() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Políticas de la empresa</h1>
                            <p className="mb-4 text-verde3">
                                Políticas, condiciones e información general de Cerro Dragón Tours
                            </p>
                            <hr className="border-1 border-borde1 my-4 w-full" />
                        </div>
                        
                        {/* Scrollable tours */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="grid grid-cols-1 p-6">
                                <CardPolitica
                                    titulo="¿Quiénes Somos?"
                                    descripcion="En Cerro Dragón Tours trabajamos para ofrecer experiencias turísticas seguras, organizadas y transparentes. 
                                    Las siguientes políticas y condiciones establecen las reglas generales que rigen el uso de nuestra plataforma, la realización
                                    de reservas, los pagos y la participación en nuestros tours. Su objetivo es proteger tanto a nuestros clientes como a la 
                                    empresa, garantizando una operación clara, ordenada y confiable."
                                />
                                <CardPolitica
                                    titulo="Política de Reservas"
                                    descripcion="Las reservas realizadas a través de la plataforma están sujetas a validación administrativa y disponibilidad operativa. Ninguna reserva se considera confirmada hasta que haya sido aprobada por Cerro Dragón Tours."
                                />
                                <CardPolitica
                                    titulo="Política de Pagos"
                                    descripcion="Todos los pagos deben realizarse mediante los métodos autorizados por la empresa y deben contar con un comprobante válido. La confirmación del servicio depende de la verificación manual del pago por parte del personal administrativo."
                                />
                                <CardPolitica
                                    titulo="Política de Cancelaciones"
                                    descripcion="Las cancelaciones de reservas estarán sujetas a las condiciones y plazos definidos por Cerro Dragón Tours. Las solicitudes fuera de los plazos establecidos podrán no ser elegibles para reembolso."
                                />
                                <CardPolitica
                                    titulo="Política de Reembolsos"
                                    descripcion="Los reembolsos se evaluarán conforme a las políticas vigentes al momento de la reserva y únicamente aplicarán a reservas futuras según las condiciones definidas por la empresa."
                                />

                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}