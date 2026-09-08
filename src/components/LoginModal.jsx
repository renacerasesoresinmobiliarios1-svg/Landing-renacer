import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone,
  UserPlus, 
  LogIn, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Sparkles 
} from 'lucide-react';
import Logo from './Logo';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' o 'register'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Formulario Iniciar Sesión
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Formulario Registro Cliente
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  // Enviar Login Formal
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('¡Autenticación exitosa! Redirigiendo...');
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        setTimeout(() => {
          if (data.redirect_url) {
            window.location.href = data.redirect_url;
          } else {
            window.location.reload();
          }
        }, 500);
      } else {
        setErrorMessage(data.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Error al conectar con el servidor. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar Registro de Cliente Formal
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/register-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          telefono: regPhone,
          password: regPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('¡Cuenta creada exitosamente! Iniciando sesión...');
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } else {
        setErrorMessage(data.message || 'No se pudo crear la cuenta. Verifica que el correo no esté en uso.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setErrorMessage('Error de conexión al registrar. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0D0D0D] border border-[#D4AF37]/35 rounded-3xl shadow-2xl shadow-black overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Elegante en Negro & Oro */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#141414] to-[#0D0D0D] border-b border-[#D4AF37]/20 relative text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logotipo Oficial */}
          <div className="flex justify-center mb-3">
            <Logo className="h-12 sm:h-14 w-auto" alt="RENACER - Grupo Inmobiliario" />
          </div>

          <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-[#D4AF37] block">
            Acceso a Plataforma
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === 'login' 
              ? 'Ingresa tus credenciales para acceder a tu panel.'
              : 'Regístrate para guardar inmuebles en favoritos y contactar a tu asesor.'}
          </p>

          {/* Selector de Pestañas */}
          <div className="flex items-center gap-1.5 mt-6 p-1.5 bg-[#171717] rounded-2xl border border-white/5">
            <button
              type="button"
              id="tab-login"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              id="tab-register"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crear Cuenta
            </button>
          </div>
        </div>

        {/* Contenido del Formulario */}
        <div className="p-6 sm:p-8">
          
          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mensaje de Éxito */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* PESTAÑA 1: INICIAR SESIÓN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    id="input-login-email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="usuario@renacer.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    id="input-login-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  id="btn-submit-login"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] hover:brightness-110 active:brightness-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Verificando Credenciales...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 stroke-[2.5]" />
                      <span>Entrar al Panel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* PESTAÑA 2: CREAR CUENTA */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    id="input-register-name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Lic. Roberto Valenzuela"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    id="input-register-email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="roberto@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                  Teléfono / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    id="input-register-phone"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="614 123 4567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    id="input-register-password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#141414] border border-white/10 text-sm text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  id="btn-submit-register"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] hover:brightness-110 active:brightness-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Creando Cuenta...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 stroke-[2.5]" />
                      <span>Registrarme</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
