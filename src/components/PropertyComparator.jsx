import React from 'react';
import { 
  X, 
  Trash2, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  MessageCircle, 
  Scale, 
  Check, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function PropertyComparator({ 
  isOpen, 
  onClose, 
  properties = [], 
  onRemoveProperty, 
  onClearAll,
  onOpenWhatsApp,
  onOpenDetail
}) {
  if (!isOpen || properties.length === 0) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val || 0);
  };

  const getCostPerM2 = (prop) => {
    const area = prop.construccion_m2 || parseFloat(prop.superficie) || 0;
    if (area > 0 && prop.precio > 0) {
      return formatCurrency(prop.precio / area) + ' / m²';
    }
    return 'N/D';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl bg-[#141416] border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto max-h-[92vh] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Comparador */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#1A1A1E] via-[#141416] to-[#1A1A1E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Comparador de Propiedades
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  {properties.length} de 3
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Analiza lado a lado especificaciones, valor por m² y rentabilidad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {properties.length > 1 && (
              <button
                type="button"
                onClick={onClearAll}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpiar lista
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabla Comparativa con Scroll Horizontal */}
        <div className="overflow-x-auto p-4 sm:p-6 flex-1">
          <div className="min-w-[700px]">
            {/* Fila de Tarjetas Superiores */}
            <div className={`grid gap-4 mb-6 ${
              properties.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              properties.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {properties.map((prop) => (
                <div 
                  key={prop.id} 
                  className="bg-[#1C1C22] rounded-2xl border border-white/10 p-4 relative group flex flex-col justify-between"
                >
                  <button
                    type="button"
                    onClick={() => onRemoveProperty(prop.id)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Quitar de comparación"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="h-40 rounded-xl overflow-hidden mb-3 relative bg-black/40">
                      <img 
                        src={prop.imagen} 
                        alt={prop.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-black/80 text-[#D4AF37] border border-[#D4AF37]/30 backdrop-blur-sm">
                        {prop.tipo}
                      </span>
                    </div>

                    <h3 className="font-semibold text-white text-base mb-1 line-clamp-1">
                      {prop.titulo}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-2 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      {prop.ubicacion}
                    </p>
                    <p className="text-xl font-bold text-[#D4AF37] mb-3">
                      {typeof prop.precio === 'number' ? formatCurrency(prop.precio) : prop.precio_texto}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDetail(prop);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ver Ficha
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenWhatsApp(prop)}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 shadow-lg shadow-emerald-950/50 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Matriz Comparativa de Características */}
            <div className="bg-[#18181C] rounded-2xl border border-white/10 overflow-hidden text-sm">
              <div className="divide-y divide-white/10">
                {/* Ciudad */}
                <div className="grid grid-cols-4 p-3.5 items-center hover:bg-white/[0.02]">
                  <div className="font-medium text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" /> Ciudad
                  </div>
                  {properties.map(p => (
                    <div key={p.id} className="text-white font-medium">{p.ciudad || 'Chihuahua'}</div>
                  ))}
                </div>

                {/* Recámaras */}
                <div className="grid grid-cols-4 p-3.5 items-center hover:bg-white/[0.02] bg-white/[0.01]">
                  <div className="font-medium text-slate-400 flex items-center gap-2">
                    <Bed className="w-4 h-4 text-[#D4AF37]" /> Recámaras
                  </div>
                  {properties.map(p => (
                    <div key={p.id} className="text-white font-semibold">
                      {p.recamaras || p.habitaciones || 1} recámaras
                    </div>
                  ))}
                </div>

                {/* Baños */}
                <div className="grid grid-cols-4 p-3.5 items-center hover:bg-white/[0.02]">
                  <div className="font-medium text-slate-400 flex items-center gap-2">
                    <Bath className="w-4 h-4 text-[#D4AF37]" /> Baños
                  </div>
                  {properties.map(p => (
                    <div key={p.id} className="text-white font-semibold">
                      {p.banos || 1} baños
                    </div>
                  ))}
                </div>

                {/* Estacionamientos */}
                <div className="grid grid-cols-4 p-3.5 items-center hover:bg-white/[0.02] bg-white/[0.01]">
                  <div className="font-medium text-slate-400 flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#D4AF37]" /> Cocheras
                  </div>
                  {properties.map(p => (
                    <div key={p.id} className="text-white font-semibold">
                      {p.estacionamientos || 1} autos
                    </div>
                  ))}
                </div>

                {/* Construcción m2 */}
                <div className="grid grid-cols-4 p-3.5 items-center hover:bg-white/[0.02]">
                  <div className="font-medium text-slate-400 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-[#D4AF37]" /> Construcción
                  </div>
                  {properties.map(p => (
                    <div key={p.id} className="text-white font-semibold">
                      {p.construccion_m2 ? `${p.construccion_m2} m²` : (p.superficie || 'N/D')}
                    </div>
                  ))}
                </div>

                {/* Terreno m2 */}
                <div className="grid grid-cols-4 p-3.5 items-center hover:bg-white/[0.02] bg-white/[0.01]">
                  <div className="font-medium text-slate-400 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-[#D4AF37]" /> Terreno
                  </div>
                  {properties.map(p => (
                    <div key={p.id} className="text-white font-semibold">
                      {p.terreno_m2 ? `${p.terreno_m2} m²` : 'N/D'}
                    </div>
                  ))}
                </div>

                {/* Costo estimado por m2 */}
                <div className="grid grid-cols-4 p-3.5 items-center hover:bg-white/[0.02] bg-[#D4AF37]/5">
                  <div className="font-medium text-[#D4AF37] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Costo / m²
                  </div>
                  {properties.map(p => (
                    <div key={p.id} className="text-[#D4AF37] font-bold">
                      {getCostPerM2(p)}
                    </div>
                  ))}
                </div>

                {/* Estatus */}
                <div className="grid grid-cols-4 p-3.5 items-center hover:bg-white/[0.02]">
                  <div className="font-medium text-slate-400 flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4AF37]" /> Estatus
                  </div>
                  {properties.map(p => (
                    <div key={p.id}>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        p.estatus === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        p.estatus === 'En Trato' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {p.estatus || 'Activo'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-4 border-t border-white/10 bg-[#141416] flex items-center justify-between">
          <p className="text-xs text-slate-400">
            ¿Dudas sobre cuál se adapta mejor a tu perfil de inversión? Nuestros asesores te orientan sin costo.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Cerrar Comparador
          </button>
        </div>
      </div>
    </div>
  );
}
