
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-agence-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-playfair text-2xl font-bold">
                AGENCE<span className="text-agence-orange-500">MOI</span>
              </span>
            </Link>
            <p className="text-agence-gray-300 max-w-xs">
              Nous simplifions la recherche de professionnels pour vos projets d'agencement intérieur avec une mise en relation rapide et efficace.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Liens utiles</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-agence-gray-300 hover:text-agence-orange-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/comment-ca-marche" className="text-agence-gray-300 hover:text-agence-orange-500 transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link to="/client-form" className="text-agence-gray-300 hover:text-agence-orange-500 transition-colors">
                  Demander un devis
                </Link>
              </li>
              <li>
                <Link to="/professional-form" className="text-agence-gray-300 hover:text-agence-orange-500 transition-colors">
                  Espace professionnels
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-agence-gray-300 hover:text-agence-orange-500 transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-agence-gray-300 hover:text-agence-orange-500 transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-agence-orange-500 h-5 w-5 mt-1" />
                <span className="text-agence-gray-300">
                  73610 Attignat-oncin, France
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-agence-orange-500 h-5 w-5" />
                <span className="text-agence-gray-300">123.agencemoi@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-agence-gray-700 mt-16 pt-8 text-center text-agence-gray-400">
          <p>&copy; {new Date().getFullYear()} AGENCEMOI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
