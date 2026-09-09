import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Building2, 
  UserCheck, 
  Trophy, 
  Link2, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  BookOpen, 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  Download, 
  Check, 
  Zap, 
  Compass,
  DollarSign
} from 'lucide-react';

export default function OnboardingModal({ 
  isOpen, 
  onClose, 
  role = 'vendedor', // 'admin' | 'vendedor'
  userName = '' 
}) {
  const [activeTab, setActiveTab] = useState('tour'); // 'tour' | 'playbook'
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const storageKey = role === 'admin' ? 'renacer_onboarding_seen_admin' : 'renacer_onboarding_seen_vendedor';

  const handleFinishTour = () => {
    localStorage.setItem(storageKey, 'true');
    onClose();
  };

  // Contenido de los pasos del Tour para ADMINISTRADOR
  const adminSteps = [
    {
      title: "Bienvenido a la Dirección de RENACER",
      subtitle: "Control central de inventario, márgenes y equipo comercial",
      icon: Building2,
      badge: "Paso 1 de 4: Inventario y Utilidades",
      description: "Como Administrador Director, tienes visibilidad completa del catálogo activo, los costos base de captación y la utilidad neta estimada por cada propiedad.",
      highlights: [
        { label: "Control de Márgenes", desc: "Monitorea la utilidad proyectada en tiempo real de todo el portafolio inmobiliario." },
        { label: "Métricas de WhatsApp", desc: "Rastrea cuántos clics de prospectos ha recibido cada inmueble desde el portal público." },
        { label: "Exportación a Excel (CSV)", desc: "Descarga la base de propiedades o prospectos en 1 clic con compatibilidad total." }
      ]
    },
    {
      title: "Distribución Inteligente de Leads (CRM)",
      subtitle: "Asigna prospectos a tus asesores y monitorea la atención",
      icon: UserCheck,
      badge: "Paso 2 de 4: Bandeja de Prospectos",
      description: "Cada vez que un cliente solicita información o agenda una visita en la web, el lead ingresa a tu CRM central.",
      highlights: [
        { label: "Asignación Directa", desc: "Selecciona el asesor comercial encargado con un menú desplegable instantáneo." },
        { label: "Filtros por Fecha", desc: "Filtra prospectos de Hoy, Últimos 7 Días, Este Mes o el histórico completo." },
        { label: "Citas Agendadas", desc: "Identifica con distintivos visuales azules los clientes que solicitaron recorrido presencial." }
      ]
    },
    {
      title: "Leaderboard y Fuerza de Ventas",
      subtitle: "Evalúa el rendimiento y efectividad de cada asesor",
      icon: Trophy,
      badge: "Paso 3 de 4: Rendimiento Comercial",
      description: "Supervisa en tiempo real quién es el 'Top Seller', cuántas citas han logrado agendar y su porcentaje de conversión a ventas cerradas.",
      highlights: [
        { label: "Ranking Automático", desc: "Posiciones organizadas por volumen de prospectos atendidos y operaciones." },
        { label: "Tasa de Cierre (%)", desc: "Barras de progreso visuales con la efectividad de cada vendedor." },
        { label: "Alta de Asesores", desc: "Registra nuevos vendedores y asigna sus credenciales de acceso institucional." }
      ]
    },
    {
      title: "Generador de Campañas & Marketing UTM",
      subtitle: "Crea enlaces rastreables para tus anuncios publicitarios",
      icon: Link2,
      badge: "Paso 4 de 4: Difusión y Enlaces",
      description: "Genera URLs de WhatsApp personalizadas para campañas de Facebook Ads, Instagram, TikTok o lonas publicitarias.",
      highlights: [
        { label: "Mensajes Predefinidos", desc: "El prospecto envía un WhatsApp con la clave de la campaña y propiedad exacta." },
        { label: "Copia en 1 Clic", desc: "Copia el enlace directo para insertarlo en tus anuncios de redes sociales." },
        { label: "Rastreo de Canal", desc: "Los asesores sabrán de inmediato si el cliente proviene de redes, portales o lonas." }
      ]
    }
  ];

  // Contenido de los pasos del Tour para ASESOR COMERCIAL (Ventas)
  const advisorSteps = [
    {
      title: `¡Bienvenido al Equipo Comercial, ${userName || 'Asesor'}!`,
      subtitle: "Tu plataforma integral para cerrar más operaciones inmobiliarias",
      icon: Compass,
      badge: "Paso 1 de 4: Tu Inventario Operativo",
      description: "Accede al catálogo completo de propiedades con precios de venta actualizados, especificaciones técnicas completas y ubicación.",
      highlights: [
        { label: "Fichas Técnicas", desc: "Consulta recámaras, baños, m² de terreno y construcción al instante." },
        { label: "Estatus de Disponibilidad", desc: "Identifica rápidamente qué inmuebles están Activos, En Trato o Vendidos." },
        { label: "Ubicación en Maps", desc: "Revisa la zona y puntos de referencia de cada propiedad para orientar al cliente." }
      ]
    },
    {
      title: "Bandeja de Prospectos Asignados",
      subtitle: "Recibe clientes calificados y solicitudes de visita",
      icon: UserCheck,
      badge: "Paso 2 de 4: Tus Leads en Tiempo Real",
      description: "Cuando la dirección te asigne un prospecto o el cliente solicite una cita en tus propiedades, aparecerá en tu panel con alerta visual.",
      highlights: [
        { label: "Alerta de Nuevos Leads", desc: "Notificación destacada en la parte superior cuando tienes prospectos por atender." },
        { label: "Citas Programadas", desc: "Revisa el día y turno solicitado (Mañana, Tarde o Sábado) para confirmar el recorrido." },
        { label: "Exporta tu Cartera", desc: "Descarga tus contactos a Excel para respaldar tu seguimiento comercial." }
      ]
    },
    {
      title: "Contacto Inmediato vía WhatsApp",
      subtitle: "Protocolo de respuesta rápida en menos de 5 minutos",
      icon: MessageCircle,
      badge: "Paso 3 de 4: Conversión y Contacto",
      description: "Cada prospecto cuenta con un botón verde de WhatsApp que abre una conversación con mensaje predeterminado contextualizado a la propiedad de su interés.",
      highlights: [
        { label: "1 Clic para Chatear", desc: "Sin necesidad de guardar el número manualmente en tu agenda telefónica." },
        { label: "Mensaje Contextual", desc: "El mensaje incluye el nombre del cliente y el título del inmueble consultado." },
        { label: "Confirmación de Cita", desc: "Si agendó fecha, el mensaje solicita directamente la confirmación de la hora." }
      ]
    },
    {
      title: "Bitácora de Seguimiento & Cierres",
      subtitle: "Registra acuerdos y avanza tus prospectos hacia la venta",
      icon: CheckCircle2,
      badge: "Paso 4 de 4: Gestión de Avance",
      description: "Mantén actualizado el estatus de cada cliente (Nuevo → Contactado → Cita Agendada → Cerrado) y guarda notas de acuerdos o requerimientos específicos.",
      highlights: [
        { label: "Notas de Avance", desc: "Anota fechas de visita, presupuesto del cliente o comentarios importantes." },
        { label: "Estatus Comercial", desc: "Refleja tus avances para que tu rendimiento sume al Leaderboard de la inmobiliaria." },
        { label: "Enfoque en Cierre", desc: "Da seguimiento continuo a los prospectos en estatus 'Cita Agendada'." }
      ]
    }
  ];

  const steps = role === 'admin' ? adminSteps : advisorSteps;
  const currentSlide = steps[currentStep] || steps[0];
  const IconComponent = currentSlide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#141416] rounded-3xl shadow-2xl border border-[#D4AF37]/35 overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Cabecera del Modal */}
        <div className="bg-[#0A0A0A] px-6 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] text-black flex items-center justify-center font-black shadow-md shadow-[#D4AF37]/20">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  Centro de Inducción & Capacitación
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#202024] text-slate-300 border border-white/5">
                  {role === 'admin' ? 'Perfil: Director Admin' : 'Perfil: Asesor Comercial'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                RENACER - Guía de Operaciones
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-[#1A1A1E] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('tour')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tour'
                    ? 'bg-[#D4AF37] text-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tour Rápido
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('playbook')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'playbook'
                    ? 'bg-[#D4AF37] text-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Playbook de Ventas</span>
              </button>
            </div>

            <button
              onClick={handleFinishTour}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selector de Pestañas Móvil */}
        <div className="sm:hidden px-4 pt-3 flex items-center gap-2 border-b border-white/10 pb-3 bg-[#0D0D0F]">
          <button
            type="button"
            onClick={() => setActiveTab('tour')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all ${
              activeTab === 'tour' ? 'bg-[#D4AF37] text-black' : 'bg-[#1A1A1E] text-slate-400'
            }`}
          >
            Tour Rápido
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('playbook')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all ${
              activeTab === 'playbook' ? 'bg-[#D4AF37] text-black' : 'bg-[#1A1A1E] text-slate-400'
            }`}
          >
            Playbook de Ventas
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL: TOUR GUIADO */}
        {activeTab === 'tour' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Barra de Progreso de Pasos */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
              <span className="text-xs font-black text-[#D4AF37] tracking-wider uppercase">
                {currentSlide.badge}
              </span>
              <div className="flex items-center gap-1.5">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentStep
                        ? 'w-7 bg-gradient-to-r from-[#FDE68A] via-[#D4AF37] to-[#996515]'
                        : idx < currentStep
                        ? 'w-2 bg-[#D4AF37]/50'
                        : 'w-2 bg-white/20'
                    }`}
                    title={`Ir al paso ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Cabecera del Paso */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0 shadow-lg">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {currentSlide.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {currentSlide.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
              {currentSlide.description}
            </p>

            {/* Tarjetas de Puntos Clave */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentSlide.highlights.map((h, i) => (
                <div 
                  key={i} 
                  className="p-3.5 rounded-2xl bg-[#1A1A1E] border border-white/10 hover:border-[#D4AF37]/40 transition-colors flex flex-col justify-between space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{h.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* CONTENIDO ALTERNATIVO: PLAYBOOK & PROTOCOLO DE VENTAS */}
        {activeTab === 'playbook' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300 leading-relaxed">
            
            {/* Regla de los 5 Minutos */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#141416] to-[#141416] border border-[#D4AF37]/40">
              <div className="flex items-center gap-2.5 text-[#D4AF37] font-black text-sm mb-1">
                <Clock className="w-4 h-4 stroke-[2.5]" />
                <span>1. La Regla de Oro: Contacto en Menos de 5 Minutos</span>
              </div>
              <p className="text-slate-300">
                El 78% de las decisiones de compra o renta inmobiliaria se cierran con el <strong>primer asesor que responde</strong>. En cuanto recibas la notificación de un nuevo lead asignado, haz clic en el botón de WhatsApp inmediatamente.
              </p>
            </div>

            {/* Speech de Primer Contacto */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                <span>2. Guion / Script Sugerido para WhatsApp</span>
              </div>
              <div className="p-3 rounded-xl bg-[#141416] border border-white/10 font-mono text-[11px] text-emerald-400 leading-relaxed whitespace-pre-wrap">
{`Hola [Nombre Cliente], excelente día. 👋
Te saluda [Tu Nombre], asesor inmobiliario de RENACER Grupo Inmobiliario.

Recibí tu consulta sobre [Título de la Propiedad]. Con gusto te comparto la ficha técnica y disponibilidad actual.

¿Te gustaría que agendemos un recorrido presencial esta semana para conocerla a detalle?`}
              </div>
              <p className="text-[10px] text-slate-400">
                💡 <em>Tip: Siempre termina tu mensaje con una pregunta abierta o una invitación clara a agendar la visita.</em>
              </p>
            </div>

            {/* Protocolo de Citas de Recorrido */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>3. Protocolo de Citas de Recorrido Presencial</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li><strong>Confirmación Previa:</strong> Envía un mensaje 2 horas antes de la cita para reconfirmar hora exacta y ubicación.</li>
                <li><strong>Puntualidad Renacer:</strong> Llega al inmueble 10 minutos antes para ventilar, encender luces y tener la ficha técnica a la mano.</li>
                <li><strong>Actualización en CRM:</strong> Al concluir la visita, actualiza el estatus del lead y registra en la bitácora las impresiones del cliente.</li>
              </ul>
            </div>

            {/* Manejo de Objeciones */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>4. Manejo de Objeciones Frecuentes</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#141416] border border-white/5">
                  <span className="font-bold text-white block">"El precio se me hace alto"</span>
                  <span className="text-slate-400">Destaca la plusvalía de la zona, los m² de construcción y la asesoría jurídica incluida.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#141416] border border-white/5">
                  <span className="font-bold text-white block">"Aún no tengo definido mi crédito"</span>
                  <span className="text-slate-400">Ofrécele visitar la propiedad primero para que confirme si es el hogar ideal mientras le apoyamos con el trámite.</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Pie del Modal con Navegación */}
        <div className="bg-[#0A0A0A] px-6 py-4 flex items-center justify-between border-t border-white/10 shrink-0">
          {activeTab === 'tour' ? (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFinishTour}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
                >
                  Omitir Tutorial
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                    className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishTour}
                    style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>¡Comenzar a Trabajar!</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Puedes consultar este manual en cualquier momento desde el botón <strong>Capacitación</strong>.
              </span>
              <button
                type="button"
                onClick={handleFinishTour}
                style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                Entendido
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
