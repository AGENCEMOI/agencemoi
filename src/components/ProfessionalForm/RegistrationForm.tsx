
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Check, Info, Zap, Crown, Star, MapPin, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Define TypeScript interfaces to fix type issues
interface FormData {
  selectedPlan: 'carte' | 'premium' | '';
  companyName: string;
  siret: string;
  address: string;
  postalCode: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
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
  selectedPlan?: string | null;
  companyName?: string | null;
  siret?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
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
  const [step, setStep] = useState(0); // Start at step 0 (plan selection)
  const [formData, setFormData] = useState<FormData>({
    selectedPlan: '',
    companyName: '',
    siret: '',
    address: '',
    postalCode: '',
    city: '',
    latitude: null,
    longitude: null,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
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
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Geolocation based on postal code
  useEffect(() => {
    const geocodeAddress = async () => {
      if (formData.postalCode.length === 5 && formData.city) {
        setIsGeolocating(true);
        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(formData.postalCode + ' ' + formData.city)}&limit=1`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            setFormData(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng
            }));
            toast({
              title: "Géolocalisation réussie",
              description: `Votre entreprise sera visible dans la zone de ${formData.city}`,
            });
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        } finally {
          setIsGeolocating(false);
        }
      }
    };

    const debounce = setTimeout(geocodeAddress, 500);
    return () => clearTimeout(debounce);
  }, [formData.postalCode, formData.city]);

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
    
    // Validate step 0 - Plan selection
    if (stepNumber === 0) {
      if (!formData.selectedPlan) errors.selectedPlan = "Veuillez choisir une formule";
    }
    
    // Validate step 1 - Business info
    else if (stepNumber === 1) {
      if (!formData.companyName.trim()) errors.companyName = "Nom de l'entreprise requis";
      if (!formData.siret.trim()) errors.siret = "Numéro SIRET requis";
      if (!formData.address.trim()) errors.address = "Adresse requise";
      if (!formData.postalCode.trim()) errors.postalCode = "Code postal requis";
      if (!formData.city.trim()) errors.city = "Ville requise";
      if (!formData.contactName.trim()) errors.contactName = "Personne à contacter requise";
      if (!formData.contactPhone.trim()) errors.contactPhone = "Téléphone requis";
      if (!formData.contactEmail.trim()) errors.contactEmail = "Email requis";
    }
    
    // Validate step 2 - Activity info
    else if (stepNumber === 2) {
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
        description: step === 0 ? "Veuillez choisir une formule pour continuer." : "Veuillez remplir tous les champs obligatoires pour continuer.",
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
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const selectPlan = (plan: 'carte' | 'premium') => {
    setFormData(prev => ({ ...prev, selectedPlan: plan }));
    setFormErrors(prev => ({ ...prev, selectedPlan: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires pour continuer.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('professionals')
        .insert({
          selected_plan: formData.selectedPlan,
          company_name: formData.companyName,
          siret: formData.siret,
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          website: formData.website || null,
          entity_type: formData.entityType,
          current_promotions: formData.currentPromotions || null,
          bank_name: formData.bankName,
          bank_iban: formData.bankIban,
          bank_payment_date: formData.bankPaymentDate,
          terms_accepted: formData.termsAccepted,
          sepa_mandate: formData.sepaMandate,
        });

      if (error) {
        console.error('Error saving professional:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
          variant: "destructive"
        });
        return;
      }

      setSubmitted(true);
      
      toast({
        title: "Inscription réussie !",
        description: "Votre demande d'inscription a été enregistrée. Nous vous contacterons prochainement.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormStep0 = () => (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2 text-agence-gray-800">
          Choisissez votre formule
        </h3>
        <p className="text-agence-gray-600">
          Sélectionnez la formule qui correspond le mieux à vos besoins pour commencer votre inscription
        </p>
      </div>

      {formErrors.selectedPlan && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {formErrors.selectedPlan}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option à la carte */}
        <div 
          onClick={() => selectPlan('carte')}
          className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
            formData.selectedPlan === 'carte' 
              ? 'border-agence-orange-500 bg-agence-orange-50 shadow-lg' 
              : 'border-agence-gray-200 bg-white hover:border-agence-orange-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${formData.selectedPlan === 'carte' ? 'bg-agence-orange-500' : 'bg-agence-gray-100'}`}>
                <Zap className={`h-5 w-5 ${formData.selectedPlan === 'carte' ? 'text-white' : 'text-agence-gray-500'}`} />
              </div>
              <h4 className="text-lg font-semibold text-agence-gray-800">À la carte</h4>
            </div>
            {formData.selectedPlan === 'carte' && (
              <div className="bg-agence-orange-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-agence-gray-800">10€</span>
            <span className="text-agence-gray-500 ml-2">/ mise en relation</span>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-agence-orange-500" />
              <span className="text-agence-gray-600">Paiement par lead</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-agence-orange-500" />
              <span className="text-agence-gray-600">Sans engagement</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-agence-orange-500" />
              <span className="text-agence-gray-600">Leads qualifiés</span>
            </li>
          </ul>
        </div>

        {/* Option Premium */}
        <div 
          onClick={() => selectPlan('premium')}
          className={`cursor-pointer rounded-xl p-6 border-2 relative transition-all duration-300 ${
            formData.selectedPlan === 'premium' 
              ? 'border-agence-orange-500 bg-gradient-to-br from-agence-orange-50 to-agence-orange-100 shadow-lg' 
              : 'border-agence-gray-200 bg-white hover:border-agence-orange-300 hover:shadow-md'
          }`}
        >
          <div className="absolute top-3 right-3">
            <span className="bg-agence-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>RECOMMANDÉ</span>
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${formData.selectedPlan === 'premium' ? 'bg-agence-orange-500' : 'bg-agence-gray-100'}`}>
                <Crown className={`h-5 w-5 ${formData.selectedPlan === 'premium' ? 'text-white' : 'text-agence-gray-500'}`} />
              </div>
              <h4 className="text-lg font-semibold text-agence-gray-800">Premium Pro</h4>
            </div>
            {formData.selectedPlan === 'premium' && (
              <div className="bg-agence-orange-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-agence-gray-800">100€</span>
            <span className="text-agence-gray-500 ml-2">/ mois</span>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-agence-orange-500" />
              <span className="text-agence-gray-600 font-medium">Leads illimités</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-agence-orange-500" />
              <span className="text-agence-gray-600 font-medium">Visibilité prioritaire</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-agence-orange-500" />
              <span className="text-agence-gray-600 font-medium">Badge Premium</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-agence-orange-500" />
              <span className="text-agence-gray-600 font-medium">Support prioritaire</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-agence-gray-50 rounded-lg border border-agence-gray-200">
        <div className="flex">
          <Info className="h-5 w-5 text-agence-orange-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-agence-gray-800 mb-1">Géolocalisation automatique</h4>
            <p className="text-sm text-agence-gray-600">
              Votre entreprise sera automatiquement géolocalisée lors de l'inscription pour apparaître aux clients de votre zone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );


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
            onChange={handleInputChange}
            required
            className={`input-field w-full ${formErrors.contactPhone ? 'border-red-500' : ''}`}
            placeholder="Numéro de téléphone"
          />
          {formErrors.contactPhone && <p className="text-red-500 text-sm mt-1">{formErrors.contactPhone}</p>}
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
            className={`input-field w-full ${formErrors.contactEmail ? 'border-red-500' : ''}`}
            placeholder="Adresse email"
          />
          {formErrors.contactEmail && <p className="text-red-500 text-sm mt-1">{formErrors.contactEmail}</p>}
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
      <h3 className="text-2xl font-semibold mb-8 text-agence-gray-800">Informations sur votre activité</h3>
      
      <div className="grid grid-cols-1 gap-6">
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
    <div className="animate-scale-in">
      <div className="text-center py-8 mb-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-agence-gray-800 mb-4">Inscription réussie !</h2>
        <p className="text-agence-gray-600 max-w-md mx-auto mb-6">
          Votre demande d'inscription a été envoyée avec succès. Nous vous contacterons prochainement pour finaliser votre partenariat.
        </p>
        
        {/* Selected Plan Summary */}
        <div className="inline-flex items-center space-x-3 bg-agence-orange-100 text-agence-orange-700 px-6 py-3 rounded-full">
          {formData.selectedPlan === 'premium' ? (
            <Crown className="h-5 w-5" />
          ) : (
            <Zap className="h-5 w-5" />
          )}
          <span className="font-bold text-lg">
            {formData.selectedPlan === 'carte' ? 'Formule À la carte - 10€/lead' : 'Formule Premium Pro - 100€/mois'}
          </span>
        </div>

        {formData.latitude && formData.longitude && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <MapPin className="h-4 w-4" />
            <span>Votre entreprise sera visible dans la zone de {formData.city}</span>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link to="/" className="btn-primary inline-block">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    if (submitted) {
      return renderSuccessMessage();
    }
    
    switch (step) {
      case 0:
        return renderFormStep0();
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
      {!submitted && step > 0 && (
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
            2. Activité
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

      {!submitted && step === 0 && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-agence-orange-100 text-agence-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            <span>Formule choisie :</span>
            <span className="font-bold">
              {formData.selectedPlan === 'carte' && 'À la carte (10€/lead)'}
              {formData.selectedPlan === 'premium' && 'Premium Pro (100€/mois)'}
              {!formData.selectedPlan && 'Aucune'}
            </span>
          </div>
        </div>
      )}

      {!submitted && step > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 bg-agence-orange-100 text-agence-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            <span>Formule :</span>
            <span className="font-bold">
              {formData.selectedPlan === 'carte' ? 'À la carte (10€/lead)' : 'Premium Pro (100€/mois)'}
            </span>
          </div>
          {formData.latitude && formData.longitude && (
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <MapPin className="h-4 w-4" />
              <span>Géolocalisé</span>
            </div>
          )}
          {isGeolocating && (
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <div className="animate-spin h-4 w-4 border-2 border-blue-700 border-t-transparent rounded-full"></div>
              <span>Géolocalisation...</span>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={`bg-white rounded-xl p-6 md:p-8 shadow-sm border border-agence-gray-200 ${submitted ? 'bg-agence-gray-50' : ''}`}>
        {renderCurrentStep()}
        
        {!submitted && (
          <div className="mt-8 flex justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-agence-gray-300 rounded-full text-agence-gray-700 hover:bg-agence-gray-100 transition-colors"
              >
                {step === 1 ? 'Changer de formule' : 'Précédent'}
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
                {step === 0 ? 'Commencer l\'inscription' : 'Suivant'}
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Inscription en cours...</span>
                  </>
                ) : (
                  <span>Finaliser l'inscription</span>
                )}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
