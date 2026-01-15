
import React from 'react';
import { Clock, Users, Palette, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Clock className="h-12 w-12 text-agence-orange-500" />,
      title: 'QCM intelligent',
      description: "Déposez votre projet en quelques minutes via notre questionnaire intelligent et détaillé."
    },
    {
      icon: <Users className="h-12 w-12 text-agence-orange-500" />,
      title: '3 à 5 professionnels',
      description: "Sélectionnez entre 3 et 5 professionnels vérifiés et recevez plusieurs devis personnalisés."
    },
    {
      icon: <Palette className="h-12 w-12 text-agence-orange-500" />,
      title: 'Aménagement intérieur',
      description: "Cuisine, salle de bain, dressing, bibliothèque... tous vos projets d'agencement sur mesure."
    },
    {
      icon: <Shield className="h-12 w-12 text-agence-orange-500" />,
      title: '100% gratuit',
      description: "Notre service de mise en relation est entièrement gratuit pour tous les particuliers."
    }
  ];

  return (
    <section className="py-24 bg-agence-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-agence-gray-800">Pourquoi choisir AGENCEMOI ?</h2>
          <p className="text-lg text-agence-gray-600 mb-12 max-w-3xl mx-auto">
            Application mobile et site web de mise en relation entre particuliers et professionnels de l'aménagement intérieur partout en France.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 text-center card-hover animate-scale-in border-t-4 border-agence-orange-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-agence-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-agence-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
