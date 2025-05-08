
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie L.",
      location: "Paris",
      text: "Grâce à AGENCEMOI, j'ai pu trouver le cuisiniste parfait pour ma nouvelle cuisine. Le service était rapide et les devis très détaillés.",
      rating: 5,
      date: "15 avril 2023"
    },
    {
      name: "Pierre D.",
      location: "Lyon",
      text: "Service impeccable du début à la fin. J'ai reçu trois devis en seulement 2 jours et j'ai pu comparer sereinement les offres pour mon projet de salle de bain.",
      rating: 5,
      date: "3 mars 2023"
    },
    {
      name: "Sophie M.",
      location: "Bordeaux",
      text: "Je recommande vivement AGENCEMOI pour la qualité des professionnels proposés. Ma bibliothèque sur mesure est exactement comme je l'imaginais.",
      rating: 4,
      date: "27 mai 2023"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-agence-gray-800">Ils nous font confiance</h2>
          <p className="text-lg text-agence-gray-600 mb-12 max-w-3xl mx-auto">
            Découvrez ce que nos clients disent de notre service et de la qualité des professionnels avec qui nous travaillons.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="border border-agence-gray-200 hover:border-agence-orange-300 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-agence-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-agence-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-agence-gray-500">{testimonial.location}</p>
                  </div>
                  <span className="text-xs text-agence-gray-400">{testimonial.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
