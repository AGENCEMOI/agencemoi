
import React, { useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Shield } from 'lucide-react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Shield className="h-12 w-12 text-agence-orange-500 mr-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-agence-gray-800">Politique de Confidentialité</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8 border border-agence-gray-100 prose prose-lg max-w-none text-agence-gray-700">
              <p className="lead mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <p>
                Chez AGENCEMOI, nous accordons une grande importance à la protection de vos données personnelles. 
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre plateforme.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">1. Collecte des Données</h2>
              <p>
                Nous collectons les informations que vous nous fournissez directement lors de votre inscription ou lors de l'utilisation de nos services :
              </p>
              <ul className="list-disc pl-5 mt-2 mb-6">
                <li>Pour les clients : nom, prénom, adresse email, numéro de téléphone, adresse postale, et détails de votre projet d'aménagement</li>
                <li>Pour les professionnels : informations sur l'entreprise (nom, SIRET, adresse), coordonnées du contact, informations sur les produits et services</li>
                <li>Données de paiement pour les professionnels (traitées de manière sécurisée par nos prestataires de paiement)</li>
                <li>Informations techniques telles que l'adresse IP, le type et la version du navigateur, le système d'exploitation</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">2. Utilisation des Données</h2>
              <p>
                Nous utilisons vos données personnelles pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-5 mt-2 mb-6">
                <li>Fournir, exploiter et améliorer notre plateforme et nos services</li>
                <li>Mettre en relation les clients avec des professionnels adaptés à leurs projets</li>
                <li>Traiter les paiements et établir des factures</li>
                <li>Communiquer avec vous concernant votre compte, nos services, ou des promotions</li>
                <li>Prévenir la fraude et assurer la sécurité de notre plateforme</li>
                <li>Respecter nos obligations légales</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">3. Partage des Données</h2>
              <p>
                Nous pouvons partager vos données personnelles avec :
              </p>
              <ul className="list-disc pl-5 mt-2 mb-6">
                <li>Les professionnels ou clients avec lesquels nous vous mettons en relation (uniquement les informations nécessaires)</li>
                <li>Nos prestataires de services (hébergement, paiement, analyse, communication)</li>
                <li>Les autorités compétentes lorsque la loi l'exige</li>
              </ul>
              <p>
                Nous ne vendons pas vos données personnelles à des tiers.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">4. Sécurité des Données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, 
                altération, divulgation ou destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">5. Conservation des Données</h2>
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les finalités pour lesquelles elles ont été collectées, 
                sauf si la loi exige ou permet une période de conservation plus longue. Les critères utilisés pour déterminer nos délais de conservation incluent :
              </p>
              <ul className="list-disc pl-5 mt-2 mb-6">
                <li>La durée pendant laquelle nous entretenons une relation avec vous</li>
                <li>L'existence d'une obligation légale à laquelle nous sommes soumis</li>
                <li>L'opportunité de conservation au regard de notre position juridique (délais de prescription applicables, litiges)</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">6. Vos Droits</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-5 mt-2 mb-6">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement de vos données dans certains cas</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit de retirer votre consentement à tout moment</li>
                <li>Droit d'introduire une réclamation auprès d'une autorité de contrôle</li>
              </ul>
              <p>
                Pour exercer ces droits, veuillez nous contacter à l'adresse email suivante : agencemoi@gmail.com
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">7. Cookies</h2>
              <p>
                Notre site utilise des cookies pour améliorer votre expérience utilisateur, analyser l'utilisation de notre site et personnaliser nos publicités. 
                Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">8. Modifications de la Politique de Confidentialité</h2>
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version la plus récente sera toujours disponible sur notre site web. 
                Nous vous encourageons à consulter régulièrement cette page pour rester informé de tout changement.
              </p>
              
              <h2 className="text-2xl font-semibold text-agence-gray-800 mt-10 mb-4">9. Contact</h2>
              <p>
                Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à l'adresse suivante : agencemoi@gmail.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
