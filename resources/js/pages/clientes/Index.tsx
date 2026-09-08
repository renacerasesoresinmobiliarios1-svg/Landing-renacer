import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
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

interface Cliente {
    id: number; nombre: string; email: string; direccion: string | null;
    rfc: string | null; telefono: string | null; regimen_fiscal: string | null;
    created_at: string;
}

interface Props { clientes: Cliente[]; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'SYSTEM_DASHBOARD', href: '/dashboard' },
    { title: 'SUBJECT_BASE', href: '/clientes' },
];

export default function ClientesIndex({ clientes }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const clBlue = "#0000FF";

    const { data, setData, post, put, reset, errors, processing } = useForm({
        nombre: '', email: '', direccion: '', rfc: '', telefono: '', regimen_fiscal: '',
    });

    const filteredClientes = useMemo(() => {
        return clientes.filter(cliente => 
            cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cliente.telefono && cliente.telefono.includes(searchTerm)) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clientes, searchTerm]);

    const openCreate = () => { 
        reset(); 
        setEditingCliente(null); 
        setIsDialogOpen(true); 
    };
    
    const openEdit = (cliente: Cliente) => {
        setData({
            nombre: cliente.nombre, 
            email: cliente.email, 
            direccion: cliente.direccion || '',
            rfc: cliente.rfc || '', 
            telefono: cliente.telefono || '', 
            regimen_fiscal: cliente.regimen_fiscal || '',
        });
        setEditingCliente(cliente);
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCliente) {
            put(`/clientes/${editingCliente.id}`, { 
                onSuccess: () => { setIsDialogOpen(false); reset(); } 
            });
        } else {
            post('/clientes', { 
                onSuccess: () => { setIsDialogOpen(false); reset(); } 
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subject_Base // CleanLabs" />
            
            <div className="relative min-h-screen bg-[#FDFDFD] text-[#1A1A1A] antialiased">
                {/* GRID DE FONDO */}
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
                                <span className="text-2xl tracking-tighter font-black italic" style={{ color: clBlue }}>SUBJECT_BASE</span>
                                <p className="text-gray-400 mt-1 font-mono tracking-widest uppercase italic">CleanLabs // Database_v1</p>
                            </div>
                        </div>
                        <Button onClick={openCreate} className="rounded-full px-8 py-6 text-[10px] font-black uppercase text-white shadow-lg bg-[#0000FF] hover:scale-105 transition-transform active:scale-95">
                            + REGISTER_SUBJECT
                        </Button>
                    </header>

                    {/* BUSCADOR */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-[8px] font-black uppercase text-gray-400 ml-4 italic tracking-widest">Search_Subject_Log</Label>
                        <div className="relative w-full max-w-md">
                            <Input 
                                placeholder="NAME_ PHONE_ OR_EMAIL..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-full bg-white border-2 border-black/[0.03] shadow-sm px-6 h-12 text-[10px] font-bold uppercase tracking-widest focus:border-[#0000FF]/50 transition-all italic"
                            />
                        </div>
                    </div>

                    {/* TABLA */}
                    <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50 text-[9px] uppercase font-black">
                                <TableRow>
                                    <TableHead className="pl-8 py-6">Subject_Identity</TableHead>
                                    <TableHead>Contact_Info</TableHead>
                                    <TableHead>Fiscal_Data</TableHead>
                                    <TableHead className="text-right pr-8 italic">Actions_</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-[10px] uppercase font-bold text-gray-700">
                                {filteredClientes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-20 text-center text-gray-300 font-mono italic">
                                            [ NO_RESULTS_FOR_CURRENT_SCAN ]
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClientes.map((cliente) => (
                                        <TableRow key={cliente.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-black italic">{cliente.nombre}</span>
                                                    <span className="text-[8px] text-gray-400 font-mono italic">ID_REF: 00{cliente.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span>{cliente.email}</span>
                                                    <span className="text-gray-400 font-mono text-[9px]">{cliente.telefono || 'NO_PHONE'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-mono">{cliente.rfc || 'NO_RFC'}</span>
                                                    <span className="text-[8px] text-gray-400">{cliente.regimen_fiscal || 'CONSUMIDOR_FINAL'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <button onClick={() => openEdit(cliente)} className="text-[#0000FF] font-black hover:underline">[ EDIT ]</button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* --- MODAL DE REGISTRO / EDICIÓN --- */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none shadow-2xl p-8 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase mb-6" style={{ color: clBlue }}>
                            {editingCliente ? 'UPDATE_SUBJECT_INFO' : 'REGISTER_NEW_SUBJECT'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label className="text-[9px] font-black uppercase italic ml-2">Full_Name_</Label>
                                <Input 
                                    value={data.nombre} 
                                    onChange={e => setData('nombre', e.target.value)}
                                    className="rounded-xl border-slate-100 bg-slate-50/50 uppercase text-[10px] font-bold" 
                                    placeholder="NATALIA PADILLA..."
                                />
                                {errors.nombre && <p className="text-red-500 text-[8px] font-black italic uppercase">{errors.nombre}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase italic ml-2">Email_Address_</Label>
                                <Input 
                                    type="email" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)}
                                    className="rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-bold"
                                />
                                {errors.email && <p className="text-red-500 text-[8px] font-black italic uppercase">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase italic ml-2">Phone_Number_</Label>
                                <Input 
                                    value={data.telefono} 
                                    onChange={e => setData('telefono', e.target.value)}
                                    className="rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase italic ml-2">RFC_Fiscal_ID</Label>
                                <Input 
                                    value={data.rfc} 
                                    onChange={e => setData('rfc', e.target.value)}
                                    className="rounded-xl border-slate-100 bg-slate-50/50 uppercase text-[10px] font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase italic ml-2">Fiscal_Regime</Label>
                                <Input 
                                    value={data.regimen_fiscal} 
                                    onChange={e => setData('regimen_fiscal', e.target.value)}
                                    className="rounded-xl border-slate-100 bg-slate-50/50 uppercase text-[10px] font-bold"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-6">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full rounded-full bg-[#0000FF] text-white font-black italic uppercase tracking-widest h-12 shadow-xl hover:bg-blue-700 transition-all"
                            >
                                {processing ? 'PROCESSING_DATA...' : editingCliente ? 'UPDATE_DATABASE' : 'COMMIT_TO_DATABASE'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}