
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-agence-gray-900/90 to-agence-gray-800/80 z-0"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 z-[-1]">
        <img 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=3453&auto=format&fit=crop" 
          alt="Modern kitchen design" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-agence-orange-500/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-agence-orange-500/10 rounded-full blur-3xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6 animate-fade-in">
            Trouvez le meilleur cuisiniste près de chez vous
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slide-in-up">
            Des <span className="text-agence-orange-500">cuisinistes qualifiés</span> pour votre projet sur mesure
          </h1>
          <p className="text-lg md:text-xl text-agence-gray-200 mb-8 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            Comparez jusqu'à trois devis personnalisés et gratuits de professionnels qualifiés pour votre cuisine, bibliothèque ou salle de bain en 1 à 3 jours ouvrables.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            <Link 
              to="/client-form" 
              className="btn-primary flex items-center justify-center space-x-2 text-lg py-3 px-8"
            >
              <span>Demander un devis gratuit</span>
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/comment-ca-marche" 
              className="btn-secondary flex items-center justify-center space-x-2 text-lg"
            >
              <span>Comment ça marche</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
