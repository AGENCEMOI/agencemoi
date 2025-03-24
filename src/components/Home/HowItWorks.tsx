
import React from 'react';
import { FileText, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FileText className="h-16 w-16 text-white" />,
      title: "Remplissez le formulaire",
      description: "Décrivez votre projet d'aménagement intérieur et vos besoins spécifiques en quelques minutes."
    },
    {
      icon: <Users className="h-16 w-16 text-white" />,
      title: "Sélection des professionnels",
      description: "Notre algorithme identifie les cuisinistes et agenceurs les plus adaptés à votre projet."
    },
    {
      icon: <Clock className="h-16 w-16 text-white" />,
      title: "Recevez vos devis",
      description: "Jusqu'à trois professionnels vous contactent en moins de 24h avec des propositions personnalisées."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Comment ça fonctionne</h2>
          <p className="section-subtitle">
            Notre processus simple vous permet d'obtenir rapidement des devis personnalisés pour votre projet d'aménagement intérieur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center animate-fade-in" style={{animationDelay: `${index * 0.2}s`}}>
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-agence-orange-500 rounded-full opacity-20 scale-110 animate-pulse"></div>
                <div className="bg-agence-orange-500 rounded-full p-6 relative">
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-agence-gray-200 -translate-y-1/2">
                    <div className="absolute right-0 w-3 h-3 bg-agence-orange-500 rounded-full -translate-y-1/3"></div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-agence-gray-800 mb-4 text-center">
                {step.title}
              </h3>
              <p className="text-agence-gray-600 text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/client-form" 
            className="btn-primary inline-flex items-center space-x-2 text-lg py-3 px-8 animate-fade-in"
            style={{animationDelay: '0.6s'}}
          >
            <span>Démarrer mon projet</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
