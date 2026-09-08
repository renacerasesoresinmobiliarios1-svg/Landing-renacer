import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  ArrowUpRight, 
  User, 
  Phone, 
  Building2, 
  Loader2, 
  ShieldCheck,
  Sparkles 
} from 'lucide-react';
import Logo from './Logo';

export default function LeadCaptureModal({
  isOpen,
  onClose,
  property,
  authUser,
  onLeadCaptured
}) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !property) return null;

  const phoneAsesor = property.telefono_asesor || property.telefonoAsesor || '526141234567';
  const cleanAdvisorPhone = String(phoneAsesor).replace(/\D/g, '');
  const propertyTitle = property.titulo || 'Inmueble';
  const propertyCity = property.ciudad || property.ubicacion || 'México';
  const defaultWhatsAppMsg = `Hola, me interesa información sobre la propiedad: ${propertyTitle} - Ubicada en ${propertyCity}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Guardar Lead en Backend
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          property_id: property.id,
          cliente_nombre: authUser ? authUser.name : nombre,
          cliente_telefono: authUser ? (authUser.telefono || 'Sin teléfono') : telefono,
          origen: 'WhatsApp',
          notas: `Interesado en: ${propertyTitle}`,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (onLeadCaptured && data.data) {
        onLeadCaptured(data.data);
      }

      // 2. Registrar clic silencioso
      fetch(`/api/properties/${property.id}/whatsapp-click`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      }).catch(() => {});

      // 3. Abrir WhatsApp en nueva pestaña
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanAdvisorPhone}&text=${encodeURIComponent(defaultWhatsAppMsg)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      onClose();
    } catch (err) {
      console.error('Error creating lead:', err);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanAdvisorPhone}&text=${encodeURIComponent(defaultWhatsAppMsg)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#141416] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#D4AF37]/35 overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-[#0A0A0A] p-6 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] text-black flex items-center justify-center font-black shadow-md shadow-[#D4AF37]/20">
              <MessageCircle className="w-5 h-5 fill-black/20" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block leading-none">
                Atención Personalizada
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">Contactar Asesor Renacer</h3>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-1">
            {property.titulo}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/20 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>Ingresa tus datos para conectarte con el asesor asignado a este inmueble vía WhatsApp.</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Tu Nombre Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Lic. Roberto Lozano"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Teléfono / WhatsApp
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 614 123 4567"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
              className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Conectando con Asesor...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 fill-black/20" />
                  <span>Abrir WhatsApp con Asesor</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
