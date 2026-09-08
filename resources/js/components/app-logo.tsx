import React from 'react';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* El Recuadro Simple de la Tabla Periódica */}
            <div className="relative flex h-10 w-10 flex-col items-center justify-center border-2 border-black bg-white p-1">
                {/* Número atómico */}
                <span className="absolute top-0.5 left-1 text-[7px] font-black text-black leading-none">08</span>
                
                {/* Símbolo del Elemento */}
                <span className="text-lg font-black leading-none text-black tracking-tighter">Cl</span>
                
                {/* Nombre abajo */}
                <span className="text-[5px] font-bold uppercase tracking-tighter text-black">CleanLabs</span>
            </div>
            
            {/* Texto lateral */}
            <div className="flex flex-col leading-none">
                <span className="text-[14px] font-black tracking-tighter italic text-black uppercase">
                    Clean<span className="text-[#0000FF]">Labs</span>
                </span>
                <span className="text-[7px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase">
                    Molecular_Care
                </span>
            </div>
        </div>
    );
}