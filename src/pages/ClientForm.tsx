
import React, { useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import MultiStepForm from '@/components/ClientForm/MultiStepForm';

const ClientForm = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 pb-16 bg-gradient-to-b from-white to-agence-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-agence-gray-800 mb-4">Demande de devis</h1>
            <p className="text-agence-gray-600">
              Remplissez ce formulaire pour recevoir gratuitement jusqu'à trois devis personnalisés de nos partenaires professionnels.
              <br />
              <span className="text-sm mt-2 inline-block text-agence-orange-700">
                Les demandes sont envoyées à: 123.agencemoi@gmail.com
              </span>
            </p>
          </div>
          
          <MultiStepForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientForm;
