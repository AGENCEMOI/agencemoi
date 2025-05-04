
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Idéalement, ici nous aurions une vérification d'authentification
  // Pour l'instant, simulons une vérification basique via localStorage
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
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
            <span className="inline-block px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
              Accès Administrateur
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-agence-gray-800 mb-4">
              Tableau de Bord Administrateur
            </h1>
            <p className="text-agence-gray-600">
              Gérez vos professionnels et vos clients via ce panneau d'administration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200">
              <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Statistiques Clients</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Total des demandes:</span> 0</p>
                <p><span className="font-medium">Demandes en attente:</span> 0</p>
                <p><span className="font-medium">Demandes traitées:</span> 0</p>
              </div>
              <button className="mt-4 bg-agence-orange-500 hover:bg-agence-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                Voir tous les clients
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-agence-gray-200">
              <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Statistiques Professionnels</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Total inscrits:</span> 0</p>
                <p><span className="font-medium">En attente de validation:</span> 0</p>
                <p><span className="font-medium">Actifs:</span> 0</p>
              </div>
              <button className="mt-4 bg-agence-orange-500 hover:bg-agence-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                Voir tous les professionnels
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-agence-gray-200 mb-16">
            <h2 className="text-xl font-semibold text-agence-gray-800 mb-4">Dernières Activités</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-agence-gray-200">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-agence-gray-100">
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                    <td className="py-3 px-4 text-agence-gray-600">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
