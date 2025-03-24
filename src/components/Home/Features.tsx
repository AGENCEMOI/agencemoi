
import React from 'react';
import { Clock, Users, Palette, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Clock className="h-12 w-12 text-agence-orange-500" />,
      title: 'Réponse en 24h',
      description: 'Recevez jusqu'à trois devis personnalisés et détaillés de professionnels qualifiés en moins de 24 heures.'
    },
    {
      icon: <Users className="h-12 w-12 text-agence-orange-500" />,
      title: 'Professionnels vérifiés',
      description: 'Nous sélectionnons rigoureusement nos partenaires pour garantir qualité et professionnalisme.'
    },
    {
      icon: <Palette className="h-12 w-12 text-agence-orange-500" />,
      title: 'Projets sur mesure',
      description: 'De la cuisine à la salle de bain, nos experts s'adaptent à vos besoins et à votre budget.'
    },
    {
      icon: <Shield className="h-12 w-12 text-agence-orange-500" />,
      title: 'Service gratuit',
      description: 'Notre service de mise en relation est entièrement gratuit pour les particuliers.'
    }
  ];

  return (
    <section className="py-24 bg-agence-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Pourquoi choisir AGENCEMOI ?</h2>
          <p className="section-subtitle">
            Notre plateforme simplifie votre recherche de professionnels pour vos projets d'aménagement intérieur avec une approche efficace et transparente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-8 text-center card-hover animate-scale-in"
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
