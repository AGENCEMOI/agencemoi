import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase.rpc('has_role', {
            _user_id: session.user.id,
            _role: 'admin'
          });
          if (!error && data === true) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        setIsAdmin(!error && data === true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-agence-gray-900/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300"
        >
          <span className="font-playfair text-2xl font-bold">
            <span className={`transition-colors duration-500 ${isScrolled ? 'text-agence-gray-800' : 'text-white'}`}>AGENCE</span>
            <span className="text-agence-orange-500">MOI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`transition-colors duration-500 hover:text-agence-orange-500 ${isScrolled ? 'text-agence-gray-700' : 'text-white'}`}
          >
            Accueil
          </Link>
          <Link 
            to="/comment-ca-marche" 
            className={`transition-colors duration-500 hover:text-agence-orange-500 ${isScrolled ? 'text-agence-gray-700' : 'text-white'}`}
          >
            Comment ça marche
          </Link>
          <Link 
            to="/professional-form" 
            className={`transition-colors duration-500 hover:text-agence-orange-500 ${isScrolled ? 'text-agence-gray-700' : 'text-white'}`}
          >
            Professionnels
          </Link>
          {isAdmin && (
            <Link 
              to="/admin-dashboard" 
              className={`transition-colors duration-500 hover:text-agence-orange-500 flex items-center gap-1 ${isScrolled ? 'text-agence-gray-700' : 'text-white'}`}
            >
              <Shield size={16} />
              Admin
            </Link>
          )}
          <Link 
            to="/client-form" 
            className="btn-primary transition-transform duration-300 hover:scale-105"
          >
            Demander un devis
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden transition-colors duration-500 ${isScrolled ? 'text-agence-gray-800' : 'text-white'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-in-right">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-agence-gray-700 hover:text-agence-orange-500 transition-colors py-2 border-b border-agence-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/comment-ca-marche" 
              className="text-agence-gray-700 hover:text-agence-orange-500 transition-colors py-2 border-b border-agence-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Comment ça marche
            </Link>
            <Link 
              to="/professional-form" 
              className="text-agence-gray-700 hover:text-agence-orange-500 transition-colors py-2 border-b border-agence-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Professionnels
            </Link>
            {isAdmin && (
              <Link 
                to="/admin-dashboard" 
                className="text-agence-gray-700 hover:text-agence-orange-500 transition-colors py-2 border-b border-agence-gray-100 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
            <Link 
              to="/client-form" 
              className="btn-primary text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Demander un devis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
