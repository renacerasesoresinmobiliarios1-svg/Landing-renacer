import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, LogIn, Loader2, ArrowLeft } from 'lucide-react';
import Logo from '../../../../src/components/Logo';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="bg-[#000000] text-white min-h-screen font-sans flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
            <Head title="Iniciar Sesión | RENACER - Grupo Inmobiliario" />

            {/* Barra Superior */}
            <header className="border-b border-[#D4AF37]/20 bg-[#0A0A0A] px-6 sm:px-12 py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Logo className="h-10 sm:h-12 w-auto" alt="RENACER - Grupo Inmobiliario" />
                </Link>

                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-[#D4AF37] transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver al Inicio</span>
                </Link>
            </header>

            {/* Formulario Central */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black relative overflow-hidden">
                    
                    {/* Luz dorada ambiental */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full" />

                    <div className="text-center mb-8">
                        <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-[#D4AF37] block">
                            RENACER - Grupo Inmobiliario
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                            Acceso a Plataforma
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Ingresa tus credenciales autorizadas de director, asesor o cliente.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="usuario@renacer.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none transition-colors" 
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-400 font-bold mt-1.5">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none transition-colors" 
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-400 font-bold mt-1.5">{errors.password}</p>}
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] hover:brightness-110 active:brightness-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                                        <span>Verificando...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4 stroke-[2.5]" />
                                        <span>Entrar al Panel</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-5 border-t border-white/5">
                        <Link 
                            href="/register" 
                            className="text-xs font-bold text-slate-400 hover:text-[#D4AF37] transition-colors"
                        >
                            ¿No tienes cuenta? <span className="text-[#D4AF37] underline">Registrarme como Cliente</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Pie de Página */}
            <footer className="py-6 text-center text-xs text-slate-500 border-t border-white/5">
                © {new Date().getFullYear()} RENACER - Grupo Inmobiliario. Todos los derechos reservados.
            </footer>
        </div>
    );
}