
import React from 'react';
import { FileText, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FileText className="h-16 w-16 text-white" />,
      title: "Déposez votre projet",
      description: "Répondez à notre QCM intelligent pour décrire précisément votre projet d'aménagement intérieur."
    },
    {
      icon: <Users className="h-16 w-16 text-white" />,
      title: "Choisissez vos pros",
      description: "Sélectionnez entre 3 et 5 professionnels vérifiés parmi notre réseau national de partenaires."
    },
    {
      icon: <Clock className="h-16 w-16 text-white" />,
      title: "Recevez vos devis",
      description: "Comparez plusieurs devis personnalisés et choisissez le professionnel idéal pour votre projet."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-agence-gray-100 to-white opacity-50 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-agence-gray-800">Comment ça marche ?</h2>
          <p className="text-lg text-agence-gray-600 mb-12 max-w-3xl mx-auto">
            Un processus simple et rapide pour trouver le professionnel qu'il vous faut
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
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
              <span className="bg-agence-gray-200 text-agence-gray-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">Étape {index + 1}</span>
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
            className="btn-primary inline-flex items-center space-x-2 text-lg py-4 px-8 animate-fade-in"
            style={{animationDelay: '0.6s'}}
          >
            <span>Démarrer mon projet gratuitement</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
