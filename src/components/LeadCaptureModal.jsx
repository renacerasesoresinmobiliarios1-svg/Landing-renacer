import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  ArrowUpRight, 
  User, 
  Phone, 
  Mail,
  Calendar,
  Clock,
  Building2, 
  Loader2, 
  ShieldCheck,
  CheckCircle2,
  Sparkles 
} from 'lucide-react';

export default function LeadCaptureModal({
  isOpen,
  onClose,
  property,
  authUser,
  initialMode = 'info', // 'info' o 'visita'
  onLeadCaptured
}) {
  const [activeTab, setActiveTab] = useState(initialMode); // 'info' o 'visita'
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fechaVisita, setFechaVisita] = useState('');
  const [turnoVisita, setTurnoVisita] = useState('Mañana (9:00 - 13:00)');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen || !property) return null;

  const phoneAsesor = property.telefono_asesor || property.telefonoAsesor || '526141234567';
  const cleanAdvisorPhone = String(phoneAsesor).replace(/\D/g, '');
  const propertyTitle = property.titulo || 'Inmueble';
  const propertyCity = property.ciudad || property.ubicacion || 'México';

  // Fecha mínima para visitas (mañana)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const isVisit = activeTab === 'visita';
    const clientName = authUser ? authUser.name : nombre;
    const clientPhone = authUser ? (authUser.telefono || 'Sin teléfono') : telefono;
    const clientEmail = authUser ? authUser.email : email;

    const leadData = {
      property_id: property.id,
      cliente_nombre: clientName,
      cliente_telefono: clientPhone,
      cliente_email: clientEmail || null,
      origen: isVisit ? 'Agendador de Visitas' : 'WhatsApp Web',
      estatus: isVisit ? 'Cita Agendada' : 'Nuevo',
      fecha_visita: isVisit ? fechaVisita : null,
      turno_visita: isVisit ? turnoVisita : null,
      notas: isVisit 
        ? `CITA SOLICITADA para el día ${fechaVisita} en turno ${turnoVisita}. ${notas ? `Notas: ${notas}` : ''}`
        : (notas || `Interesado en información sobre: ${propertyTitle}`),
    };

    let whatsappMsg = '';
    if (isVisit) {
      whatsappMsg = `🏛️ *SOLICITUD DE VISITA - RENACER*\n\n` +
        `👤 *Cliente:* ${clientName}\n` +
        `📱 *Teléfono:* ${clientPhone}\n` +
        `🏡 *Propiedad:* ${propertyTitle} (${propertyCity})\n` +
        `📅 *Fecha solicitada:* ${fechaVisita || 'Por definir'}\n` +
        `⏰ *Horario preferido:* ${turnoVisita}\n` +
        (notas ? `💬 *Comentarios:* ${notas}\n\n` : '\n') +
        `_Enviado desde portal Renacer Inmobiliario_`;
    } else {
      whatsappMsg = `Hola, me interesa recibir información detallada sobre la propiedad: *${propertyTitle}* ubicada en *${propertyCity}*. Mi nombre es ${clientName}.`;
    }

    try {
      // 1. Guardar Lead en Backend
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(leadData),
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

      // 3. Abrir WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanAdvisorPhone}&text=${encodeURIComponent(whatsappMsg)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      onClose();
    } catch (err) {
      console.error('Error creating lead:', err);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanAdvisorPhone}&text=${encodeURIComponent(whatsappMsg)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-[#141416] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#D4AF37]/35 overflow-hidden text-white my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-[#0A0A0A] p-5 sm:p-6 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] text-black flex items-center justify-center font-black shadow-md shadow-[#D4AF37]/20">
              {activeTab === 'visita' ? <Calendar className="w-5 h-5" /> : <MessageCircle className="w-5 h-5 fill-black/20" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                {activeTab === 'visita' ? 'Agendar Visita Guiada' : 'Contacto con Asesor'}
              </h3>
              <p className="text-xs text-[#D4AF37]">
                Atención directa con certeza jurídica
              </p>
            </div>
          </div>

          {/* Selector de Pestañas (Consulta rápida vs Agendar Visita) */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#1A1A1E] rounded-xl border border-white/10 mt-2">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'info'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Consulta Rápida
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('visita')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'visita'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Agendar Visita
            </button>
          </div>
        </div>

        {/* Resumen de Propiedad */}
        <div className="px-5 py-3 bg-[#1A1A1E] border-b border-white/5 flex items-center gap-3">
          <img 
            src={property.imagen} 
            alt={property.titulo} 
            className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" 
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{property.titulo}</p>
            <p className="text-[11px] text-slate-400 truncate">{property.ubicacion}</p>
            <p className="text-xs font-black text-[#D4AF37]">{property.precio_texto || `$${property.precio?.toLocaleString('es-MX')} MXN`}</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          {!authUser && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Tu Nombre Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Ing. Roberto Garza"
                    className="w-full bg-[#1F1F24] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Número de Teléfono / WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. 614 123 4567"
                    className="w-full bg-[#1F1F24] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {activeTab === 'visita' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Correo Electrónico (Opcional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-[#1F1F24] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Campos exclusivos de Agendamiento de Cita */}
          {activeTab === 'visita' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Fecha Preferida *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={fechaVisita}
                    onChange={(e) => setFechaVisita(e.target.value)}
                    className="w-full bg-[#1F1F24] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Horario Deseado</label>
                <select
                  value={turnoVisita}
                  onChange={(e) => setTurnoVisita(e.target.value)}
                  className="w-full bg-[#1F1F24] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Mañana (9:00 - 13:00)">Mañana (9:00 - 13:00)</option>
                  <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                  <option value="Sábado (10:00 - 14:00)">Sábado (10:00 - 14:00)</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Comentarios o dudas adicionales</label>
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder={activeTab === 'visita' ? 'Ej. Me interesa ver la terraza y estacionamiento...' : 'Ej. ¿Aceptan crédito bancario?'}
              className="w-full bg-[#1F1F24] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
            className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                {activeTab === 'visita' ? <Calendar className="w-4 h-4 fill-black/20" /> : <MessageCircle className="w-4 h-4 fill-black/20" />}
                <span>{activeTab === 'visita' ? 'Confirmar y Abrir WhatsApp' : 'Abrir WhatsApp con Asesor'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Tus datos están protegidos bajo estricto secreto profesional.
          </p>
        </form>
      </div>
    </div>
  );
}
