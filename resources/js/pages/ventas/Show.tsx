import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import AppLogo from '@/components/app-logo';
import type { BreadcrumbItem } from '@/types';

// Código de Show optimizado con el estilo visual CleanLabs de Index
export default function VentasShow({ venta }: { venta: any }) {
    const formatCurrency = (v: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v);

    return (
        <AppLayout breadcrumbs={[{ title: 'Ventas', href: '/ventas' }, { title: `Ref: ${venta.id}`, href: '' }]}>
            <Head title={`View_Sale #${venta.id}`} />
            
            <div className="p-8 space-y-8 no-print max-w-5xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black italic tracking-tighter text-[#0000FF] uppercase underline decoration-8">Venta_Detailed_Log</h1>
                    <div className="flex gap-4">
                        <Button onClick={() => window.print()} className="bg-black text-white font-bold rounded-full px-8">[ PRINT_TICKET ]</Button>
                        <Link href="/ventas"><Button variant="outline" className="rounded-full px-8">BACK_TO_LOG</Button></Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[32px] border-2 border-slate-50 shadow-sm">
                        <h2 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Metadata_Info</h2>
                        <div className="space-y-4">
                            <p className="font-bold">ID_REFERENCE: <span className="italic">CL-S-{venta.id}</span></p>
                            <p className="font-bold">OPERATOR: <span className="italic">{venta.user.name}</span></p>
                            <p className="font-bold">METHOD: <span className="italic uppercase text-[#0000FF] underline decoration-2">{venta.metodo_pago}</span></p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] border-2 border-slate-50 shadow-sm">
                        <h2 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Subject_Source</h2>
                        <p className="text-2xl font-black italic uppercase">{venta.cliente?.nombre || 'General_Public_Subject'}</p>
                        <p className="text-xs font-bold text-slate-400 mt-2">{venta.cliente?.email || 'NO_EMAIL_RECORDED'}</p>
                    </div>
                </div>
            </div>

            {/* REUTILIZAMOS EL TICKET DEL INDEX PARA CONSISTENCIA */}
            <div className="only-print flex justify-center min-h-screen bg-white text-black p-4 font-mono uppercase">
                {/* (Mismo contenido del div only-print del Index.tsx) */}
                <div className="w-[350px] p-6 border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,255,1)]">
                    <AppLogo className="mx-auto mb-4" />
                    <p className="text-center text-[10px] font-black italic mb-6">CleanLabs_Official_Receipt</p>
                    <div className="border-t-2 border-black py-4 space-y-2 text-[9px]">
                        {venta.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between font-bold">
                                <span>{item.producto.nombre}</span>
                                <span>{formatCurrency(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-black text-white p-4 text-center mt-4">
                        <span className="text-xl font-black tracking-tighter">{formatCurrency(venta.total)}</span>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .only-print { display: none; }
                @media print {
                    .no-print, nav, aside, header { display: none !important; }
                    .only-print { display: flex !important; position: fixed; inset: 0; z-index: 9999; }
                }
            `}} />
        </AppLayout>
    );
}