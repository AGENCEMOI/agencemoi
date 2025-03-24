
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Check, Info } from 'lucide-react';

const RegistrationForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    siret: '',
    address: '',
    postalCode: '',
    city: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    website: '',
    origin: '',
    averagePrice: '',
    entityType: '',
    currentPromotions: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    bankName: '',
    bankIban: '',
    termsAccepted: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Professional form submitted:', formData);
    
    setSubmitted(true);
    
    toast({
      title: "Inscription réussie !",
      description: "Votre demande d'inscription a été envoyée avec succès. Nous vous contacterons prochainement pour finaliser votre partenariat.",
    });
  };

  const renderFormStep1 = () => (
    <div className="animate-fade-in space-y-6">
      <h3 className="text-2xl font-semibold mb-8 text-agence-gray-800">Informations de votre entreprise</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="companyName" className="form-label">Nom de l'entreprise <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Raison sociale"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="siret" className="form-label">Numéro SIRET <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="siret"
            name="siret"
            value={formData.siret}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="14 chiffres"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="address" className="form-label">Adresse <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Adresse de l'entreprise"
          />
        </div>
        
        <div>
          <label htmlFor="postalCode" className="form-label">Code Postal <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Code postal"
          />
        </div>
        
        <div>
          <label htmlFor="city" className="form-label">Ville <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Ville"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="contactName" className="form-label">Personne à contacter <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Nom et prénom"
          />
        </div>
        
        <div>
          <label htmlFor="contactPhone" className="form-label">Téléphone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Numéro de téléphone"
          />
        </div>
        
        <div>
          <label htmlFor="contactEmail" className="form-label">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Adresse email"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="website" className="form-label">Site web</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="input-field w-full"
            placeholder="https://www.votresite.fr"
          />
        </div>
      </div>
    </div>
  );

  const renderFormStep2 = () => (
    <div className="animate-fade-in space-y-6">
      <h3 className="text-2xl font-semibold mb-8 text-agence-gray-800">Informations sur vos produits</h3>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="origin" className="form-label">Origine de fabrication <span className="text-red-500">*</span></label>
          <select
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            required
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="france">Française</option>
            <option value="germany">Allemande</option>
            <option value="sweden">Suédoise</option>
            <option value="italy">Italienne</option>
            <option value="other">Autre</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="averagePrice" className="form-label">Budget moyen des paniers <span className="text-red-500">*</span></label>
          <select
            id="averagePrice"
            name="averagePrice"
            value={formData.averagePrice}
            onChange={handleInputChange}
            required
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="less5k">Moins de 5 000 €</option>
            <option value="5kTo10k">5 000 € à 10 000 €</option>
            <option value="10kTo15k">10 000 € à 15 000 €</option>
            <option value="15kTo20k">15 000 € à 20 000 €</option>
            <option value="more20k">Plus de 20 000 €</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="entityType" className="form-label">Type d'entité <span className="text-red-500">*</span></label>
          <select
            id="entityType"
            name="entityType"
            value={formData.entityType}
            onChange={handleInputChange}
            required
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="brand">Enseigne</option>
            <option value="independent">Indépendant</option>
            <option value="factory">Magasin d'usine</option>
            <option value="other">Autre</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="currentPromotions" className="form-label">Promotions en cours</label>
          <textarea
            id="currentPromotions"
            name="currentPromotions"
            value={formData.currentPromotions}
            onChange={handleInputChange}
            className="input-field w-full resize-none"
            rows={4}
            placeholder="Décrivez vos promotions actuelles (optionnel)"
          ></textarea>
        </div>
      </div>
      
      <div className="p-4 bg-agence-gray-50 rounded-lg border border-agence-gray-200">
        <div className="flex">
          <Info className="h-5 w-5 text-agence-orange-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-agence-gray-800 mb-1">Comment fonctionne notre plateforme ?</h4>
            <p className="text-sm text-agence-gray-600">
              Notre algorithme détecte automatiquement les mises en relation pertinentes pour votre activité. 
              Vous ne payez que pour les contacts qualifiés qui correspondent à vos critères.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormStep3 = () => (
    <div className="animate-fade-in space-y-6">
      <h3 className="text-2xl font-semibold mb-8 text-agence-gray-800">Modalités de paiement</h3>
      
      <div className="p-5 border border-agence-orange-200 bg-agence-orange-50 rounded-lg mb-6">
        <h4 className="text-lg font-semibold text-agence-gray-800 mb-3">Conditions de facturation</h4>
        <p className="text-agence-gray-700 mb-3">
          Les professionnels partenaires sont facturés <strong>5€ TTC par contact</strong>. Les frais sont cumulés en fin de mois pour une facturation unique, payable à 30 jours.
        </p>
        <p className="text-agence-gray-700">
          Des factures sont générées automatiquement et envoyées par email le premier jour de chaque mois.
        </p>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-agence-gray-800 mb-4">Choisissez votre méthode de paiement</h4>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="paymentMethodCard"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleInputChange}
              className="w-5 h-5 text-agence-orange-500"
            />
            <label htmlFor="paymentMethodCard" className="text-agence-gray-800 font-medium">
              Carte bancaire
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="paymentMethodBank"
              name="paymentMethod"
              value="bank"
              checked={formData.paymentMethod === 'bank'}
              onChange={handleInputChange}
              className="w-5 h-5 text-agence-orange-500"
            />
            <label htmlFor="paymentMethodBank" className="text-agence-gray-800 font-medium">
              Prélèvement bancaire
            </label>
          </div>
        </div>
        
        {formData.paymentMethod === 'card' && (
          <div className="animate-fade-in space-y-4 p-5 border border-agence-gray-200 rounded-lg">
            <div>
              <label htmlFor="cardNumber" className="form-label">Numéro de carte <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required={formData.paymentMethod === 'card'}
                className="input-field w-full"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExpiry" className="form-label">Date d'expiration <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  required={formData.paymentMethod === 'card'}
                  className="input-field w-full"
                  placeholder="MM/AA"
                  maxLength={5}
                />
              </div>
              
              <div>
                <label htmlFor="cardCvv" className="form-label">CVV <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="cardCvv"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  required={formData.paymentMethod === 'card'}
                  className="input-field w-full"
                  placeholder="XXX"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        )}
        
        {formData.paymentMethod === 'bank' && (
          <div className="animate-fade-in space-y-4 p-5 border border-agence-gray-200 rounded-lg">
            <div>
              <label htmlFor="bankName" className="form-label">Nom de la banque <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required={formData.paymentMethod === 'bank'}
                className="input-field w-full"
                placeholder="Nom de votre banque"
              />
            </div>
            
            <div>
              <label htmlFor="bankIban" className="form-label">IBAN <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="bankIban"
                name="bankIban"
                value={formData.bankIban}
                onChange={handleInputChange}
                required={formData.paymentMethod === 'bank'}
                className="input-field w-full"
                placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
              />
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              required
              className="w-5 h-5 text-agence-orange-500 mt-1"
            />
            <label htmlFor="termsAccepted" className="text-agence-gray-700">
              J'accepte les <a href="/terms" className="text-agence-orange-500 hover:underline">conditions générales</a>, 
              la <a href="/privacy" className="text-agence-orange-500 hover:underline">politique de confidentialité</a> et 
              j'autorise AGENCEMOI à prélever les frais de mise en relation selon les conditions décrites ci-dessus.
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="text-center py-12 animate-scale-in">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-agence-gray-800 mb-4">Inscription réussie !</h2>
      <p className="text-agence-gray-600 max-w-md mx-auto mb-8">
        Votre demande d'inscription a été envoyée avec succès. Notre équipe va étudier votre candidature et reviendra vers vous dans les meilleurs délais.
      </p>
      <a href="/" className="btn-primary inline-flex">
        Retour à l'accueil
      </a>
    </div>
  );

  const renderCurrentStep = () => {
    if (submitted) {
      return renderSuccessMessage();
    }
    
    switch (step) {
      case 1:
        return renderFormStep1();
      case 2:
        return renderFormStep2();
      case 3:
        return renderFormStep3();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {!submitted && (
        <div className="flex mb-8 border-b border-agence-gray-200">
          <button
            className={`flex-1 text-center py-4 px-2 font-medium ${
              step === 1 ? 'text-agence-orange-500 border-b-2 border-agence-orange-500' : 'text-agence-gray-500'
            }`}
            onClick={() => setStep(1)}
          >
            1. Entreprise
          </button>
          <button
            className={`flex-1 text-center py-4 px-2 font-medium ${
              step === 2 ? 'text-agence-orange-500 border-b-2 border-agence-orange-500' : 'text-agence-gray-500'
            }`}
            onClick={() => setStep(2)}
          >
            2. Produits
          </button>
          <button
            className={`flex-1 text-center py-4 px-2 font-medium ${
              step === 3 ? 'text-agence-orange-500 border-b-2 border-agence-orange-500' : 'text-agence-gray-500'
            }`}
            onClick={() => setStep(3)}
          >
            3. Paiement
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={`bg-white rounded-xl p-6 md:p-8 shadow-sm border border-agence-gray-200 ${submitted ? 'bg-agence-gray-50' : ''}`}>
        {renderCurrentStep()}
        
        {!submitted && (
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-agence-gray-300 rounded-full text-agence-gray-700 hover:bg-agence-gray-100 transition-colors"
              >
                Précédent
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
              >
                Finaliser l'inscription
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
