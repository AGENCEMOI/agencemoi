
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import StepIndicator from '@/components/ui/StepIndicator';
import { ArrowLeft, ArrowRight, Upload, Info } from 'lucide-react';

const MultiStepForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal information
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    city: '',
    
    // Project details
    projectType: '',
    buildingType: '',
    floor: '',
    workType: '',
    serviceType: '',
    surface: '',
    startDate: '',
    budget: '',
    
    // Specific requirements
    furniture: {
      colors: '',
      handles: false
    },
    countertop: '',
    sink: '',
    faucet: '',
    appliances: '',
    layoutNeeds: '',
    
    // Files
    floorPlan: null,
    photos: []
  });

  const steps = [
    { title: 'Infos personnelles' },
    { title: 'Projet' },
    { title: 'Spécifications' },
    { title: 'Documents' },
    { title: 'Confirmation' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects like furniture.colors
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (!files) return;

    if (fieldName === 'floorPlan') {
      setFormData({
        ...formData,
        floorPlan: files[0]
      });
    } else if (fieldName === 'photos') {
      // Limit to 3 photos
      const selectedPhotos = Array.from(files).slice(0, 3);
      setFormData({
        ...formData,
        photos: selectedPhotos
      });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Show success message
    toast({
      title: "Demande envoyée !",
      description: "Votre demande de devis a été envoyée avec succès. Vous recevrez une réponse sous 24h.",
    });
    
    // Reset form or redirect
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  const renderPersonalInfoStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Vos informations personnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="form-label">Prénom <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Votre prénom"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="form-label">Nom <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Votre nom"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="form-label">Téléphone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Votre numéro de téléphone"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Votre adresse email"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="address" className="form-label">Adresse d'installation <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Adresse où sera réalisée l'installation"
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
      </div>
    </div>
  );

  const renderProjectDetailsStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Détails de votre projet</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectType" className="form-label">Type de projet <span className="text-red-500">*</span></label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            required
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="kitchen">Cuisine</option>
            <option value="bathroom">Salle de bain</option>
            <option value="library">Bibliothèque</option>
            <option value="dressing">Dressing</option>
            <option value="other">Autre aménagement</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="buildingType" className="form-label">Type de bâtiment <span className="text-red-500">*</span></label>
          <select
            id="buildingType"
            name="buildingType"
            value={formData.buildingType}
            onChange={handleInputChange}
            required
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="house">Maison</option>
            <option value="apartment">Appartement</option>
            <option value="professional">Local professionnel</option>
          </select>
        </div>
        
        {formData.buildingType === 'apartment' && (
          <div>
            <label htmlFor="floor" className="form-label">Étage <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              required
              className="input-field w-full"
              placeholder="Étage"
              min="0"
            />
          </div>
        )}
        
        <div>
          <label htmlFor="workType" className="form-label">Type de travaux <span className="text-red-500">*</span></label>
          <select
            id="workType"
            name="workType"
            value={formData.workType}
            onChange={handleInputChange}
            required
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="install">Installation nouvelle</option>
            <option value="replace">Remplacement</option>
            <option value="renovation">Rénovation</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="serviceType" className="form-label">Type de prestation <span className="text-red-500">*</span></label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            required
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="full">Cuisine + électroménager + pose</option>
            <option value="noAppliances">Cuisine + pose (sans électroménager)</option>
            <option value="kitchenOnly">Cuisine seule (sans pose)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="surface" className="form-label">Surface en m² <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="surface"
            name="surface"
            value={formData.surface}
            onChange={handleInputChange}
            required
            className="input-field w-full"
            placeholder="Surface approximative"
            min="1"
          />
        </div>
        
        <div>
          <label htmlFor="startDate" className="form-label">Démarrage du projet <span className="text-red-500">*</span></label>
          <select
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="lessThan3">Moins de 3 mois</option>
            <option value="3to6">Entre 3 et 6 mois</option>
            <option value="moreThan6">Plus de 6 mois</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="budget" className="form-label">Budget estimé <span className="text-red-500">*</span></label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
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
      </div>
    </div>
  );

  const renderSpecificationsStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Spécifications techniques</h3>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="furniture.colors" className="form-label">Coloris de mobilier souhaité</label>
          <input
            type="text"
            id="furniture.colors"
            name="furniture.colors"
            value={formData.furniture.colors}
            onChange={handleInputChange}
            className="input-field w-full"
            placeholder="Ex: Blanc mat, Bois naturel, etc."
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="furniture.handles"
            name="furniture.handles"
            checked={formData.furniture.handles}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-agence-orange-500"
          />
          <label htmlFor="furniture.handles" className="form-label">Meubles avec poignées</label>
        </div>
        
        <div>
          <label htmlFor="countertop" className="form-label">Type de plan de travail</label>
          <select
            id="countertop"
            name="countertop"
            value={formData.countertop}
            onChange={handleInputChange}
            className="input-field w-full"
          >
            <option value="">Sélectionnez</option>
            <option value="laminate">Stratifié</option>
            <option value="compact">Compact</option>
            <option value="stone">Pierre</option>
            <option value="other">Autre</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="sink" className="form-label">Évier souhaité</label>
          <input
            type="text"
            id="sink"
            name="sink"
            value={formData.sink}
            onChange={handleInputChange}
            className="input-field w-full"
            placeholder="Type et matière de l'évier"
          />
        </div>
        
        <div>
          <label htmlFor="faucet" className="form-label">Mitigeur souhaité</label>
          <input
            type="text"
            id="faucet"
            name="faucet"
            value={formData.faucet}
            onChange={handleInputChange}
            className="input-field w-full"
            placeholder="Type et matière du mitigeur"
          />
        </div>
        
        <div>
          <label htmlFor="appliances" className="form-label">Électroménagers souhaités et marques préférentielles</label>
          <textarea
            id="appliances"
            name="appliances"
            value={formData.appliances}
            onChange={handleInputChange}
            className="input-field w-full resize-none"
            rows={4}
            placeholder="Listez les électroménagers souhaités et vos marques préférées"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="layoutNeeds" className="form-label">Besoins en agencement et ambiance recherchée</label>
          <textarea
            id="layoutNeeds"
            name="layoutNeeds"
            value={formData.layoutNeeds}
            onChange={handleInputChange}
            className="input-field w-full resize-none"
            rows={4}
            placeholder="Ex: Besoin de beaucoup de rangements, coin repas intégré, style contemporain..."
          ></textarea>
        </div>
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Documents & Photos</h3>
      
      <div className="space-y-8">
        <div className="border border-agence-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-agence-orange-100 text-agence-orange-500 rounded-full">
              <Upload size={24} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-agence-gray-800">Plan avec dimensions <span className="text-red-500">*</span></h4>
              <p className="text-agence-gray-600 text-sm mb-4">Téléchargez un plan avec les dimensions de votre pièce (PDF, JPG ou PNG)</p>
              
              <label className="btn-secondary inline-flex cursor-pointer">
                <input
                  type="file"
                  name="floorPlan"
                  onChange={(e) => handleFileChange(e, 'floorPlan')}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  required
                />
                <span>Sélectionner un fichier</span>
              </label>
              
              {formData.floorPlan && (
                <div className="mt-3 text-sm text-agence-gray-700 flex items-center space-x-2">
                  <span>✓</span>
                  <span>{(formData.floorPlan as File).name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border border-agence-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-agence-orange-100 text-agence-orange-500 rounded-full">
              <Upload size={24} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-agence-gray-800">Photos de la pièce <span className="text-agence-gray-500 font-normal">(optionnel)</span></h4>
              <p className="text-agence-gray-600 text-sm mb-4">Vous pouvez ajouter jusqu'à 3 photos de la pièce actuelle (JPG ou PNG)</p>
              
              <label className="btn-secondary inline-flex cursor-pointer">
                <input
                  type="file"
                  name="photos"
                  onChange={(e) => handleFileChange(e, 'photos')}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  multiple
                />
                <span>Sélectionner des photos</span>
              </label>
              
              {formData.photos && formData.photos.length > 0 && (
                <div className="mt-3 text-sm text-agence-gray-700">
                  <p className="mb-2">{formData.photos.length} photo(s) sélectionnée(s) :</p>
                  <ul className="space-y-1 list-disc pl-5">
                    {Array.from(formData.photos).map((photo, index) => (
                      <li key={index}>{(photo as File).name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-4 bg-agence-orange-50 border border-agence-orange-200 rounded-lg">
          <Info className="text-agence-orange-500 h-5 w-5 mt-0.5" />
          <p className="text-agence-gray-700 text-sm">
            Les photos et plans nous aident à mieux comprendre votre projet et à vous fournir des devis plus précis.
          </p>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Confirmation de votre demande</h3>
      
      <div className="bg-white border border-agence-gray-200 rounded-lg p-6 shadow-sm mb-8">
        <p className="text-agence-gray-700 mb-6">
          Veuillez vérifier les informations de votre demande de devis avant de soumettre.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b border-agence-gray-200 pb-2">
              Informations personnelles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-agence-gray-500">Nom complet:</span>
                <p className="font-medium text-agence-gray-800">{formData.firstName} {formData.lastName}</p>
              </div>
              <div>
                <span className="text-agence-gray-500">Téléphone:</span>
                <p className="font-medium text-agence-gray-800">{formData.phone}</p>
              </div>
              <div>
                <span className="text-agence-gray-500">Email:</span>
                <p className="font-medium text-agence-gray-800">{formData.email}</p>
              </div>
              <div>
                <span className="text-agence-gray-500">Adresse:</span>
                <p className="font-medium text-agence-gray-800">{formData.address}, {formData.postalCode} {formData.city}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b border-agence-gray-200 pb-2">
              Détails du projet
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-agence-gray-500">Type de projet:</span>
                <p className="font-medium text-agence-gray-800">
                  {formData.projectType === 'kitchen' && 'Cuisine'}
                  {formData.projectType === 'bathroom' && 'Salle de bain'}
                  {formData.projectType === 'library' && 'Bibliothèque'}
                  {formData.projectType === 'dressing' && 'Dressing'}
                  {formData.projectType === 'other' && 'Autre aménagement'}
                </p>
              </div>
              <div>
                <span className="text-agence-gray-500">Type de bâtiment:</span>
                <p className="font-medium text-agence-gray-800">
                  {formData.buildingType === 'house' && 'Maison'}
                  {formData.buildingType === 'apartment' && `Appartement ${formData.floor ? `(Étage ${formData.floor})` : ''}`}
                  {formData.buildingType === 'professional' && 'Local professionnel'}
                </p>
              </div>
              <div>
                <span className="text-agence-gray-500">Type de travaux:</span>
                <p className="font-medium text-agence-gray-800">
                  {formData.workType === 'install' && 'Installation nouvelle'}
                  {formData.workType === 'replace' && 'Remplacement'}
                  {formData.workType === 'renovation' && 'Rénovation'}
                </p>
              </div>
              <div>
                <span className="text-agence-gray-500">Type de prestation:</span>
                <p className="font-medium text-agence-gray-800">
                  {formData.serviceType === 'full' && 'Cuisine + électroménager + pose'}
                  {formData.serviceType === 'noAppliances' && 'Cuisine + pose (sans électroménager)'}
                  {formData.serviceType === 'kitchenOnly' && 'Cuisine seule (sans pose)'}
                </p>
              </div>
              <div>
                <span className="text-agence-gray-500">Surface:</span>
                <p className="font-medium text-agence-gray-800">{formData.surface} m²</p>
              </div>
              <div>
                <span className="text-agence-gray-500">Démarrage du projet:</span>
                <p className="font-medium text-agence-gray-800">
                  {formData.startDate === 'lessThan3' && 'Moins de 3 mois'}
                  {formData.startDate === '3to6' && 'Entre 3 et 6 mois'}
                  {formData.startDate === 'moreThan6' && 'Plus de 6 mois'}
                </p>
              </div>
              <div>
                <span className="text-agence-gray-500">Budget estimé:</span>
                <p className="font-medium text-agence-gray-800">
                  {formData.budget === 'less5k' && 'Moins de 5 000 €'}
                  {formData.budget === '5kTo10k' && '5 000 € à 10 000 €'}
                  {formData.budget === '10kTo15k' && '10 000 € à 15 000 €'}
                  {formData.budget === '15kTo20k' && '15 000 € à 20 000 €'}
                  {formData.budget === 'more20k' && 'Plus de 20 000 €'}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b border-agence-gray-200 pb-2">
              Documents joints
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-agence-gray-500">Plan avec dimensions:</span>
                <p className="font-medium text-agence-gray-800">
                  {formData.floorPlan ? (formData.floorPlan as File).name : 'Aucun fichier sélectionné'}
                </p>
              </div>
              <div>
                <span className="text-agence-gray-500">Photos (optionnel):</span>
                {formData.photos && formData.photos.length > 0 ? (
                  <p className="font-medium text-agence-gray-800">
                    {formData.photos.length} photo(s) sélectionnée(s)
                  </p>
                ) : (
                  <p className="font-medium text-agence-gray-800">Aucune photo sélectionnée</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-agence-gray-50 border border-agence-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              className="w-5 h-5 text-agence-orange-500"
              required
            />
            <label htmlFor="termsAccepted" className="text-sm text-agence-gray-700">
              J'accepte les <a href="/terms" className="text-agence-orange-500 hover:underline">conditions générales</a> et la <a href="/privacy" className="text-agence-orange-500 hover:underline">politique de confidentialité</a>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfoStep();
      case 1:
        return renderProjectDetailsStep();
      case 2:
        return renderSpecificationsStep();
      case 3:
        return renderDocumentsStep();
      case 4:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator currentStep={currentStep} steps={steps} />
      
      <form onSubmit={handleSubmit} className="bg-agence-gray-50 rounded-xl p-6 md:p-8 shadow-sm border border-agence-gray-200">
        {renderStep()}
        
        <div className="mt-8 flex justify-between">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center space-x-2 px-6 py-2 border border-agence-gray-300 rounded-full text-agence-gray-700 hover:bg-agence-gray-100 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Précédent</span>
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center space-x-2 btn-primary"
            >
              <span>Suivant</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center space-x-2 btn-primary"
            >
              <span>Soumettre ma demande</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
