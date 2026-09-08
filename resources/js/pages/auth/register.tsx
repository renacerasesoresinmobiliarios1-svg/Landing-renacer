import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, UserPlus, Loader2, ArrowLeft } from 'lucide-react';
import Logo from '../../../../src/components/Logo';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="bg-[#000000] text-white min-h-screen font-sans flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
            <Head title="Crear Cuenta | RENACER - Grupo Inmobiliario" />

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
                    
                    <div className="text-center mb-8">
                        <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-[#D4AF37] block">
                            RENACER - Grupo Inmobiliario
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                            Crear Cuenta de Cliente
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Guarda tus propiedades favoritas y recibe atención personalizada.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <User className="w-4 h-4" />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Lic. Roberto Valenzuela"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none" 
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-400 font-bold mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
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
                                    placeholder="roberto@ejemplo.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none" 
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-400 font-bold mt-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="password" 
                                        required
                                        minLength={6}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                                    Confirmar
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="password" 
                                        required
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none" 
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.password && <p className="text-xs text-red-400 font-bold mt-1">{errors.password}</p>}

                        <div className="pt-3">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] hover:brightness-110 active:brightness-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                                        <span>Registrando...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 stroke-[2.5]" />
                                        <span>Crear Registro de Usuario</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-5 border-t border-white/5">
                        <Link 
                            href="/login" 
                            className="text-xs font-bold text-slate-400 hover:text-[#D4AF37] transition-colors"
                        >
                            ¿Ya tienes cuenta? <span className="text-[#D4AF37] underline">Iniciar Sesión</span>
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