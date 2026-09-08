import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function ContactSection() {
  const branches = [
    {
      city: 'Sede Chihuahua',
      zone: 'San Felipe II Etapa, Chihuahua, Chih.',
      address: 'Av. Antonio de Deza Y Ulloa 2114, San Felipe II Etapa, 31203 Chihuahua, Chih.',
      phone: '+52 (614) 123-4567',
      whatsappPhone: '526141234567',
      email: 'chihuahua@renacer.com',
      hours: 'Lunes a Viernes: 9:00 AM - 7:00 PM | Sábados: 10:00 AM - 2:00 PM',
      manager: 'Lic. Jorge Valenzuela (Director)',
    },
    {
      city: 'Sede Guadalajara',
      zone: 'Chapalita, Guadalajara, Jal.',
      address: 'Calle Fray Juan de Zumárraga 341, Chapalita, 44500 Guadalajara, Jal.',
      phone: '+52 (33) 9876-5432',
      whatsappPhone: '523398765432',
      email: 'guadalajara@renacer.com',
      hours: 'Lunes a Viernes: 9:00 AM - 7:00 PM | Sábados: 10:00 AM - 3:00 PM',
      manager: 'Mariana Ruiz (Coordinadora Comercial)',
    }
  ];

  return (
    <section id="contacto" className="bg-[#000000] py-16 md:py-24 text-white border-t border-[#D4AF37]/25 relative overflow-hidden">
      
      {/* Luz dorada ambiental */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Encabezado de Sección */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121212] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Presencia Corporativa</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Nuestras Sedes Corporativas
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Visítanos en nuestras oficinas o contáctanos de forma inmediata vía WhatsApp con atención personalizada de nuestros directores y asesores comerciales.
          </p>
        </div>

        {/* Rejilla de Sedes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {branches.map((branch, idx) => (
            <div 
              key={idx}
              className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 shadow-2xl shadow-black transition-all flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                {/* Cabecera de Sede */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black flex items-center justify-center font-black shadow-md shadow-[#D4AF37]/20 shrink-0">
                      <Building2 className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest block">
                        Oficina Regional
                      </span>
                      <h3 className="text-xl font-extrabold text-white">{branch.city}</h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#171717] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-black">
                    {branch.zone.split(',')[0]}
                  </span>
                </div>

                {/* Datos de Contacto */}
                <div className="space-y-4 text-xs sm:text-sm">
                  
                  {/* Dirección en Texto */}
                  <div className="flex items-start gap-3 text-slate-300">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                    <div>
                      <span className="block font-bold text-white">Dirección:</span>
                      <span className="text-slate-300 leading-snug">{branch.address}</span>
                    </div>
                  </div>

                  {/* Horario */}
                  <div className="flex items-start gap-3 text-slate-300">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                    <div>
                      <span className="block font-bold text-white">Horario de Atención:</span>
                      <span className="text-slate-400 text-xs">{branch.hours}</span>
                    </div>
                  </div>

                  {/* Teléfono y Correo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex items-center gap-2.5 text-slate-300 bg-[#141414] p-2.5 rounded-xl border border-white/5">
                      <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="text-xs font-bold">{branch.phone}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-300 bg-[#141414] p-2.5 rounded-xl border border-white/5">
                      <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="text-xs font-bold truncate">{branch.email}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Botón de Contacto Directo por WhatsApp */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <a
                  href={`https://api.whatsapp.com/send?phone=${branch.whatsappPhone}&text=${encodeURIComponent(`Hola, me comunico desde la web de RENACER - Grupo Inmobiliario para solicitar información sobre propiedades en ${branch.city}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] hover:brightness-110 active:brightness-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 fill-black/20" />
                  <span>Contactar Sede ({branch.city.replace('Sede ', '')})</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
