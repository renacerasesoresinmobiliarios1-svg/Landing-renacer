import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  MessageCircle, 
  Facebook, 
  Copy, 
  Check, 
  Smartphone, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function ShareModal({
  isOpen,
  onClose,
  property
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !property) return null;

  const propertyTitle = property.titulo || 'Propiedad Exclusiva';
  const propertyPrice = property.precio_texto || (typeof property.precio === 'number' ? `$${property.precio.toLocaleString('es-MX')} MXN` : property.precio);
  const propertyCity = property.ciudad || property.ubicacion || 'México';
  
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/#propiedad-${property.id}`
    : `https://renacerinmobiliario.com/#propiedad-${property.id}`;

  const shareText = `Te comparto esta propiedad en RENACER - Grupo Inmobiliario: ${propertyTitle} (${propertyPrice}) en ${propertyCity}.`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error copying text:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RENACER - ${propertyTitle}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#141416] border border-[#D4AF37]/35 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="p-6 bg-[#0A0A0A] border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] flex items-center justify-center text-black shadow-md shadow-[#D4AF37]/20 font-black">
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block leading-none">
                RENACER - Grupo Inmobiliario
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">Compartir Propiedad</h3>
            </div>
          </div>

          {/* Tarjeta de Resumen */}
          <div className="mt-4 p-3 rounded-2xl bg-[#141416] border border-[#D4AF37]/20 flex items-center gap-3">
            <img
              src={property.imagen || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
              alt={propertyTitle}
              className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-100 truncate">{propertyTitle}</h4>
              <span className="text-xs font-black text-[#D4AF37] block">{propertyPrice}</span>
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div className="p-6 space-y-3">
          
          {/* Opción 1: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#D4AF37]/30 text-white font-bold text-xs transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] flex items-center justify-center text-black shadow-xs font-black">
                <MessageCircle className="w-5 h-5 fill-black/20" />
              </div>
              <div className="text-left">
                <span className="block text-white">Enviar por WhatsApp</span>
                <span className="text-[10px] text-slate-400 font-medium">Compartir directo con tus contactos</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Opción 2: Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-white/10 text-white font-bold text-xs transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#202024] flex items-center justify-center text-[#D4AF37] shadow-xs">
                <Facebook className="w-5 h-5 fill-white/20" />
              </div>
              <div className="text-left">
                <span className="block text-white">Publicar en Facebook</span>
                <span className="text-[10px] text-slate-400 font-medium">Compartir en tu muro o grupos</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Opción 3: Dispositivo Móvil */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-white/10 text-white font-bold text-xs transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#202024] flex items-center justify-center text-[#D4AF37] shadow-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-white">Compartir en Apps Móviles</span>
                <span className="text-[10px] text-slate-400 font-medium">Instagram, Telegram, Mensajes</span>
              </div>
            </div>
            <Share2 className="w-4 h-4 text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Opción 4: Copiar Enlace */}
          <div className="pt-2">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#0A0A0A] border border-white/10">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3 py-1.5 bg-transparent text-xs text-slate-300 font-mono outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md hover:brightness-110"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {copied && (
              <div className="mt-2 p-2.5 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>¡Enlace copiado al portapapeles con éxito!</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
