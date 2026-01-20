'use client';
import { SideBarClient, TopBar } from "@/app/components";

export default function NuevoComidaFormPage() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                </main>
            </div>
        </div>
    );
}
