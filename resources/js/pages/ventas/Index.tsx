import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import AppLogo from '@/components/app-logo';
import type { BreadcrumbItem } from '@/types';
import React, { useState } from 'react';

interface Venta {
    id: number;
    cliente_id: number | null;
    user_id: number;
    subtotal: number;
    impuesto: number;
    total: number;
    estado: string;
    metodo_pago: string;
    notas: string | null;
    created_at: string;
    cliente: { id: number; nombre: string; email?: string; telefono?: string; } | null;
    user: { id: number; name: string; };
    categoria?: 'SNEAKER' | 'GORRA' | 'BOLSA'; 
}

interface Props {
    ventas: Venta[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'SYSTEM_DASHBOARD', href: '/dashboard' },
    { title: 'SALES_LOG', href: '/ventas' },
];

export default function VentasIndex({ ventas }: Props) {
    const [activeVenta, setActiveVenta] = useState<Venta | null>(null);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(value);

    const handlePrint = (venta: Venta) => {
        setActiveVenta(venta);
        setTimeout(() => {
            window.print();
        }, 200);
    };

    const sendWhatsApp = (venta: Venta) => {
        const clienteNom = venta.cliente?.nombre || 'CLIENTE';
        const mensaje = `*CLEANLABS - TICKET DE VENTA* 👟✨\n\n` +
                        `ID: CL-S-${venta.id.toString().padStart(3, '0')}\n` +
                        `FECHA: ${new Date(venta.created_at).toLocaleDateString()}\n` +
                        `CLIENTE: ${clienteNom}\n\n` +
                        `*TOTAL: ${formatCurrency(venta.total)}*\n` +
                        `MÉTODO: ${venta.metodo_pago}\n\n` +
                        `¡Gracias por tu preferencia!`;
        
        const tel = venta.cliente?.telefono ? venta.cliente.telefono.replace(/\s+/g, '') : '';
        const url = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SALES_LOG" />
            
            {/* VISTA DE LA TABLA (SE MANTIENE IGUAL) */}
            <div className="flex flex-1 flex-col gap-8 p-8 bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:40px_40px] no-print text-black">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <AppLogo />
                        <div className="h-8 w-[1px] bg-slate-200 rotate-[20deg]"></div>
                        <div>
                            <h1 className="text-3xl font-black italic tracking-tighter text-[#0000FF] uppercase">Sales_Log</h1>
                            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase italic">Chihuahua_MX // Unit_01 // 2026</p>
                        </div>
                    </div>
                    <Link href="/ventas/create">
                        <Button className="bg-[#0000FF] hover:bg-blue-700 text-white rounded-full px-8 font-bold text-xs uppercase tracking-tighter shadow-lg transition-all active:scale-95">
                            + Register_Sale_
                        </Button>
                    </Link>
                </div>

                <div className="max-w-xl">
                    <input 
                        type="text" 
                        placeholder="SEARCH_BY_CLIENT_OR_SALE_ID..." 
                        className="w-full border border-slate-200 rounded-full py-3 px-8 text-xs font-bold tracking-widest uppercase shadow-sm focus:ring-2 focus:ring-[#0000FF] outline-none"
                    />
                </div>

                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-transparent border-b border-slate-50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-6 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sale_Reference</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client_Source</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Payment</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total_Value</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ventas.map((venta) => (
                                <TableRow key={venta.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                    <TableCell className="py-6 px-8 text-xs font-black italic">CL-S-{venta.id.toString().padStart(3, '0')}</TableCell>
                                    <TableCell className="text-xs font-bold text-slate-600 uppercase italic">{venta.cliente?.nombre || 'General_Public'}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-[9px] font-black italic text-[#0000FF] border border-[#0000FF]/20 px-3 py-1 rounded-full uppercase">
                                            {venta.metodo_pago}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-black italic text-sm tracking-tighter">{formatCurrency(venta.total)}</TableCell>
                                    <TableCell className="text-right px-8 space-x-4">
                                        <button onClick={() => sendWhatsApp(venta)} className="text-[9px] font-bold text-green-500 hover:underline">[ WhatsApp ]</button>
                                        <button onClick={() => handlePrint(venta)} className="text-[9px] font-bold text-slate-400 hover:text-black">[ Print_Ticket ]</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* TICKET MEJORADO: FORMAL Y COMPLETO */}
            {activeVenta && (
                <div className="only-print flex items-start justify-center min-h-screen bg-white text-black p-4">
                    <div className="w-[380px] p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono uppercase">
                        
                        {/* 1. Header con Contacto */}
                        <div className="flex flex-col items-center border-b-2 border-black pb-4 mb-4 text-center">
                            <AppLogo className="mb-4" />
                            <div className="space-y-1">
                                <p className="text-[8px] font-bold tracking-widest italic">Molecular Cleaning Specialists</p>
                                <p className="text-[7px] font-medium opacity-60 uppercase">Chihuahua, Chihuahua, MX</p>
                                <p className="text-[7px] font-bold underline italic">IG: @CLEANLABS.CL</p>
                            </div>
                        </div>

                        {/* 2. Info de Venta (Jerarquía Clara) */}
                        <div className="grid grid-cols-2 gap-4 text-[9px] mb-6 border-b border-black pb-4">
                            <div className="space-y-1">
                                <p className="opacity-40">TICKET_REF:</p>
                                <p className="font-black italic">CL-S-{activeVenta.id.toString().padStart(4, '0')}</p>
                                <p className="opacity-40 mt-2">ATENDIÓ:</p>
                                <p className="font-black">{activeVenta.user.name}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="opacity-40">FECHA:</p>
                                <p className="font-black">{new Date(activeVenta.created_at).toLocaleString()}</p>
                                <p className="opacity-40 mt-2">CLIENTE:</p>
                                <p className="font-black underline">{activeVenta.cliente?.nombre || 'PÚBLICO GENERAL'}</p>
                            </div>
                        </div>

                        {/* 3. Desglose de Servicios */}
                        <div className="mb-6">
                            <table className="w-full text-[10px]">
                                <thead>
                                    <tr className="border-b-2 border-black">
                                        <th className="text-left py-1 italic">CONCEPTO</th>
                                        <th className="text-right py-1 italic">PRECIO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-black/10">
                                        <td className="py-4">
                                            <p className="font-black italic text-[#0000FF]">{activeVenta.categoria || 'SNEAKER'}_SERVICE</p>
                                            <p className="text-[6px] opacity-60 leading-tight mt-1">
                                                LIMPIEZA PROFESIONAL CON TECNOLOGÍA MOLECULAR Y RESTAURACIÓN DE MATERIALES.
                                            </p>
                                        </td>
                                        <td className="text-right font-black italic">{formatCurrency(activeVenta.total)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 4. Cálculos Fiscales (Subtotal / IVA) */}
                        <div className="space-y-1 text-[9px] mb-6 border-t-2 border-black pt-4">
                            <div className="flex justify-between">
                                <span className="opacity-50">SUBTOTAL:</span>
                                <span>{formatCurrency(activeVenta.total / 1.16)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-50">I.V.A. (16%):</span>
                                <span>{formatCurrency(activeVenta.total - (activeVenta.total / 1.16))}</span>
                            </div>
                            
                            {/* Bloque Total */}
                            <div className="bg-black text-white p-4 mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,255,1)]">
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-[12px] italic underline decoration-[#0000FF]">TOTAL_MXN</span>
                                    <span className="text-2xl font-black italic tracking-tighter">{formatCurrency(activeVenta.total)}</span>
                                </div>
                                <div className="mt-2 text-[7px] border-t border-white/20 pt-2 flex justify-between font-bold opacity-60">
                                    <span>PAGO: {activeVenta.metodo_pago}</span>
                                    <span>STATUS: PAID</span>
                                </div>
                            </div>
                        </div>

                        {/* 5. Políticas y Garantía (Formalidad Legal) */}
                        <div className="border border-black p-3 mb-6 bg-slate-50">
                            <p className="text-[6px] font-bold leading-relaxed text-justify opacity-60">
                                * GARANTÍA DE SATISFACCIÓN: 24 HORAS POSTERIORES A LA ENTREGA.<br/>
                                * CLEANLABS NO SE HACE RESPONSABLE POR ARTÍCULOS NO RECLAMADOS DESPUÉS DE 30 DÍAS.<br/>
                                * EL RESULTADO DEPENDE DEL ESTADO INICIAL Y LOS MATERIALES DEL ARTÍCULO.
                            </p>
                        </div>

                        {/* 6. Footer */}
                        <div className="text-center space-y-2">
                            <p className="text-[9px] font-black italic tracking-widest text-[#0000FF]">@CLEANLABS.CL</p>
                            <p className="text-[7px] font-bold opacity-40 tracking-[0.4em]">WWW.CLEANLABS.CL</p>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .only-print { display: none; }
                @media print {
                    .no-print, nav, aside, header { display: none !important; }
                    .only-print { 
                        display: flex !important; 
                        position: fixed; 
                        inset: 0; 
                        z-index: 9999; 
                        justify-content: center; 
                        align-items: flex-start; 
                        background: white !important; 
                        padding-top: 1cm;
                    }
                    body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    @page { margin: 0; size: auto; }
                }
            `}} />
        </AppLayout>
    );
}