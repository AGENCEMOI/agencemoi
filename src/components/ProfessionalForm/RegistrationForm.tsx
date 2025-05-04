
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Check, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define TypeScript interfaces to fix type issues
interface FormData {
  companyName: string;
  siret: string;
  address: string;
  postalCode: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  origin: string;
  averagePrice: string;
  entityType: string;
  currentPromotions: string;
  paymentMethod: string;
  bankName: string;
  bankIban: string;
  bankPaymentDate: string;
  termsAccepted: boolean;
  sepaMandate: boolean;
}

interface FormErrors {
  companyName?: string | null;
  siret?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  contactName?: string | null;
  origin?: string | null;
  entityType?: string | null;
  bankName?: string | null;
  bankIban?: string | null;
  sepaMandate?: string | null;
  termsAccepted?: string | null;
  [key: string]: string | null | undefined;
}

const RegistrationForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    siret: '',
    address: '',
    postalCode: '',
    city: '',
    contactName: '',
    contactPhone: '0661461681', // Default phone number
    contactEmail: '123.agencemoi@gmail.com', // Default email
    website: '',
    origin: '',
    averagePrice: '',
    entityType: '',
    currentPromotions: '',
    paymentMethod: 'bank', // Default to bank (SEPA) only
    bankName: '',
    bankIban: '',
    bankPaymentDate: '5', // Default to 5th of month
    termsAccepted: false,
    sepaMandate: false, // New field for SEPA mandate
  });
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for changed field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
    
    // Clear error for changed field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateStep = (stepNumber: number) => {
    const errors: FormErrors = {};
    
    // Validate step 1 - Business info
    if (stepNumber === 1) {
      if (!formData.companyName.trim()) errors.companyName = "Nom de l'entreprise requis";
      if (!formData.siret.trim()) errors.siret = "Numéro SIRET requis";
      if (!formData.address.trim()) errors.address = "Adresse requise";
      if (!formData.postalCode.trim()) errors.postalCode = "Code postal requis";
      if (!formData.city.trim()) errors.city = "Ville requise";
      if (!formData.contactName.trim()) errors.contactName = "Personne à contacter requise";
    }
    
    // Validate step 2 - Products info
    else if (stepNumber === 2) {
      if (!formData.origin) errors.origin = "Origine de fabrication requise";
      if (!formData.entityType) errors.entityType = "Type d'entité requis";
    }
    
    // Validate step 3 - Payment info
    else if (stepNumber === 3) {
      if (!formData.bankName.trim()) errors.bankName = "Nom de la banque requis";
      if (!formData.bankIban.trim()) errors.bankIban = "IBAN requis";
      if (!formData.sepaMandate) errors.sepaMandate = "Mandat SEPA requis";
      if (!formData.termsAccepted) errors.termsAccepted = "Vous devez accepter les conditions générales";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires pour continuer.",
        variant: "destructive"
      });
      return;
    }
    
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
    
    if (!validateStep(step)) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires pour continuer.",
        variant: "destructive"
      });
      return;
    }
    
    // Add email destination
    const recipientEmail = '123.agencemoi@gmail.com';
    console.log('Professional form submitted:', formData);
    console.log(`Form data will be sent to: ${recipientEmail}`);
    
    // In a real implementation, you would send the form data to the email
    // For now, we'll simulate it with a toast notification
    
    setSubmitted(true);
    
    toast({
      title: "Inscription réussie !",
      description: `Votre demande d'inscription a été envoyée à ${recipientEmail}. Nous vous contacterons prochainement pour finaliser votre partenariat.`,
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
            className={`input-field w-full ${formErrors.companyName ? 'border-red-500' : ''}`}
            placeholder="Raison sociale"
          />
          {formErrors.companyName && <p className="text-red-500 text-sm mt-1">{formErrors.companyName}</p>}
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
            className={`input-field w-full ${formErrors.siret ? 'border-red-500' : ''}`}
            placeholder="14 chiffres"
          />
          {formErrors.siret && <p className="text-red-500 text-sm mt-1">{formErrors.siret}</p>}
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
            className={`input-field w-full ${formErrors.address ? 'border-red-500' : ''}`}
            placeholder="Adresse de l'entreprise"
          />
          {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
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
            className={`input-field w-full ${formErrors.postalCode ? 'border-red-500' : ''}`}
            placeholder="Code postal"
          />
          {formErrors.postalCode && <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>}
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
            className={`input-field w-full ${formErrors.city ? 'border-red-500' : ''}`}
            placeholder="Ville"
          />
          {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
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
            className={`input-field w-full ${formErrors.contactName ? 'border-red-500' : ''}`}
            placeholder="Nom et prénom"
          />
          {formErrors.contactName && <p className="text-red-500 text-sm mt-1">{formErrors.contactName}</p>}
        </div>
        
        <div>
          <label htmlFor="contactPhone" className="form-label">Téléphone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            readOnly
            className="input-field w-full bg-gray-100"
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
            readOnly
            className="input-field w-full bg-gray-100"
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
            className={`input-field w-full ${formErrors.origin ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionnez</option>
            <option value="france">Française</option>
            <option value="germany">Allemande</option>
            <option value="sweden">Suédoise</option>
            <option value="italy">Italienne</option>
            <option value="other">Autre</option>
          </select>
          {formErrors.origin && <p className="text-red-500 text-sm mt-1">{formErrors.origin}</p>}
        </div>
        
        <div>
          <label htmlFor="averagePrice" className="form-label">Budget moyen des paniers <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="averagePrice"
            name="averagePrice"
            value={formData.averagePrice}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Indiquez le budget moyen de vos paniers"
          />
        </div>
        
        <div>
          <label htmlFor="entityType" className="form-label">Type d'entité <span className="text-red-500">*</span></label>
          <select
            id="entityType"
            name="entityType"
            value={formData.entityType}
            onChange={handleInputChange}
            required
            className={`input-field w-full ${formErrors.entityType ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionnez</option>
            <option value="brand">Enseigne</option>
            <option value="independent">Indépendant</option>
            <option value="factory">Magasin d'usine</option>
            <option value="other">Autre</option>
          </select>
          {formErrors.entityType && <p className="text-red-500 text-sm mt-1">{formErrors.entityType}</p>}
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
        <h4 className="text-lg font-semibold text-agence-gray-800 mb-4">Prélèvement bancaire SEPA</h4>
        
        <div className="animate-fade-in space-y-4 p-5 border border-agence-gray-200 rounded-lg">
          <div>
            <label htmlFor="bankName" className="form-label">Nom de la banque <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              required
              className={`input-field w-full ${formErrors.bankName ? 'border-red-500' : ''}`}
              placeholder="Nom de votre banque"
            />
            {formErrors.bankName && <p className="text-red-500 text-sm mt-1">{formErrors.bankName}</p>}
          </div>
          
          <div>
            <label htmlFor="bankIban" className="form-label">IBAN <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="bankIban"
              name="bankIban"
              value={formData.bankIban}
              onChange={handleInputChange}
              required
              className={`input-field w-full ${formErrors.bankIban ? 'border-red-500' : ''}`}
              placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
            />
            {formErrors.bankIban && <p className="text-red-500 text-sm mt-1">{formErrors.bankIban}</p>}
          </div>
          
          <div>
            <label htmlFor="bankPaymentDate" className="form-label">Date de prélèvement mensuel <span className="text-red-500">*</span></label>
            <Select
              name="bankPaymentDate"
              value={formData.bankPaymentDate}
              onValueChange={(value) => 
                setFormData({
                  ...formData,
                  bankPaymentDate: value
                })
              }
            >
              <SelectTrigger className="w-full input-field">
                <SelectValue placeholder="Choisir une date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Le 5 du mois</SelectItem>
                <SelectItem value="15">Le 15 du mois</SelectItem>
                <SelectItem value="30">Le 30 du mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 p-4 bg-agence-orange-50 border border-agence-orange-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="sepaMandate"
                name="sepaMandate"
                checked={formData.sepaMandate}
                onChange={handleCheckboxChange}
                required
                className={`w-5 h-5 text-agence-orange-500 mt-1 ${formErrors.sepaMandate ? 'border-red-500' : ''}`}
              />
              <div>
                <label htmlFor="sepaMandate" className="text-agence-gray-800 font-medium">
                  Mandat de prélèvement SEPA <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-agence-gray-600 mt-1">
                  En cochant cette case, j'autorise AGENCEMOI à envoyer des instructions à ma banque pour débiter mon compte, 
                  et ma banque à débiter mon compte conformément aux instructions d'AGENCEMOI. Je bénéficie d'un droit à remboursement 
                  par ma banque selon les conditions décrites dans la convention que j'ai passée avec elle.
                </p>
                {formErrors.sepaMandate && <p className="text-red-500 text-sm mt-1">{formErrors.sepaMandate}</p>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              required
              className={`w-5 h-5 text-agence-orange-500 mt-1 ${formErrors.termsAccepted ? 'border-red-500' : ''}`}
            />
            <label htmlFor="termsAccepted" className="text-agence-gray-700">
              J'accepte les <a href="/terms" className="text-agence-orange-500 hover:underline">conditions générales</a>, 
              la <a href="/privacy" className="text-agence-orange-500 hover:underline">politique de confidentialité</a> et 
              j'autorise AGENCEMOI à prélever les frais de mise en relation selon les conditions décrites ci-dessus.
            </label>
          </div>
          {formErrors.termsAccepted && <p className="text-red-500 text-sm mt-1 ml-8">{formErrors.termsAccepted}</p>}
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
            onClick={() => step >= 1 && setStep(1)}
            disabled={step < 1}
          >
            1. Entreprise
          </button>
          <button
            className={`flex-1 text-center py-4 px-2 font-medium ${
              step === 2 ? 'text-agence-orange-500 border-b-2 border-agence-orange-500' : 'text-agence-gray-500'
            }`}
            onClick={() => step >= 2 && setStep(2)}
            disabled={step < 2}
          >
            2. Produits
          </button>
          <button
            className={`flex-1 text-center py-4 px-2 font-medium ${
              step === 3 ? 'text-agence-orange-500 border-b-2 border-agence-orange-500' : 'text-agence-gray-500'
            }`}
            onClick={() => step >= 3 && setStep(3)}
            disabled={step < 3}
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
