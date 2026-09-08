import React, { useState } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  MessageCircle, 
  ArrowUpRight, 
  Heart, 
  Eye, 
  Share2,
  Sparkles 
} from 'lucide-react';

export default function PropertyCard({ 
  property, 
  isFavorite = false, 
  onToggleFavorite, 
  onOpenLogin,
  onOpenDetail,
  onOpenWhatsApp,
  onShare,
  authUser 
}) {
  const {
    id,
    titulo,
    ubicacion,
    ciudad,
    tipo,
    precio,
    precio_texto,
    habitaciones,
    recamaras,
    banos,
    estacionamientos,
    superficie,
    construccion_m2,
    terreno_m2,
    imagen,
    telefono_asesor,
    telefonoAsesor,
    estatus = 'Activo',
  } = property;

  const phone = telefono_asesor || telefonoAsesor || '526141234567';
  const numRecamaras = recamaras || habitaciones || 1;
  const numBanos = banos || 1;
  const numCochera = estacionamientos || 1;
  const areaConstruccion = construccion_m2 ? `${construccion_m2} m²` : (superficie || 'N/A');

  const formattedPriceNumber = typeof precio === 'number' 
    ? `$${precio.toLocaleString('es-MX')}` 
    : (precio_texto ? precio_texto.replace(' MXN', '').replace('/mes', '') : '$0');

  const isRenta = tipo?.toLowerCase() === 'renta';

  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const [heartAnim, setHeartAnim] = useState(false);

  React.useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authUser) {
      if (onOpenLogin) onOpenLogin();
      return;
    }

    setLocalFavorite(!localFavorite);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 300);

    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(property);
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(property);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onOpenWhatsApp) {
      onOpenWhatsApp(property);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-[#141416] rounded-2xl border border-[#D4AF37]/20 overflow-hidden shadow-xl hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-black transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative cursor-pointer"
    >
      
      {/* 1. Contenedor de Imagen */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A]">
        <img
          src={imagen || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
          alt={titulo}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradiente de sombra */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-black/30 opacity-90 pointer-events-none" />

        {/* Badges de Operación y Estatus */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
          <span
            className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-black/85 border border-[#D4AF37]/40 text-[#D4AF37] shadow-lg backdrop-blur-md"
          >
            {tipo}
          </span>

          {estatus && estatus !== 'Activo' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-[#202024] text-slate-300 border border-white/10 backdrop-blur-md">
              {estatus}
            </span>
          )}
        </div>

        {/* Acciones Top-Right: Compartir y Favorito */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
          
          {/* Botón Compartir */}
          <button
            type="button"
            onClick={handleShareClick}
            className="p-2.5 rounded-full bg-black/75 hover:bg-black text-slate-300 hover:text-[#D4AF37] backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-110 border border-white/10 hover:border-[#D4AF37]/40"
            title="Compartir propiedad"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Botón Favorito */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            id={`btn-favorite-${id}`}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md border ${
              localFavorite
                ? 'bg-pink-600 border-pink-500 text-white shadow-pink-600/40'
                : 'bg-black/75 border-white/10 hover:bg-black text-white hover:scale-110 hover:border-[#D4AF37]/40'
            } ${heartAnim ? 'scale-125' : 'scale-100'}`}
            title={localFavorite ? 'Guardada en Favoritos' : 'Guardar en Favoritos'}
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${localFavorite ? 'fill-white stroke-white' : 'stroke-white fill-none'}`} />
          </button>
        </div>

        {/* Overlay hover para "Ver Ficha" */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A0A0A]/95 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold shadow-xl backdrop-blur-xs transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Ficha Completa</span>
          </span>
        </div>

      </div>

      {/* 2. Contenido de la Tarjeta */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        
        {/* Encabezado: Ubicación y Título */}
        <div>
          <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-extrabold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="truncate">{ubicacion}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2 min-h-[2.8rem]">
            {titulo}
          </h3>
        </div>

        {/* 3. Especificaciones (Pastillas en fondo #202024 con iconos dorados y texto gris claro) */}
        <div className="my-4 py-3 border-y border-[#D4AF37]/15 grid grid-cols-4 gap-2">
          
          {/* Recámaras */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#202024] border border-white/5">
            <Bed className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="block text-xs font-extrabold text-white leading-none">{numRecamaras}</span>
            <span className="text-[10px] text-[#E2E8F0] mt-0.5 font-medium">Recs.</span>
          </div>

          {/* Baños */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#202024] border border-white/5">
            <Bath className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="block text-xs font-extrabold text-white leading-none">{numBanos}</span>
            <span className="text-[10px] text-[#E2E8F0] mt-0.5 font-medium">Baños</span>
          </div>

          {/* Estacionamientos */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#202024] border border-white/5">
            <Car className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="block text-xs font-extrabold text-white leading-none">{numCochera}</span>
            <span className="text-[10px] text-[#E2E8F0] mt-0.5 font-medium">Autos</span>
          </div>

          {/* Construcción */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#202024] border border-white/5">
            <Maximize2 className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="block text-xs font-extrabold text-white leading-none truncate w-full">
              {areaConstruccion}
            </span>
            <span className="text-[10px] text-[#E2E8F0] mt-0.5 font-medium">Const.</span>
          </div>

        </div>

        {/* 4. Pie de Tarjeta: Precio en Blanco con acento MXN en dorado y Botón Oro Brillante */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Precio de Operación
            </span>
            <div className="text-xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>{formattedPriceNumber}</span>
              <span className="text-xs font-bold text-[#D4AF37]">{isRenta ? 'MXN/mes' : 'MXN'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            id={`btn-whatsapp-${id}`}
            style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 active:brightness-95 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-black/20 stroke-[2.2]" />
            <span>Contactar Asesor</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>

      </div>
    </div>
  );
}
