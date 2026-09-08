import React, { useState } from 'react';
import { 
  Building2, 
  Menu, 
  X, 
  LogIn, 
  ShieldCheck, 
  Heart,
  LogOut,
  User,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ 
  authUser = null,
  favoritesCount = 0,
  onOpenFavorites
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
    } catch (e) {
      console.log('Logout:', e);
    }
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md border-b border-[#D4AF37]/25 transition-all duration-300 shadow-xl shadow-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* 1. Logotipo Oficial Integrado Limpio (Sin recuadro blanco) */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center group transition-transform hover:scale-[1.02]"
              title="RENACER - Grupo Inmobiliario"
            >
              <Logo className="h-12 sm:h-16 w-auto" alt="RENACER - Grupo Inmobiliario" />
            </a>
          </div>

          {/* 2. Enlaces Centrales */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-[#D4AF37] transition-colors"
            >
              Inicio
            </a>
            <a
              href="#catalogo"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-[#D4AF37] transition-colors"
            >
              Catálogo
            </a>
            <a
              href="#nosotros"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-[#D4AF37] transition-colors"
            >
              Nosotros
            </a>
            <a
              href="#contacto"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-[#D4AF37] transition-colors"
            >
              Contacto
            </a>
          </nav>

          {/* 3. Acciones Derecha (Favoritos & Autenticación) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Botón de Favoritos */}
            <button
              onClick={onOpenFavorites}
              id="btn-navbar-favorites"
              className="relative p-2.5 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 text-slate-200 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all cursor-pointer shadow-md"
              title="Ver mis propiedades favoritas"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-[10px] font-black text-black shadow-md ring-2 ring-[#000000]">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Usuario Autenticado */}
            {authUser ? (
              <div className="flex items-center gap-3">
                {authUser.role === 'admin' || authUser.role === 'vendedor' ? (
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#121212] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#1A1A1A] text-xs font-black uppercase tracking-wider transition-all shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Panel {authUser.role === 'admin' ? 'Director' : 'Ventas'}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#121212] border border-white/10 text-xs text-slate-200">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold truncate max-w-[120px]">{authUser.name}</span>
                  </div>
                )}

                <button
                  type="button"
                  id="btn-navbar-logout"
                  onClick={handleLogout}
                  className="p-2.5 rounded-2xl bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900/60 hover:text-white transition-colors cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Botón Iniciar Sesión en Oro Brillante */
              <a
                href="/login"
                id="btn-navbar-login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] hover:brightness-110 active:brightness-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Iniciar Sesión</span>
              </a>
            )}

          </div>

          {/* 4. Botón Móvil */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl bg-[#121212] border border-[#D4AF37]/30 text-slate-300"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-black text-black">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-[#D4AF37] hover:bg-[#121212] focus:outline-none cursor-pointer"
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isOpen && (
        <div className="md:hidden border-b border-[#D4AF37]/20 bg-[#0A0A0A] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 pt-2">
            <a
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-[#121212] hover:text-[#D4AF37]"
            >
              Inicio
            </a>
            <a
              href="#catalogo"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#121212] hover:text-[#D4AF37]"
            >
              Catálogo de Propiedades
            </a>
            <a
              href="#nosotros"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#121212] hover:text-[#D4AF37]"
            >
              Sobre Nosotros
            </a>
            <a
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#121212] hover:text-[#D4AF37]"
            >
              Contacto
            </a>
          </nav>

          <div className="pt-4 border-t border-white/10">
            {authUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-xs font-bold text-slate-400">
                  Conectado como: <span className="text-[#D4AF37]">{authUser.name}</span>
                </div>
                {(authUser.role === 'admin' || authUser.role === 'vendedor') && (
                  <a
                    href="/dashboard"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#121212] border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ir a Mi Panel de Control</span>
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-bold"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black font-black text-xs uppercase tracking-wider shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
