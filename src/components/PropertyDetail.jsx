import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Phone, 
  MessageCircle, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Share2, 
  Building2,
  CheckCircle2,
  Sparkles,
  Map,
  Printer,
  Calendar,
  Scale
} from 'lucide-react';

export default function PropertyDetail({
  property,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  isCompared = false,
  onToggleCompare,
  onOpenWhatsApp,
  onScheduleVisit,
  onShare,
  authUser
}) {
  if (!isOpen || !property) return null;

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
    descripcion,
    imagen,
    images = [],
    telefono_asesor,
    telefonoAsesor,
    estatus = 'Activo'
  } = property;

  const allImages = images && images.length > 0 
    ? [imagen, ...images.map(img => typeof img === 'string' ? img : img.image_path)].filter(Boolean)
    : [imagen || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  const uniqueImages = Array.from(new Set(allImages));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const numRecamaras = recamaras || habitaciones || 1;
  const numBanos = banos || 1;
  const numCochera = estacionamientos || 1;
  const areaConstruccion = construccion_m2 ? `${construccion_m2} m²` : (superficie || 'N/A');
  const areaTerreno = terreno_m2 ? `${terreno_m2} m²` : 'N/A';

  const formattedPrice = typeof precio === 'number' 
    ? `$${precio.toLocaleString('es-MX')} MXN` 
    : (precio_texto || '$0 MXN');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
  };

  const handleWhatsApp = () => {
    if (onOpenWhatsApp) {
      onOpenWhatsApp(property);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleMapsClick = () => {
    const query = encodeURIComponent(`${ubicacion}, ${ciudad || 'Chihuahua'}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto print:bg-white print:p-0 print:static">
      <div 
        className="relative w-full max-w-4xl bg-[#141416] border border-[#D4AF37]/35 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto max-h-[92vh] flex flex-col text-white print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Barra Superior Flotante de Acciones (Oculta en impresión) */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 print:hidden">
          {/* Botón Comparar */}
          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(property)}
              className={`p-2.5 rounded-full border backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                isCompared
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                  : 'bg-black/80 text-slate-300 hover:text-[#D4AF37] border-white/10 hover:border-[#D4AF37]/50'
              }`}
              title={isCompared ? 'Quitar de Comparador' : 'Agregar a Comparador'}
            >
              <Scale className="w-4 h-4" />
            </button>
          )}

          {/* Botón Google Maps */}
          <button
            type="button"
            onClick={handleMapsClick}
            className="p-2.5 rounded-full bg-black/80 hover:bg-black text-slate-300 hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 backdrop-blur-md shadow-lg transition-all cursor-pointer"
            title="Ver ubicación en Google Maps"
          >
            <Map className="w-4 h-4" />
          </button>

          {/* Botón Imprimir / PDF */}
          <button
            type="button"
            onClick={handlePrintPDF}
            className="p-2.5 rounded-full bg-black/80 hover:bg-black text-slate-300 hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 backdrop-blur-md shadow-lg transition-all cursor-pointer"
            title="Imprimir / Descargar Ficha Técnica PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Botón Compartir */}
          <button
            type="button"
            onClick={() => onShare && onShare(property)}
            className="p-2.5 rounded-full bg-black/80 hover:bg-black text-slate-300 hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 backdrop-blur-md shadow-lg transition-all cursor-pointer"
            title="Compartir propiedad"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Botón Favorito */}
          <button
            type="button"
            onClick={() => onToggleFavorite && onToggleFavorite(id)}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-pink-600 border-pink-500 text-white'
                : 'bg-black/80 border-white/10 hover:bg-black text-white hover:border-[#D4AF37]/50'
            }`}
            title={isFavorite ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : 'fill-none'}`} />
          </button>

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/80 hover:bg-black text-slate-300 hover:text-white border border-white/10 backdrop-blur-md shadow-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="overflow-y-auto flex-1">
          
          {/* 1. Carrusel de Imágenes */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#0A0A0A] overflow-hidden border-b border-[#D4AF37]/20">
            <img
              src={uniqueImages[currentImageIndex]}
              alt={`${titulo} - Foto ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Badges Flotantes */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-black/85 border border-[#D4AF37]/40 text-[#D4AF37] shadow-lg backdrop-blur-md">
                {tipo}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#202024] text-slate-300 border border-white/10 backdrop-blur-md">
                {estatus}
              </span>
            </div>

            {/* Controles de Navegación de Galería */}
            {uniqueImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicador de Foto Actual */}
                <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-slate-300 text-xs font-mono backdrop-blur-md">
                  {currentImageIndex + 1} / {uniqueImages.length}
                </div>
              </>
            )}
          </div>

          {/* Miniaturas si hay más de 1 imagen */}
          {uniqueImages.length > 1 && (
            <div className="flex gap-2 p-3 bg-[#0A0A0A] overflow-x-auto border-b border-white/5">
              {uniqueImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    currentImageIndex === idx ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 2. Cuerpo de la Ficha Técnica */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Encabezado y Precio */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-extrabold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{ubicacion} - {ciudad}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {titulo}
                </h2>
              </div>

              <div className="sm:text-right">
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                  Precio de Lista
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {formattedPrice}
                </span>
              </div>
            </div>

            {/* 3. Cuadrícula de Especificaciones Inmobiliarias (#202024) */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
                Especificaciones Principales
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#202024] border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/60 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-[#E2E8F0] font-medium">Recámaras</span>
                    <span className="text-base font-black text-white">{numRecamaras}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#202024] border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/60 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-[#E2E8F0] font-medium">Baños</span>
                    <span className="text-base font-black text-white">{numBanos}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#202024] border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/60 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-[#E2E8F0] font-medium">Estacionamiento</span>
                    <span className="text-base font-black text-white">{numCochera}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#202024] border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/60 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-[#E2E8F0] font-medium">Construcción</span>
                    <span className="text-base font-black text-white">{areaConstruccion}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Descripción Detallada */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                Memoria Descriptiva
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-[#0D0D0D] p-5 rounded-2xl border border-white/5">
                {descripcion || `Exclusiva propiedad ubicada en ${ubicacion}, diseñada con acabados de primera calidad, excelente iluminación natural y espacios perfectamente optimizados para brindar confort, seguridad y alta plusvalía patrimonial.`}
              </p>
            </div>

            {/* 5. Garantía de Certeza Jurídica */}
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#D4AF37]/20 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
              <p className="text-xs text-slate-300">
                <strong className="text-white">Garantía RENACER:</strong> Propiedad con expediente validado, libre de gravamen o con proceso notarial debidamente acreditado.
              </p>
            </div>

          </div>

        </div>

        {/* 6. Barra Inferior Fija de Contacto y Agendador (Oculta en impresión) */}
        <div className="p-4 sm:p-6 bg-[#0D0D0D] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div>
            <span className="block text-[11px] font-bold text-slate-400">¿Deseas agendar un recorrido privado o consultar detalles?</span>
            <span className="text-sm font-black text-[#D4AF37]">Asesoría personalizada y certeza patrimonial</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            {onScheduleVisit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onScheduleVisit(property);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-[#D4AF37]/50 shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Agendar Visita</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleWhatsApp}
              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-black/20" />
              <span>Contactar WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
