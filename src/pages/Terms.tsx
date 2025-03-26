
import React, { useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-agence-gray-800 mb-8">Conditions Générales d'Utilisation</h1>
            
            <div className="prose prose-lg max-w-none text-agence-gray-700">
              <p className="lead mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">1. Introduction</h2>
              <p>
                Bienvenue sur AGENCEMOI, la plateforme qui facilite la mise en relation entre particuliers et professionnels de l'aménagement intérieur. 
                Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation de notre site web et de nos services.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">2. Définitions</h2>
              <p>
                <strong>Plateforme :</strong> Le site web AGENCEMOI accessible à l'adresse www.agencemoi.fr<br />
                <strong>Client :</strong> Tout particulier utilisant la plateforme pour chercher des professionnels<br />
                <strong>Professionnel :</strong> Tout prestataire spécialisé dans l'aménagement intérieur inscrit sur la plateforme<br />
                <strong>Services :</strong> L'ensemble des fonctionnalités offertes par la plateforme
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">3. Inscription des Professionnels</h2>
              <p>
                L'inscription en tant que professionnel est soumise à une validation par nos équipes. Les informations fournies doivent être exactes, complètes et à jour.
                Les professionnels s'engagent à maintenir la confidentialité de leurs identifiants de connexion et sont responsables de toutes les activités effectuées sous leur compte.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">4. Utilisation de la Plateforme</h2>
              <p>
                Les utilisateurs s'engagent à utiliser la plateforme conformément aux lois et règlements en vigueur et aux présentes conditions générales.
                Il est interdit d'utiliser la plateforme à des fins illégales ou non autorisées.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">5. Services et Tarification</h2>
              <p>
                Pour les clients particuliers, l'utilisation de la plateforme est entièrement gratuite.<br />
                Pour les professionnels, les frais de mise en relation sont de 5€ TTC par contact. Ces frais sont cumulés en fin de mois pour une facturation unique, payable à 30 jours.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">6. Engagements des Professionnels</h2>
              <p>
                Les professionnels partenaires s'engagent à répondre aux demandes de devis dans un délai de 1 à 3 jours ouvrables.
                Ils garantissent l'exactitude des informations fournies concernant leurs services, produits et promotions.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">7. Responsabilité</h2>
              <p>
                AGENCEMOI agit uniquement en tant qu'intermédiaire entre les clients et les professionnels. Nous ne sommes pas responsables de la qualité des prestations fournies par les professionnels.
                AGENCEMOI se réserve le droit de suspendre ou de supprimer un compte professionnel en cas de non-respect des présentes conditions.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">8. Propriété Intellectuelle</h2>
              <p>
                L'ensemble des éléments constituant la plateforme (textes, graphismes, logiciels, images, etc.) est la propriété exclusive d'AGENCEMOI ou fait l'objet d'une autorisation d'utilisation.
                Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">9. Modification des Conditions Générales</h2>
              <p>
                AGENCEMOI se réserve le droit de modifier les présentes conditions générales à tout moment. Les utilisateurs seront informés des modifications par une notification sur la plateforme.
                L'utilisation continue de la plateforme après modification des conditions générales constitue l'acceptation de ces modifications.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">10. Loi Applicable et Juridiction</h2>
              <p>
                Les présentes conditions générales sont régies par le droit français. Tout litige relatif à l'interprétation ou à l'exécution des présentes conditions sera soumis aux tribunaux compétents.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">11. Contact</h2>
              <p>
                Pour toute question concernant les présentes conditions générales, veuillez nous contacter à l'adresse suivante : 123.agencemoi@gmail.com ou par téléphone au +33 1 23 45 67 89.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
