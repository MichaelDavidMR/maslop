// Contact.tsx - Enhanced
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Phone,
  MapPin,
  Clock,
  Mail,
  Send,
  Facebook,
  Instagram,
  Check,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Mensaje enviado exitosamente');
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      content: '809-520-6178',
      href: 'tel:809-520-6178',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/30',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@maslop.com',
      href: 'mailto:info@maslop.com',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/30',
    },
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'San Pedro de Macorís\nRepública Dominicana',
      href: '#',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/30',
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun – Vie: 8:00 AM – 6:00 PM\nSáb: 8:00 AM – 2:00 PM',
      href: '#',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'hover:border-amber-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] pt-28 pb-16">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-600/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">Contacto</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Contáctanos
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Estamos aquí para ayudarte con cualquier consulta, cotización o información.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Form */}
          <motion.div {...fadeUp(0.1)}>
            <div className="glass-strong rounded-2xl border border-white/[0.07] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="p-7 sm:p-8">
                <h2 className="text-xl font-black text-white tracking-tight mb-7">
                  Envíanos un mensaje
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-14">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-black text-xl mb-2">¡Mensaje enviado!</h3>
                    <p className="text-slate-400">Te responderemos lo antes posible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-slate-400 text-sm font-medium">
                          Nombre completo *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Tu nombre"
                          required
                          className="bg-slate-900/80 border-slate-700/60 text-white placeholder:text-slate-600 rounded-xl h-10 focus:border-blue-500/60 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-slate-400 text-sm font-medium">
                          Teléfono
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="809-000-0000"
                          className="bg-slate-900/80 border-slate-700/60 text-white placeholder:text-slate-600 rounded-xl h-10 focus:border-blue-500/60 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-slate-400 text-sm font-medium">
                        Correo electrónico *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder=".Massielopez_10@hotmail.com"
                        required
                        className="bg-slate-900/80 border-slate-700/60 text-white placeholder:text-slate-600 rounded-xl h-10 focus:border-blue-500/60 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-slate-400 text-sm font-medium">
                        Mensaje *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="¿En qué podemos ayudarte?"
                        required
                        rows={5}
                        className="bg-slate-900/80 border-slate-700/60 text-white placeholder:text-slate-600 rounded-xl resize-none focus:border-blue-500/60 transition-all"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary h-11 rounded-xl font-semibold text-[15px]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2.5">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* WhatsApp card */}
            <motion.div {...fadeUp(0.2)} className="mt-4">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-600/20 bg-gradient-to-br from-emerald-950/40 to-emerald-900/10">
                <div className="absolute inset-0 bg-emerald-500/3" />
                <div className="relative p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-600/30">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm mb-0.5">¿Prefieres WhatsApp?</p>
                    <p className="text-slate-400 text-xs">Respuesta más rápida y directa</p>
                  </div>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm h-9 px-5 shadow-md shadow-emerald-600/20 flex-shrink-0"
                    asChild
                  >
                    <a href="https://wa.me/18095206178" target="_blank" rel="noopener noreferrer">
                      Escribir
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Info */}
          <motion.div {...fadeUp(0.2)} className="space-y-5">
            {/* Info cards grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, i) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className={`group block p-5 glass-strong rounded-2xl border border-white/[0.06] ${info.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
                >
                  <div className={`w-10 h-10 rounded-xl ${info.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <info.icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <p className="text-white font-bold text-sm mb-1.5">{info.title}</p>
                  <p className="text-slate-400 text-sm whitespace-pre-line leading-relaxed">{info.content}</p>
                </motion.a>
              ))}
            </div>

            {/* Social */}
            <div className="glass-strong rounded-2xl border border-white/[0.06] p-5">
              <p className="text-white font-bold text-sm mb-4">Síguenos en redes</p>
              <div className="flex gap-2">
                {[
                  {
                    href: 'https://wa.me/18095206178',
                    label: 'WhatsApp',
                    hover: 'hover:bg-emerald-600',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                  },
                  {
                    href: 'https://www.facebook.com/massiellopez',
                    label: 'Facebook',
                    hover: 'hover:bg-blue-600',
                    icon: <Facebook className="w-5 h-5" />,
                  },
                  {
                    href: 'https://www.instagram.com/massiellopez',
                    label: 'Instagram',
                    hover: 'hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600',
                    icon: <Instagram className="w-5 h-5" />,
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-11 h-11 rounded-xl bg-slate-800/80 border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white ${s.hover} transition-all duration-300 hover:border-transparent hover:shadow-lg hover:-translate-y-0.5`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="glass-strong rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="aspect-video bg-[#0a0f1e] flex flex-col items-center justify-center gap-3 relative">
                <div className="absolute inset-0 bg-dots" />
                <div className="relative w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="relative text-center">
                  <p className="text-white font-semibold text-sm">San Pedro de Macorís</p>
                  <p className="text-slate-500 text-xs mt-0.5">República Dominicana</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}