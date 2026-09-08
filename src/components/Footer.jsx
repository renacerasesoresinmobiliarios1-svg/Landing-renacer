import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000000] text-slate-400 border-t border-[#D4AF37]/25 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* 1. Identidad de Marca (Sin pastilla blanca) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
              <Logo className="h-14 sm:h-16 w-auto" alt="RENACER - Grupo Inmobiliario" />
            </a>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Firma inmobiliaria especializada en comercialización, arrendamiento y gestión patrimonial de residencias y desarrollos exclusivos en Chihuahua y Guadalajara.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Certeza Jurídica y Ética Comercial</span>
            </div>
          </div>

          {/* 2. Enlaces Rápidos */}
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-4 text-[#D4AF37]">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <a href="/" className="hover:text-[#D4AF37] transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-[#D4AF37] transition-colors">Catálogo de Inmuebles</a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-[#D4AF37] transition-colors">Sobre Renacer</a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-[#D4AF37] transition-colors">Sedes Corporativas</a>
              </li>
              <li>
                <a href="/login" className="hover:text-[#D4AF37] transition-colors">Acceso a Plataforma</a>
              </li>
            </ul>
          </div>

          {/* 3. Sede Chihuahua */}
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-4 text-[#D4AF37]">
              Sede Chihuahua
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-1.5 leading-snug">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>San Felipe II Etapa, Chihuahua, Chih.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>(614) 123-4567</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>chihuahua@renacer.com</span>
              </p>
            </div>
          </div>

          {/* 4. Sede Guadalajara */}
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-4 text-[#D4AF37]">
              Sede Guadalajara
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-1.5 leading-snug">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Chapalita, Guadalajara, Jal.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>(33) 9876-5432</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>guadalajara@renacer.com</span>
              </p>
            </div>
          </div>

        </div>

        {/* Barra de Derechos de Autor */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} RENACER - Grupo Inmobiliario. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[#D4AF37] font-bold">Chihuahua & Guadalajara</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
