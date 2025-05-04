
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  
  // Idéalement, ici nous aurions une vérification d'authentification
  // Pour l'instant, simulons une vérification basique via localStorage
  useEffect(() => {
    const isProfessional = localStorage.getItem('isProfessional') === 'true';
    if (!isProfessional) {
      navigate('/');
    }
    window.scrollTo(0, 0);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-4 py-2 rounded-full bg-agence-orange-100 text-agence-orange-700 text-sm font-medium mb-4">
              Espace Professionnel
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-agence-gray-800 mb-4">
              Tableau de Bord Professionnel
            </h1>
            <p className="text-agence-gray-600">
              Gérez vos demandes, envoyez des devis et développez votre activité.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 text-center">
              <h3 className="text-xl font-semibold text-agence-gray-800 mb-2">Demandes Reçues</h3>
              <p className="text-3xl font-bold text-agence-orange-500">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 text-center">
              <h3 className="text-xl font-semibold text-agence-gray-800 mb-2">Devis Envoyés</h3>
              <p className="text-3xl font-bold text-agence-orange-500">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 text-center">
              <h3 className="text-xl font-semibold text-agence-gray-800 mb-2">Devis Acceptés</h3>
              <p className="text-3xl font-bold text-agence-orange-500">0</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 mb-10">
            <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Demandes de Clients</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-agence-gray-200">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type de Projet</th>
                    <th className="py-3 px-4">Code Postal</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-agence-gray-100">
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4">
                      <button className="text-agence-orange-500 hover:text-agence-orange-600 mr-2">
                        Voir détails
                      </button>
                      <button className="text-green-500 hover:text-green-600">
                        Envoyer devis
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200">
              <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Information de Paiement</h2>
              <div className="space-y-2">
                <p className="font-medium">Mode de paiement</p>
                <p className="text-agence-gray-600">Prélèvement SEPA</p>
                <p className="font-medium mt-2">Statut du mandat SEPA</p>
                <p className="text-agence-gray-600">Actif</p>
                <p className="font-medium mt-2">Frais par contact</p>
                <p className="text-agence-gray-600">5€ TTC</p>
              </div>
              <button className="mt-4 bg-agence-orange-500 hover:bg-agence-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                Gérer mes informations de paiement
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200">
              <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Informations Entreprise</h2>
              <div className="space-y-2">
                <p className="font-medium">Nom de l'entreprise</p>
                <p className="text-agence-gray-600">-</p>
                <p className="font-medium mt-2">SIRET</p>
                <p className="text-agence-gray-600">-</p>
                <p className="font-medium mt-2">Adresse</p>
                <p className="text-agence-gray-600">-</p>
                <p className="font-medium mt-2">Code postal</p>
                <p className="text-agence-gray-600">-</p>
              </div>
              <button className="mt-4 bg-agence-orange-500 hover:bg-agence-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                Modifier mes informations
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfessionalDashboard;
