import { Head, Link, useForm } from '@inertiajs/react';
import { register } from '@/routes';

export default function Login() {
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
    });

    return (
        <div className="bg-white text-[#1A1A1A] antialiased min-h-screen font-sans flex flex-col">
            <Head title="Login // Molecular Care" />

            {/* HEADER (Igual al Welcome para consistencia) */}
            <nav className="flex justify-between items-center px-10 py-8 border-b border-gray-100 uppercase tracking-[0.2em] text-[10px] font-bold">
                <div className="flex items-center gap-4">
                    <span className="text-xl tracking-tighter font-black text-black">NP_LAB</span>
                    <div className="h-4 w-[1px] bg-gray-300"></div>
                    <span className="text-gray-400">Chihuahua, MX</span>
                </div>
                <div className="flex gap-8 items-center">
                    <span className="text-[#0000FF] animate-pulse">● System Active</span>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center px-10 py-20">
                {/* CONTENEDOR DE IDENTIDAD (Logo + Título) */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="inline-block border-[3px] border-black p-4 mb-10 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <span className="block text-[10px] font-mono leading-none text-left opacity-40">08</span>
                        <span className="text-5xl font-black leading-none tracking-tighter">Cl</span>
                        <span className="block text-[6px] font-mono mt-1 tracking-widest uppercase">CleanLabs</span>
                    </div>

                    <h1 className="text-7xl font-black leading-[0.8] tracking-tighter uppercase italic">
                        SYSTEM<br /><span className="text-[#0000FF]">ACCESS</span>
                    </h1>
                </div>

                {/* FORMULARIO (Separado para evitar el amontonamiento) */}
                <div className="w-full max-w-md bg-[#FBFBFB] border border-gray-100 p-12 relative shadow-sm">
                    <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-gray-300">
                        AUTH_REQUIRED_V.2.6
                    </div>
                    
                    <form onSubmit={(e) => { e.preventDefault(); post('/login'); }} className="space-y-10">
                        <div className="space-y-2">
                            <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-gray-400">Email_Address</label>
                            <input 
                                type="email" 
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full border-0 border-b-2 border-gray-100 focus:border-[#0000FF] focus:ring-0 bg-transparent py-2 font-bold uppercase text-sm tracking-widest" 
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-gray-400">Access_Key</label>
                                <span className="text-[8px] font-mono text-gray-300 uppercase cursor-help hover:text-black">Forgot?</span>
                            </div>
                            <input 
                                type="password" 
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full border-0 border-b-2 border-gray-100 focus:border-[#0000FF] focus:ring-0 bg-transparent py-2 font-bold text-sm" 
                            />
                        </div>

                        <button 
                            disabled={processing}
                            className="group relative w-full border-2 border-black bg-white py-5 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-black hover:text-white"
                        >
                            Verificar Credenciales →
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <Link href={register()} className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300 hover:text-[#0000FF] transition-colors">
                            Solicitar Nuevo Acceso
                        </Link>
                    </div>
                </div>
            </main>

            {/* FOOTER TÉCNICO */}
            <footer className="px-10 py-10 bg-[#FBFBFB] border-t border-gray-100 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-400">
                    <p>User: Natalia Padilla // Access_Mode</p>
                    <p className="mt-1">Status: Waiting_For_Verification</p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-black"></div>
                    <div className="w-2 h-2 bg-[#0000FF]"></div>
                </div>
            </footer>
        </div>
    );
}