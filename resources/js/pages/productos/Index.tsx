import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import AppLogo from '@/components/app-logo';
import type { BreadcrumbItem } from '@/types';

interface Producto {
    id: number; nombre: string; marca: string; sku: string;
    precio: number; categoria: string; tipo_limpieza: string;
    cliente_nombre: string; estatus: string; fecha_ingreso: string;
    fecha_salida: string; imagen?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'SYSTEM_DASHBOARD', href: '/dashboard' },
    { title: 'SERVICE_LOG', href: '/productos' },
];

export default function ProductosIndex({ productos = [], filters }: { productos: Producto[], filters: any }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const clBlue = "#0000FF";

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get('/productos', { search }, { preserveState: true, replace: true });
            }
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const { data, setData, post, reset, processing } = useForm({
        nombre: '', 
        marca: '', 
        categoria: 'SNEAKERS', 
        tipo_limpieza: 'LOW',
        precio: 100, 
        cliente_nombre: '', 
        fecha_ingreso: new Date().toISOString().split('T')[0],
        fecha_salida: '', 
        imagen: null as File | null,
    });

    // 1. RESETEO DE SUB-CATEGORÍA AL CAMBIAR CATEGORÍA PADRE
    useEffect(() => {
        if (data.categoria === 'GORRAS') {
            setData('tipo_limpieza', 'GORRA_STD');
        } else if (data.categoria === 'SNEAKERS') {
            setData('tipo_limpieza', 'LOW');
        } else if (data.categoria === 'BOLSAS') {
            setData('tipo_limpieza', 'BAG_SMALL');
        }
    }, [data.categoria]);

    // 2. CALCULADORA SÍNCRONA DE PRECIOS
    useEffect(() => {
        const calculatePrice = () => {
            if (data.categoria === 'SNEAKERS') {
                if (data.tipo_limpieza === 'LOW') return 100;
                if (data.tipo_limpieza === 'HIGH_PERFORMANCE') return 150;
                if (data.tipo_limpieza === 'PACK_3LOW') return 250;
                if (data.tipo_limpieza === 'PACK_2HIGH') return 250;
                if (data.tipo_limpieza === 'PACK_3MIX') return 350;
            }
            if (data.categoria === 'GORRAS') return 80;
            if (data.categoria === 'BOLSAS') {
                return data.tipo_limpieza === 'BAG_SMALL' ? 100 : 150;
            }
            return 100;
        };
        
        const newPrice = calculatePrice();
        if (data.precio !== newPrice) {
            setData('precio', newPrice);
        }
    }, [data.categoria, data.tipo_limpieza]);

    const handleStatusChange = (id: number, nuevoEstatus: string) => {
        router.patch(`/productos/${id}`, { estatus: nuevoEstatus }, {
            preserveScroll: true,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/productos', { forceFormData: true, onSuccess: () => { setIsDialogOpen(false); reset(); } });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Service_Log // CleanLabs" />
            
            <div className="relative min-h-screen bg-[#FDFDFD] text-[#1A1A1A] antialiased">
                <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" 
                     style={{ 
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px' 
                     }}>
                </div>

                <div className="relative z-10 flex flex-col p-8 gap-8">
                    <header className="flex justify-between items-center border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-6">
                            <AppLogo />
                            <div className="h-10 w-[1px] bg-gray-100 hidden sm:block" />
                            <div className="flex flex-col uppercase tracking-[0.2em] text-[10px] font-bold">
                                <span className="text-2xl tracking-tighter font-black italic" style={{ color: clBlue }}>SERVICE_LOG</span>
                                <p className="text-gray-400 mt-1 font-mono tracking-widest uppercase italic">CleanLabs // Intake_Unit_01</p>
                            </div>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)} className="rounded-full px-8 py-6 text-[10px] font-black uppercase text-white shadow-lg bg-[#0000FF] hover:scale-105 transition-transform">
                            + REGISTER_SERVICE
                        </Button>
                    </header>

                    <Input 
                        placeholder="SEARCH_BY_CLIENT_OR_SKU..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md rounded-full bg-white border-gray-200 px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
                    />

                    <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50 text-[9px] uppercase font-black">
                                <TableRow>
                                    <TableHead className="pl-8 py-6">Evidence / Model</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Status_Update</TableHead>
                                    <TableHead className="text-right pr-8 italic">Actions_</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-[10px] uppercase font-bold text-gray-700">
                                {productos.map((p) => (
                                    <TableRow key={p.id} className="group hover:bg-blue-50/30">
                                        <TableCell className="pl-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-[8px] text-gray-400 font-mono italic">
                                                    {p.imagen ? <img src={`/storage/${p.imagen}`} className="w-full h-full object-cover" /> : "NO_DATA"}
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-gray-900 font-black italic">{p.marca} {p.nombre}</span>
                                                    <span className="text-[8px] text-gray-400 font-mono">ID: {p.sku} // {p.cliente_nombre}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-400">{p.categoria}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="border border-gray-300 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter italic w-fit">
                                                    {p.tipo_limpieza}
                                                </span>
                                                <span className="text-[8px] text-blue-600 mt-1 font-mono">${p.precio}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <select 
                                                value={p.estatus} 
                                                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                                className="bg-transparent border-none text-[10px] font-black italic uppercase p-0 cursor-pointer focus:ring-0"
                                                style={{ color: clBlue }}
                                            >
                                                <option value="RECIBIDO">RECIBIDO</option>
                                                <option value="EN_PROCESO">EN_PROCESO</option>
                                                <option value="LISTO">LISTO</option>
                                                <option value="ENTREGADO">ENTREGADO</option>
                                            </select>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <button onClick={() => router.delete(`/productos/${p.id}`)} className="text-red-400 hover:text-red-600 font-black text-[9px] transition-colors">[ DELETE ]</button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl rounded-[32px] bg-white/95 backdrop-blur-2xl p-8 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black italic uppercase" style={{ color: clBlue }}>NEW_SERVICE_ENTRY</DialogTitle>
                        <p className="text-[9px] font-mono text-gray-400 tracking-tighter mt-1 italic uppercase">Protocol_v2.6 // Secure_Input</p>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6 py-6 text-left">
                            <div className="space-y-4 border-r border-gray-100 pr-6">
                                <div className="grid gap-1">
                                    <Label className="text-[8px] font-black uppercase text-gray-400 ml-1 italic">Client_Name</Label>
                                    <Input required value={data.cliente_nombre} onChange={e => setData('cliente_nombre', e.target.value)} className="rounded-xl bg-gray-50/50 border-none h-11 text-xs font-bold" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[8px] font-black uppercase text-gray-400 ml-1 italic">Brand</Label>
                                    <Input required value={data.marca} onChange={e => setData('marca', e.target.value)} className="rounded-xl bg-gray-50/50 border-none h-11 text-xs font-bold" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[8px] font-black uppercase text-gray-400 ml-1 italic">Model_Details</Label>
                                    <Input required value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="rounded-xl bg-gray-50/50 border-none h-11 text-xs font-bold" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid gap-1">
                                    <Label className="text-[8px] font-black uppercase text-gray-400 ml-1 italic">Category_Select</Label>
                                    <select value={data.categoria} onChange={e => setData('categoria', e.target.value)} className="w-full rounded-xl bg-gray-50/50 border-none text-[11px] font-bold p-3 appearance-none shadow-inner uppercase">
                                        <option value="SNEAKERS">SNEAKERS</option>
                                        <option value="GORRAS">GORRAS</option>
                                        <option value="BOLSAS">BOLSAS</option>
                                    </select>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[8px] font-black uppercase text-gray-400 ml-1 italic">Service_Type</Label>
                                    <select value={data.tipo_limpieza} onChange={e => setData('tipo_limpieza', e.target.value)} className="w-full rounded-xl bg-gray-50/50 border-none text-[11px] font-bold p-3 appearance-none font-mono">
                                        {data.categoria === 'SNEAKERS' && (
                                            <>
                                                <option value="LOW">LOW_STANDARD ($100)</option>
                                                <option value="HIGH_PERFORMANCE">HIGH_PERFORMANCE ($150)</option>
                                                <option value="PACK_3LOW">3 LOW x $250</option>
                                                <option value="PACK_2HIGH">2 HIGH x $250</option>
                                                <option value="PACK_3MIX">2 LOW + 1 HIGH x $350</option>
                                            </>
                                        )}
                                        {data.categoria === 'GORRAS' && <option value="GORRA_STD">CAP CLEANING ($80)</option>}
                                        {data.categoria === 'BOLSAS' && (
                                            <>
                                                <option value="BAG_SMALL">BAG SMALL ($100)</option>
                                                <option value="BAG_LARGE">BAG LARGE ($150)</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <div className="grid gap-1">
                                        <Label className="text-[8px] font-black uppercase text-gray-400 ml-1 italic">Date_In</Label>
                                        <Input type="date" required value={data.fecha_ingreso} onChange={e => setData('fecha_ingreso', e.target.value)} className="rounded-xl bg-gray-50/50 border-none h-11 text-[10px] font-bold" />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="text-[8px] font-black uppercase text-blue-600 ml-1 italic">Date_Out</Label>
                                        <Input type="date" required value={data.fecha_salida} onChange={e => setData('fecha_salida', e.target.value)} className="rounded-xl bg-blue-50/50 border-none h-11 text-[10px] font-bold text-blue-700 shadow-inner" />
                                    </div>
                                </div>
                                <div className="flex justify-end pr-2 pt-1">
                                    <span className="text-[12px] font-black italic text-blue-600 tracking-tighter">${data.precio} MXN</span>
                                </div>
                            </div>
                            <div className="col-span-2 grid gap-1 pt-2">
                                <Label className="text-[8px] font-black uppercase text-gray-400 ml-1 italic">Evidence_Photo_Intake</Label>
                                <Input type="file" accept="image/*" onChange={e => setData('imagen', e.target.files ? e.target.files[0] : null)} className="rounded-xl bg-gray-100/50 border-dashed border-2 border-gray-200 text-[10px] h-14" />
                            </div>
                        </div>
                        <DialogFooter className="flex justify-between items-center border-t border-gray-100 pt-6">
                            <button type="button" onClick={() => setIsDialogOpen(false)} className="text-[9px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors italic">Abort_Process</button>
                            <Button type="submit" disabled={processing} className="rounded-full px-10 text-white font-black uppercase text-[9px] h-12 shadow-xl hover:scale-105 transition-transform bg-[#0000FF]">
                                {processing ? 'INITIALIZING...' : 'INITIALIZE_SERVICE_'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}