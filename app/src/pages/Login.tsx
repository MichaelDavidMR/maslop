// Login.tsx - Enhanced
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#06090f] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Atmospheric background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-100" />
        <div className="absolute inset-0 bg-mesh" />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-600/8 blur-[80px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center text-slate-500 hover:text-slate-200 mb-8 transition-colors text-sm gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver al inicio
        </Link>

        {/* Card */}
        <div className="relative">
          {/* Top gradient border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/30 via-blue-500/10 to-transparent" style={{ borderRadius: '1rem' }} />

          <div className="relative rounded-2xl overflow-hidden glass-strong shadow-2xl shadow-black/60">
            {/* Inner top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

            <div className="px-8 py-10">
              {/* Logo & title */}
              <div className="text-center mb-10">
                <div className="relative inline-flex mb-5">
                  {/* Logo mark */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center shadow-xl">
                    <span className="font-display text-4xl text-white tracking-wider leading-none pt-1">M</span>
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center border-2 border-[#0c1220] shadow-md">
                      <span className="font-display text-base text-white leading-none pt-0.5">L</span>
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                  Panel de Administración
                </h1>
                <p className="text-slate-500 text-sm">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-400 text-sm font-medium">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@maslop.com"
                      required
                      className="pl-10 bg-slate-900/80 border-slate-700/80 text-white placeholder:text-slate-600
                        focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/15 focus:ring-offset-0
                        h-11 rounded-xl transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-400 text-sm font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-10 pr-11 bg-slate-900/80 border-slate-700/80 text-white placeholder:text-slate-600
                        focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/15 focus:ring-offset-0
                        h-11 rounded-xl transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary h-11 text-[15px] font-semibold rounded-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2.5">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Iniciando sesión...
                      </span>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </div>
              </form>

              {/* Demo credentials */}
              <div className="mt-6">
                <div className="border border-dashed border-slate-700/60 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        <span className="text-slate-400 font-semibold block mb-1">Credenciales de demo</span>
                        <span className="font-mono">admin@maslop.com</span>
                        <span className="mx-2 text-slate-700">·</span>
                        <span className="font-mono">admin123</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          © {new Date().getFullYear()} MASLOP PRODUCT · Todos los derechos reservados
        </p>
      </motion.div>
    </div>
  );
}