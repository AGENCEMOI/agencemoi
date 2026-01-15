
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Zap, Crown } from 'lucide-react';

const ProfessionalSection = () => {
  return (
    <section className="py-24 bg-agence-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-agence-orange-500/20 text-agence-orange-400 text-sm font-medium mb-6">
            Espace Professionnels
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Développez votre activité avec <span className="text-white">AGENCE</span><span className="text-agence-orange-500">MOI</span>
          </h2>
          <p className="text-lg text-agence-gray-300">
            Rejoignez notre réseau national de professionnels de l'aménagement intérieur et recevez des leads qualifiés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option à la carte */}
          <div className="bg-agence-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-agence-gray-600 hover:border-agence-orange-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-agence-orange-500/20 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-agence-orange-500" />
                </div>
                <h3 className="text-xl font-semibold">À la carte</h3>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">10€</span>
              <span className="text-agence-gray-400 ml-2">/ mise en relation</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-agence-gray-300">Paiement par lead</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-agence-gray-300">Sans engagement</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-agence-gray-300">Leads qualifiés</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-agence-gray-300">Accès à la plateforme</span>
              </li>
            </ul>
            <Link
              to="/professional-form"
              className="block w-full text-center py-3 px-6 rounded-lg border-2 border-agence-orange-500 text-agence-orange-500 font-semibold hover:bg-agence-orange-500 hover:text-white transition-all duration-300"
            >
              Commencer
            </Link>
          </div>

          {/* Option Premium */}
          <div className="bg-gradient-to-br from-agence-orange-500/20 to-agence-orange-600/10 rounded-2xl p-8 border-2 border-agence-orange-500 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-agence-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>RECOMMANDÉ</span>
              </span>
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-agence-orange-500 p-3 rounded-full">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Premium Pro</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">100€</span>
              <span className="text-agence-gray-400 ml-2">/ mois</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-white font-medium">Leads illimités</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-white font-medium">Visibilité prioritaire</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-white font-medium">Badge Premium</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-white font-medium">Support prioritaire</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-agence-orange-500" />
                <span className="text-white font-medium">Statistiques avancées</span>
              </li>
            </ul>
            <Link
              to="/professional-form"
              className="block w-full text-center py-3 px-6 rounded-lg bg-agence-orange-500 text-white font-semibold hover:bg-agence-orange-600 transition-all duration-300 shadow-lg shadow-agence-orange-500/30"
            >
              Devenir Premium
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalSection;
