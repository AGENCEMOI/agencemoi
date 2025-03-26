
import React, { useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import RegistrationForm from '@/components/ProfessionalForm/RegistrationForm';

const ProfessionalForm = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-4 py-2 rounded-full bg-agence-orange-100 text-agence-orange-700 text-sm font-medium mb-4">
              Espace Professionnels
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-agence-gray-800 mb-4">Devenez partenaire AGENCEMOI</h1>
            <p className="text-agence-gray-600">
              Rejoignez notre réseau de cuisinistes et professionnels de l'agencement pour développer votre activité avec des clients qualifiés.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 text-center">
              <div className="w-16 h-16 bg-agence-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-agence-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-agence-gray-800 mb-2">Augmentez votre visibilité</h3>
              <p className="text-agence-gray-600">
                Présentez vos services à des clients qualifiés activement à la recherche de professionnels comme vous.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 text-center">
              <div className="w-16 h-16 bg-agence-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-agence-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-agence-gray-800 mb-2">Recevez des demandes qualifiées</h3>
              <p className="text-agence-gray-600">
                Obtenez des demandes détaillées avec toutes les informations nécessaires pour proposer des devis précis.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 text-center">
              <div className="w-16 h-16 bg-agence-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-agence-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-agence-gray-800 mb-2">Payez uniquement au résultat</h3>
              <p className="text-agence-gray-600">
                Aucun frais fixe, vous ne payez que pour les mises en relation effectuées (5€ TTC par contact).
              </p>
            </div>
          </div>
          
          <div className="bg-agence-gray-50 p-6 rounded-xl border border-agence-gray-200 mb-16">
            <h2 className="text-2xl font-semibold text-agence-gray-800 mb-4">Zone de couverture</h2>
            <p className="text-agence-gray-600 mb-4">
              Nos clients sont mis en relation avec des professionnels qualifiés dans leur code postal ou dans un rayon de 20km.
              Cela garantit que vous recevrez des demandes pertinentes et localisées près de votre zone d'activité.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-block px-3 py-1 bg-agence-orange-100 text-agence-orange-700 rounded-full text-sm">Même code postal</span>
              <span className="inline-block px-3 py-1 bg-agence-orange-100 text-agence-orange-700 rounded-full text-sm">Rayon de 20km</span>
              <span className="inline-block px-3 py-1 bg-agence-orange-100 text-agence-orange-700 rounded-full text-sm">Mise en relation locale</span>
            </div>
          </div>
          
          <RegistrationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfessionalForm;
