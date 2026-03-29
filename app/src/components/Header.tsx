import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, Phone, User, Home, Package, Contact } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/catalogo', label: 'Catálogo', icon: Package },
    { href: '/contacto', label: 'Contacto', icon: Contact },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-slate-900'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:809-520-6178" className="flex items-center gap-1.5 hover:text-blue-100 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>809-520-6178</span>
            </a>
            <span className="hidden sm:inline text-blue-300">|</span>
            <span className="hidden sm:inline">San Pedro de Macorís, R.D.</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-blue-100 transition-colors">
                    Panel Admin
                  </Link>
                )}
                <button onClick={logout} className="hover:text-blue-100 transition-colors">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 hover:text-blue-100 transition-colors">
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20 transition-shadow">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tighter">M</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                <span className="text-xs font-bold text-white">L</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">
                MASLOP
              </h1>
              <p className="text-[10px] sm:text-xs text-blue-400 font-semibold tracking-wider">
                PRODUCT
              </p>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-slate-900 border-slate-800">
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="search"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                      autoFocus
                    />
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-slate-900 border-slate-800">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center">
                      <span className="text-xl font-black text-white">M</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">MASLOP</h2>
                      <p className="text-xs text-blue-400 font-semibold">PRODUCT</p>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          isActive(link.href)
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-slate-800 pt-4">
                    <a
                      href="tel:809-520-6178"
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white"
                    >
                      <Phone className="w-5 h-5" />
                      <span>809-520-6178</span>
                    </a>
                    <div className="px-4 py-2 text-sm text-slate-400">
                      San Pedro de Macorís, R.D.
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
