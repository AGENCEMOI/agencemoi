
import React, { useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HowItWorks from '@/components/Home/HowItWorks';

const CommentCaMarche = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-agence-gray-800 mb-4">Comment Ça Marche</h1>
            <p className="text-agence-gray-600">
              Découvrez notre processus simple et efficace pour trouver les meilleurs professionnels pour votre projet d'aménagement intérieur.
            </p>
          </div>
        </div>
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default CommentCaMarche;
