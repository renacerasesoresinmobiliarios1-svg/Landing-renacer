import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Link as LinkIcon,
  Plus,
  Sparkles
} from 'lucide-react';

export default function PropertyFormModal({
  isOpen,
  onClose,
  property = null, // null para crear, objeto para editar
  onSaved,
  isAdmin = false,
}) {
  const [formData, setFormData] = useState({
    titulo: '',
    ubicacion: '',
    ciudad: 'Chihuahua',
    tipo: 'Venta',
    precio: '',
    costo_base: '',
    utilidad: '',
    estatus: 'Activo',
    recamaras: 3,
    habitaciones: 3,
    banos: 2.5,
    estacionamientos: 2,
    terreno_m2: 250,
    construccion_m2: 220,
    superficie: '220 m²',
    descripcion: '',
    imagen: '',
    telefono_asesor: '526141234567',
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainPreviewUrl, setMainPreviewUrl] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [useUrlFallback, setUseUrlFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const mainInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    if (property) {
      setFormData({
        titulo: property.titulo || '',
        ubicacion: property.ubicacion || '',
        ciudad: property.ciudad || 'Chihuahua',
        tipo: property.tipo || 'Venta',
        precio: property.precio || '',
        costo_base: property.costo_base || '',
        utilidad: property.utilidad || '',
        estatus: property.estatus || 'Activo',
        recamaras: property.recamaras || property.habitaciones || 3,
        habitaciones: property.habitaciones || property.recamaras || 3,
        banos: property.banos || 2,
        estacionamientos: property.estacionamientos || 2,
        terreno_m2: property.terreno_m2 || 250,
        construccion_m2: property.construccion_m2 || 220,
        superficie: property.superficie || '220 m²',
        descripcion: property.descripcion || '',
        imagen: property.imagen || '',
        telefono_asesor: property.telefono_asesor || property.telefonoAsesor || '526141234567',
      });
      setMainPreviewUrl(property.imagen || '');
      setGalleryPreviews(property.images ? property.images.map(img => typeof img === 'string' ? img : img.image_path) : []);
    } else {
      setFormData({
        titulo: '',
        ubicacion: '',
        ciudad: 'Chihuahua',
        tipo: 'Venta',
        precio: '',
        costo_base: '',
        utilidad: '',
        estatus: 'Activo',
        recamaras: 3,
        habitaciones: 3,
        banos: 2.5,
        estacionamientos: 2,
        terreno_m2: 250,
        construccion_m2: 220,
        superficie: '220 m²',
        descripcion: '',
        imagen: '',
        telefono_asesor: '526141234567',
      });
      setMainPreviewUrl('');
      setGalleryPreviews([]);
    }
    setMainImageFile(null);
    setGalleryFiles([]);
    setErrorMsg('');
  }, [property, isOpen]);

  if (!isOpen) return null;

  const handleMainFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const preview = URL.createObjectURL(file);
      setMainPreviewUrl(preview);
    }
  };

  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles([...galleryFiles, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };

  const removeGalleryPreview = (index) => {
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('titulo', formData.titulo);
      data.append('ubicacion', formData.ubicacion);
      data.append('ciudad', formData.ciudad);
      data.append('tipo', formData.tipo);
      data.append('precio', formData.precio);
      data.append('estatus', formData.estatus);
      data.append('recamaras', formData.recamaras);
      data.append('banos', formData.banos);
      data.append('estacionamientos', formData.estacionamientos);
      data.append('terreno_m2', formData.terreno_m2);
      data.append('construccion_m2', formData.construccion_m2);
      data.append('descripcion', formData.descripcion || '');
      data.append('telefono_asesor', formData.telefono_asesor || '526141234567');

      if (isAdmin) {
        if (formData.costo_base) data.append('costo_base', formData.costo_base);
        if (formData.utilidad) data.append('utilidad', formData.utilidad);
      }

      if (mainImageFile) {
        data.append('imagen_file', mainImageFile);
      } else if (formData.imagen) {
        data.append('imagen', formData.imagen);
      }

      galleryFiles.forEach((file) => {
        data.append('imagenes_files[]', file);
      });

      const url = property ? `/api/properties/${property.id}` : '/api/properties';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: data,
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        if (onSaved) onSaved(resData.data);
        onClose();
      } else {
        setErrorMsg(resData.message || 'Error al guardar la propiedad.');
      }
    } catch (err) {
      console.error('Error in property submit:', err);
      setErrorMsg('Error de red al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#141416] border border-[#D4AF37]/35 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto max-h-[90vh] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera Modal */}
        <div className="p-6 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block">
              Gestión de Inventario
            </span>
            <h2 className="text-xl font-bold text-white">
              {property ? 'Editar Propiedad' : 'Publicar Nueva Propiedad'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* 1. TÍTULO Y UBICACIÓN */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Título del Inmueble
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Residencia de Lujo en San Felipe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Ciudad
                </label>
                <select
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none cursor-pointer"
                >
                  <option value="Chihuahua">Chihuahua</option>
                  <option value="Guadalajara">Guadalajara</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Zona / Fraccionamiento
                </label>
                <input
                  type="text"
                  required
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Ej: Fracc. San Felipe II Etapa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. OPERACIÓN, PRECIO Y ESTATUS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Operación
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none cursor-pointer"
              >
                <option value="Venta">Venta</option>
                <option value="Renta">Renta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Precio Público (MXN)
              </label>
              <input
                type="number"
                required
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="4500000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Estatus
              </label>
              <select
                value={formData.estatus}
                onChange={(e) => setFormData({ ...formData, estatus: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none cursor-pointer"
              >
                <option value="Activo">Activo</option>
                <option value="En Trato">En Trato</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
          </div>

          {/* 3. CAMPOS FINANCIEROS (SOLO ADMIN JORGE) */}
          {isAdmin && (
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/30 space-y-3">
              <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-wider block">
                Métricas Financieras Confidenciales (Solo Admin)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Costo Base / Propietario</label>
                  <input
                    type="number"
                    value={formData.costo_base}
                    onChange={(e) => setFormData({ ...formData, costo_base: e.target.value })}
                    placeholder="3800000"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141416] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#D4AF37] mb-1">Utilidad Estimada</label>
                  <input
                    type="number"
                    value={formData.utilidad}
                    onChange={(e) => setFormData({ ...formData, utilidad: e.target.value })}
                    placeholder="700000"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141416] border border-[#D4AF37]/30 text-sm text-[#D4AF37] font-black focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. CARGA DE IMÁGENES */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Foto Principal de Portada
              </label>

              <input
                type="file"
                ref={mainInputRef}
                accept="image/*"
                onChange={handleMainFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => mainInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[#202024] hover:bg-[#2A2A30] border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span>Subir Foto de Galería</span>
                </button>

                {mainPreviewUrl && (
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-[#D4AF37]">
                    <img src={mainPreviewUrl} alt="Portada" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Galería Múltiple */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Galería de Fotos Adicionales
              </label>

              <input
                type="file"
                multiple
                ref={galleryInputRef}
                accept="image/*"
                onChange={handleGalleryFilesChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[#202024] hover:bg-[#2A2A30] border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Añadir Más Fotos</span>
                </button>

                {galleryPreviews.map((preview, i) => (
                  <div key={i} className="relative w-14 h-11 rounded-xl overflow-hidden border border-white/10 group">
                    <img src={preview} alt={`Foto ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryPreview(i)}
                      className="absolute inset-0 bg-red-900/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. ESPECIFICACIONES INMOBILIARIAS (#202024) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Especificaciones de Espacios
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#202024] border border-white/5 text-center">
                <span className="block text-[10px] text-slate-400 font-bold mb-1">Recámaras</span>
                <input
                  type="number"
                  value={formData.recamaras}
                  onChange={(e) => setFormData({ ...formData, recamaras: e.target.value })}
                  className="w-full bg-[#0A0A0A] rounded-lg p-1.5 text-center text-sm font-black text-white border border-white/10"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#202024] border border-white/5 text-center">
                <span className="block text-[10px] text-slate-400 font-bold mb-1">Baños</span>
                <input
                  type="number"
                  step="0.5"
                  value={formData.banos}
                  onChange={(e) => setFormData({ ...formData, banos: e.target.value })}
                  className="w-full bg-[#0A0A0A] rounded-lg p-1.5 text-center text-sm font-black text-white border border-white/10"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#202024] border border-white/5 text-center">
                <span className="block text-[10px] text-slate-400 font-bold mb-1">Cochera</span>
                <input
                  type="number"
                  value={formData.estacionamientos}
                  onChange={(e) => setFormData({ ...formData, estacionamientos: e.target.value })}
                  className="w-full bg-[#0A0A0A] rounded-lg p-1.5 text-center text-sm font-black text-white border border-white/10"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#202024] border border-white/5 text-center">
                <span className="block text-[10px] text-slate-400 font-bold mb-1">Construcción m²</span>
                <input
                  type="number"
                  value={formData.construccion_m2}
                  onChange={(e) => setFormData({ ...formData, construccion_m2: e.target.value })}
                  className="w-full bg-[#0A0A0A] rounded-lg p-1.5 text-center text-sm font-black text-white border border-white/10"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#202024] border border-white/5 text-center col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-slate-400 font-bold mb-1">Terreno m²</span>
                <input
                  type="number"
                  value={formData.terreno_m2}
                  onChange={(e) => setFormData({ ...formData, terreno_m2: e.target.value })}
                  className="w-full bg-[#0A0A0A] rounded-lg p-1.5 text-center text-sm font-black text-white border border-white/10"
                />
              </div>
            </div>
          </div>

          {/* 6. DESCRIPCIÓN */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Descripción Comercial
            </label>
            <textarea
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe amenidades, acabados y ventajas..."
              className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-white focus:border-[#D4AF37] outline-none leading-relaxed"
            ></textarea>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{property ? 'Guardar Cambios' : 'Publicar Propiedad'}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
