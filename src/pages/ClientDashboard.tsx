
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const ClientDashboard = () => {
  const navigate = useNavigate();
  
  // Idéalement, ici nous aurions une vérification d'authentification
  // Pour l'instant, simulons une vérification basique via localStorage
  useEffect(() => {
    const isClient = localStorage.getItem('isClient') === 'true';
    if (!isClient) {
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
              Espace Client
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-agence-gray-800 mb-4">
              Votre Espace Personnel
            </h1>
            <p className="text-agence-gray-600">
              Suivez l'avancement de vos demandes de devis et communiquez avec les professionnels.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 mb-10">
            <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Vos Demandes de Devis</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-agence-gray-200">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type de Projet</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Statut</th>
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
                      <button className="text-agence-orange-500 hover:text-agence-orange-600">
                        Voir détails
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200 mb-10">
            <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Devis Reçus</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-agence-gray-200">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Professionnel</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-agence-gray-100">
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4">
                      <button className="text-agence-orange-500 hover:text-agence-orange-600 mr-2">
                        Voir détails
                      </button>
                      <button className="text-green-500 hover:text-green-600">
                        Accepter
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200">
            <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Informations Personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-agence-gray-600">123.agencemoi@gmail.com</p>
              </div>
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-agence-gray-600">0661461681</p>
              </div>
              <div>
                <p className="font-medium">Code Postal</p>
                <p className="text-agence-gray-600">-</p>
              </div>
            </div>
            <button className="mt-4 bg-agence-orange-500 hover:bg-agence-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
              Modifier mes informations
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
