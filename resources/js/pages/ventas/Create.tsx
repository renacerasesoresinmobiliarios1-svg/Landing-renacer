import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function VentasCreate({ clientes, productos }: { clientes: any[], productos: any[] }) {
    const { data, setData, post, processing } = useForm({
        cliente_id: '',
        metodo_pago: 'Efectivo',
        impuesto: 0,
        notas: '',
        items: [{ producto_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }]
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Ventas', href: '/ventas' },
        { title: 'Nueva Venta', href: '/ventas/create' },
    ];

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

    const total = data.items.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/ventas');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Venta // CleanLabs" />
            
            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-2xl font-black italic uppercase text-black mb-8 tracking-tighter">Nueva Venta</h1>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* COLUMNA IZQUIERDA: DATOS DE LA VENTA */}
                    <div className="md:col-span-5 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm space-y-6">
                        <h2 className="text-sm font-black uppercase italic text-black border-b border-slate-50 pb-2">Datos de la Venta</h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Cliente</Label>
                                <select 
                                    className="w-full rounded-xl border-slate-200 text-xs font-bold p-3 bg-slate-50/50"
                                    value={data.cliente_id}
                                    onChange={e => setData('cliente_id', e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Método de Pago</Label>
                                <select 
                                    className="w-full rounded-xl border-slate-200 text-xs font-bold p-3 bg-slate-50/50"
                                    value={data.metodo_pago}
                                    onChange={e => setData('metodo_pago', e.target.value)}
                                >
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Impuesto</Label>
                                <Input 
                                    type="number" 
                                    className="rounded-xl border-slate-200 bg-slate-50/50 font-bold"
                                    value={data.impuesto}
                                    onChange={e => setData('impuesto', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Notas</Label>
                                <Input 
                                    className="rounded-xl border-slate-200 bg-slate-50/50 font-bold"
                                    value={data.notas}
                                    onChange={e => setData('notas', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: PRODUCTOS Y TOTAL */}
                    <div className="md:col-span-7 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-2">
                            <h2 className="text-sm font-black uppercase italic text-black">Productos</h2>
                            <Button type="button" variant="outline" className="text-[10px] font-bold uppercase rounded-xl">Agregar Producto</Button>
                        </div>

                        <div className="flex-1 space-y-4">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex gap-4 items-end bg-slate-50/30 p-4 rounded-2xl border border-slate-50">
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-[9px] font-bold uppercase text-slate-400">Producto</Label>
                                        <select 
                                            className="w-full rounded-xl border-slate-200 text-xs font-bold p-2 bg-white"
                                            onChange={e => {
                                                const p = productos.find(x => x.id === parseInt(e.target.value));
                                                const newItems = [...data.items];
                                                newItems[index] = { ...newItems[index], producto_id: e.target.value, precio_unitario: p?.precio || 0 };
                                                setData('items', newItems);
                                            }}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {productos.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nombre} - ${p.precio} (Stock: {p.stock})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-20 space-y-2">
                                        <Label className="text-[9px] font-bold uppercase text-slate-400">Cantidad</Label>
                                        <Input type="number" className="rounded-xl border-slate-200 text-center font-bold" value={item.cantidad} />
                                    </div>
                                    <div className="w-24 text-right space-y-2">
                                        <Label className="text-[9px] font-bold uppercase text-slate-400">Subtotal</Label>
                                        <p className="text-xs font-black p-2">{formatCurrency(item.precio_unitario * item.cantidad)}</p>
                                    </div>
                                    <Button type="button" variant="destructive" className="rounded-xl p-2 h-10 w-10">X</Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-6 space-y-2 text-right">
                            <div className="flex justify-end gap-12 text-xs font-bold text-slate-400 uppercase">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-end gap-12 text-xs font-bold text-slate-400 uppercase">
                                <span>Impuesto:</span>
                                <span>{formatCurrency(data.impuesto)}</span>
                            </div>
                            <div className="flex justify-end gap-12 text-2xl font-black italic text-[#0000FF] tracking-tighter">
                                <span>Total:</span>
                                <span>{formatCurrency(total + data.impuesto)}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-4">
                            <Button type="button" variant="outline" className="rounded-xl px-8 font-bold text-xs uppercase">Cancelar</Button>
                            <Button 
                                disabled={processing} 
                                className="bg-black text-white rounded-xl px-8 font-bold text-xs uppercase hover:bg-[#0000FF] transition-colors"
                            >
                                Registrar Venta
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}