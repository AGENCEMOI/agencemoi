import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import StepIndicator from '@/components/ui/StepIndicator';
import { ArrowLeft, ArrowRight, Upload, Info, Check, MapPin } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const mockProfessionals = [
  { id: 1, name: 'Cuisines Modernes', specialty: 'Cuisine', rating: 4.8, postalCode: '75001', city: 'Paris', lat: 48.8566, lng: 2.3522, distance: 0 },
  { id: 2, name: 'Déco Intérieure', specialty: 'Aménagement', rating: 4.6, postalCode: '75002', city: 'Paris', lat: 48.8650, lng: 2.3428, distance: 0 },
  { id: 3, name: 'Salles de Bain Élégantes', specialty: 'Salle de bain', rating: 4.9, postalCode: '75003', city: 'Paris', lat: 48.8615, lng: 2.3588, distance: 0 },
  { id: 4, name: 'Concept Rangement', specialty: 'Dressing', rating: 4.7, postalCode: '75004', city: 'Paris', lat: 48.8543, lng: 2.3527, distance: 0 },
  { id: 5, name: 'Cuisines & Co', specialty: 'Cuisine', rating: 4.5, postalCode: '75005', city: 'Paris', lat: 48.8448, lng: 2.3495, distance: 0 },
  { id: 6, name: 'Habitat Design', specialty: 'Aménagement', rating: 4.8, postalCode: '75006', city: 'Paris', lat: 48.8495, lng: 2.3364, distance: 0 },
  { id: 7, name: 'L\'Atelier Cuisine', specialty: 'Cuisine', rating: 4.9, postalCode: '75007', city: 'Paris', lat: 48.8560, lng: 2.3265, distance: 0 },
  { id: 8, name: 'Bain & Déco', specialty: 'Salle de bain', rating: 4.6, postalCode: '75008', city: 'Paris', lat: 48.8729, lng: 2.3138, distance: 0 },
  { id: 9, name: 'Lyon Cuisines', specialty: 'Cuisine', rating: 4.7, postalCode: '69001', city: 'Lyon', lat: 45.7640, lng: 4.8357, distance: 0 },
  { id: 10, name: 'Espace Rangement', specialty: 'Dressing', rating: 4.8, postalCode: '69002', city: 'Lyon', lat: 45.7543, lng: 4.8316, distance: 0 },
  { id: 11, name: 'Meubles Sur Mesure', specialty: 'Aménagement', rating: 4.9, postalCode: '69003', city: 'Lyon', lat: 45.7563, lng: 4.8415, distance: 0 },
  { id: 12, name: 'Cuisines Élégance', specialty: 'Cuisine', rating: 4.5, postalCode: '69004', city: 'Lyon', lat: 45.7734, lng: 4.8282, distance: 0 },
  { id: 13, name: 'Marseille Déco', specialty: 'Aménagement', rating: 4.8, postalCode: '13001', city: 'Marseille', lat: 43.2965, lng: 5.3698, distance: 0 },
  { id: 14, name: 'Ambiance Bain', specialty: 'Salle de bain', rating: 4.6, postalCode: '13002', city: 'Marseille', lat: 43.3038, lng: 5.3651, distance: 0 },
  { id: 15, name: 'Concept Cuisine', specialty: 'Cuisine', rating: 4.7, postalCode: '13003', city: 'Marseille', lat: 43.3101, lng: 5.3724, distance: 0 },
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;
  return distance;
};

const postalCodeCoordinates = {
  '75': { lat: 48.8566, lng: 2.3522 },
  '69': { lat: 45.7640, lng: 4.8357 },
  '13': { lat: 43.2965, lng: 5.3698 },
  '33': { lat: 44.8378, lng: -0.5795 },
  '59': { lat: 50.6292, lng: 3.0573 },
  '67': { lat: 48.5734, lng: 7.7521 },
  '31': { lat: 43.6045, lng: 1.4442 },
  '44': { lat: 47.2184, lng: -1.5536 },
  '06': { lat: 43.7102, lng: 7.2620 },
  '63': { lat: 45.7772, lng: 3.0870 },
};

const MultiStepForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    city: '',
    projectType: '',
    buildingType: '',
    floor: '',
    workType: '',
    serviceType: '',
    surface: '',
    startDate: '',
    budget: '',
    furniture: {
      colors: '',
      handles: false
    },
    countertop: '',
    sink: '',
    faucet: '',
    appliances: '',
    layoutNeeds: '',
    floorPlan: null,
    photos: [],
    selectedProfessionals: []
  });

  const [localProfessionals, setLocalProfessionals] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [proximity, setProximity] = useState('both');

  useEffect(() => {
    if (formData.postalCode) {
      try {
        const departmentCode = formData.postalCode.substring(0, 2);
        let userCoords = postalCodeCoordinates[departmentCode];
        
        if (!userCoords) {
          userCoords = { lat: 48.8566, lng: 2.3522 };
        }
        
        const professionalsWithDistance = mockProfessionals.map(pro => {
          const distance = calculateDistance(
            userCoords.lat, 
            userCoords.lng, 
            pro.lat, 
            pro.lng
          );
          
          return { ...pro, distance: parseFloat(distance.toFixed(1)) };
        });
        
        let filtered = [];
        
        if (proximity === 'postcode' || proximity === 'both') {
          const samePostcodeItems = professionalsWithDistance.filter(pro => 
            pro.postalCode.startsWith(departmentCode)
          );
          filtered = [...filtered, ...samePostcodeItems];
        }
        
        if (proximity === 'radius' || proximity === 'both') {
          const radiusItems = professionalsWithDistance.filter(pro => 
            pro.distance <= 20 && 
            !filtered.some(item => item.id === pro.id)
          );
          filtered = [...filtered, ...radiusItems];
        }
        
        filtered.sort((a, b) => a.distance - b.distance);
        
        setLocalProfessionals(filtered.length > 0 ? filtered : mockProfessionals);
      } catch (error) {
        console.error("Error filtering professionals:", error);
        setLocalProfessionals(mockProfessionals);
      }
    }
  }, [formData.postalCode, proximity, currentStep]);

  useEffect(() => {
    setSelectedCount(formData.selectedProfessionals.length);
  }, [formData.selectedProfessionals]);

  const steps = [
    { title: 'Infos personnelles' },
    { title: 'Projet' },
    { title: 'Spécifications' },
    { title: 'Documents' },
    { title: 'Professionnels' },
    { title: 'Confirmation' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
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
      const selectedPhotos = Array.from(files).slice(0, 3);
      setFormData({
        ...formData,
        photos: selectedPhotos
      });
    }
  };

  const toggleProfessionalSelection = (professionalId) => {
    setFormData(prevData => {
      const isSelected = prevData.selectedProfessionals.includes(professionalId);
      let newSelection;

      if (isSelected) {
        newSelection = prevData.selectedProfessionals.filter(id => id !== professionalId);
      } else {
        if (prevData.selectedProfessionals.length < 5) {
          newSelection = [...prevData.selectedProfessionals, professionalId];
        } else {
          toast({
            title: "Maximum atteint",
            description: "Vous pouvez sélectionner jusqu'à 5 professionnels.",
            variant: "destructive"
          });
          return prevData;
        }
      }

      return {
        ...prevData,
        selectedProfessionals: newSelection
      };
    });
  };

  const handleProximityChange = (value) => {
    setProximity(value);
  };

  const nextStep = () => {
    if (currentStep === 4 && formData.selectedProfessionals.length < 3) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins 3 professionnels pour continuer.",
        variant: "destructive"
      });
      return;
    }

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
    
    toast({
      title: "Demande envoyée !",
      description: "Votre demande de devis a été envoyée avec succès. Vous recevrez une réponse sous 24h.",
    });
    
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

  const renderProfessionalsStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Choisissez vos professionnels</h3>
      
      <div className="mb-6 p-4 bg-agence-orange-50 border border-agence-orange-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="text-agence-orange-500 h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-medium text-agence-gray-800">Sélectionnez entre 3 et 5 professionnels</h4>
            <p className="text-sm text-agence-gray-600">
              Ces professionnels recevront votre demande de devis et vous contacteront avec leurs propositions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="proximityFilter" className="form-label">Filtrer par proximité</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleProximityChange('postcode')}
            className={`py-2 px-3 rounded-md border text-sm font-medium ${
              proximity === 'postcode' 
                ? 'bg-agence-orange-100 border-agence-orange-300 text-agence-orange-800' 
                : 'bg-white border-agence-gray-200 text-agence-gray-700 hover:bg-agence-gray-50'
            }`}
          >
            Même code postal
          </button>
          <button
            type="button"
            onClick={() => handleProximityChange('radius')}
            className={`py-2 px-3 rounded-md border text-sm font-medium ${
              proximity === 'radius' 
                ? 'bg-agence-orange-100 border-agence-orange-300 text-agence-orange-800' 
                : 'bg-white border-agence-gray-200 text-agence-gray-700 hover:bg-agence-gray-50'
            }`}
          >
            Rayon de 20km
          </button>
          <button
            type="button"
            onClick={() => handleProximityChange('both')}
            className={`py-2 px-3 rounded-md border text-sm font-medium ${
              proximity === 'both' 
                ? 'bg-agence-orange-100 border-agence-orange-300 text-agence-orange-800' 
                : 'bg-white border-agence-gray-200 text-agence-gray-700 hover:bg-agence-gray-50'
            }`}
          >
            Les deux
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-agence-gray-800">
          Professionnels dans votre secteur
        </h4>
        <div className="text-sm font-medium px-3 py-1 bg-agence-orange-100 text-agence-orange-800 rounded-full">
          {selectedCount}/5 sélectionnés
        </div>
      </div>
      
      <div className="space-y-4">
        {localProfessionals.length > 0 ? (
          localProfessionals.map(professional => {
            const isSelected = formData.selectedProfessionals.includes(professional.id);
            
            return (
              <div 
                key={professional.id}
                className={`p-4 border rounded-lg transition-all ${
                  isSelected 
                    ? 'border-agence-orange-500 bg-agence-orange-50' 
                    : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-agence-gray-800">{professional.name}</h5>
                    <div className="text-sm text-agence-gray-600 mt-1">
                      <span className="inline-block mr-4">{professional.specialty}</span>
                      <span className="inline-block mr-4">
                        <span className="inline-flex items-center">
                          <MapPin size={14} className="mr-1 text-agence-gray-500" />
                          {professional.city} ({professional.postalCode})
                        </span>
                      </span>
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {professional.rating}
                      </span>
                    </div>
                    {professional.distance > 0 && (
                      <div className="mt-1 inline-block px-2 py-1 bg-agence-gray-100 text-agence-gray-700 text-xs rounded-md">
                        {professional.distance} km
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleProfessionalSelection(professional.id)}
                    className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                      isSelected 
                        ? 'bg-agence-orange-500 border-agence-orange-500 text-white' 
                        : 'border-agence-gray-300 bg-white'
                    }`}
                    aria-label={isSelected ? "Désélectionner" : "Sélectionner"}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 border border-dashed border-agence-gray-300 rounded-lg">
            <p className="text-agence-gray-600">
              Aucun professionnel trouvé dans votre secteur. Veuillez vérifier votre code postal.
            </p>
          </div>
        )}
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
              Professionnels sélectionnés
            </h4>
            <div className="space-y-2">
              {formData.selectedProfessionals.length > 0 ? (
                <ul className="list-disc pl-5 text-sm">
                  {formData.selectedProfessionals.map(proId => {
                    const pro = localProfessionals.find(p => p.id === proId);
                    return pro ? (
                      <li key={pro.id} className="text-agence-gray-700">
                        {pro.name} - {pro.specialty}, {pro.city}
                      </li>
                    ) : null;
                  })}
                </ul>
              ) : (
                <p className="text-sm text-red-500">Aucun professionnel sélectionné</p>
              )}
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
        return renderProfessionalsStep();
      case 5:
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
