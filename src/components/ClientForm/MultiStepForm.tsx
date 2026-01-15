import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import StepIndicator from '@/components/ui/StepIndicator';
import { ArrowLeft, ArrowRight, Upload, Info, Check, MapPin, Loader2, Link as LinkIcon, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: string;
  company_name: string;
  entity_type: string;
  city: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  selected_plan: string;
  distance?: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
    latitude: null as number | null,
    longitude: null as number | null,
    projectType: '',
    buildingType: '',
    floor: '',
    workType: '',
    serviceType: '',
    surface: '',
    startDate: '',
    budget: '',
    // Configuration cuisine
    kitchenLayout: '' as string,
    kitchenType: '' as string,
    // Matériaux & Finitions
    facadeFinish: [] as string[],
    countertopMaterial: [] as string[],
    // Électroménager
    appliances: [] as string[],
    plateType: '',
    applianceBrands: '',
    // Inspirations
    inspirationLinks: '',
    storeReferences: '',
    // Anciennes données
    furniture: {
      colors: '',
      handles: false
    },
    countertop: '',
    sink: '',
    faucet: '',
    layoutNeeds: '',
    floorPlan: null,
    photos: [],
    inspirationPhotos: [],
    selectedProfessionals: [] as string[]
  });

  const [localProfessionals, setLocalProfessionals] = useState<Professional[]>([]);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [proximity, setProximity] = useState('both');
  const [isLoadingPros, setIsLoadingPros] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);

  // Fetch professionals from database
  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoadingPros(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('id, company_name, entity_type, city, postal_code, latitude, longitude, selected_plan')
        .eq('status', 'approved');
      
      if (error) {
        console.error('Error fetching professionals:', error);
      } else if (data) {
        setAllProfessionals(data);
      }
      setIsLoadingPros(false);
    };

    fetchProfessionals();
  }, []);

  // Geocode client address
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

  // Filter professionals based on location
  useEffect(() => {
    if (formData.latitude && formData.longitude && allProfessionals.length > 0) {
      const professionalsWithDistance = allProfessionals
        .filter(pro => pro.latitude && pro.longitude)
        .map(pro => {
          const distance = calculateDistance(
            formData.latitude!,
            formData.longitude!,
            pro.latitude!,
            pro.longitude!
          );
          return { ...pro, distance: parseFloat(distance.toFixed(1)) };
        });

      let filtered: Professional[] = [];
      const departmentCode = formData.postalCode.substring(0, 2);

      if (proximity === 'postcode' || proximity === 'both') {
        const samePostcodeItems = professionalsWithDistance.filter(pro =>
          pro.postal_code.startsWith(departmentCode)
        );
        filtered = [...filtered, ...samePostcodeItems];
      }

      if (proximity === 'radius' || proximity === 'both') {
        const radiusItems = professionalsWithDistance.filter(pro =>
          (pro.distance || 0) <= 50 &&
          !filtered.some(item => item.id === pro.id)
        );
        filtered = [...filtered, ...radiusItems];
      }

      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setLocalProfessionals(filtered.length > 0 ? filtered : professionalsWithDistance.slice(0, 10));
    }
  }, [formData.latitude, formData.longitude, formData.postalCode, allProfessionals, proximity]);

  useEffect(() => {
    setSelectedCount(formData.selectedProfessionals.length);
  }, [formData.selectedProfessionals]);

  const steps = [
    { title: 'Infos personnelles' },
    { title: 'Projet' },
    { title: 'Configuration' },
    { title: 'Matériaux' },
    { title: 'Électroménager' },
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
          ...(formData[parent as keyof typeof formData] as object),
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
          ...(formData[parent as keyof typeof formData] as object),
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

  const handleMultiCheckbox = (field: 'facadeFinish' | 'countertopMaterial' | 'appliances', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
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
    } else if (fieldName === 'inspirationPhotos') {
      const selectedPhotos = Array.from(files).slice(0, 5);
      setFormData({
        ...formData,
        inspirationPhotos: selectedPhotos
      });
    }
  };

  const toggleProfessionalSelection = (professionalId: string) => {
    setFormData(prevData => {
      const isSelected = prevData.selectedProfessionals.includes(professionalId);
      let newSelection: string[];

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

  const handleProximityChange = (value: string) => {
    setProximity(value);
  };

  const nextStep = () => {
    if (currentStep === 6 && formData.selectedProfessionals.length < 3) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Build description with all kitchen details
      const description = [
        formData.layoutNeeds,
        formData.kitchenLayout && `Configuration: ${formData.kitchenLayout}`,
        formData.kitchenType && `Type: ${formData.kitchenType}`,
        formData.facadeFinish.length > 0 && `Façades: ${formData.facadeFinish.join(', ')}`,
        formData.countertopMaterial.length > 0 && `Plan de travail: ${formData.countertopMaterial.join(', ')}`,
        formData.appliances.length > 0 && `Électroménager: ${formData.appliances.join(', ')}`,
        formData.applianceBrands && `Marques souhaitées: ${formData.applianceBrands}`,
        formData.inspirationLinks && `Inspirations: ${formData.inspirationLinks}`,
        formData.storeReferences && `Références: ${formData.storeReferences}`,
      ].filter(Boolean).join('\n');

      const { data: leadData, error: leadError } = await supabase
        .from('client_leads')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
          project_type: formData.projectType,
          budget_range: formData.budget,
          timeline: formData.startDate,
          description: description || null,
        })
        .select()
        .single();

      if (leadError) {
        console.error('Error creating lead:', leadError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi de votre demande.",
          variant: "destructive"
        });
        return;
      }

      let professionalsToAssign = formData.selectedProfessionals;
      
      if (professionalsToAssign.length === 0 && localProfessionals.length > 0) {
        professionalsToAssign = localProfessionals.slice(0, 3).map(p => p.id);
      }

      if (professionalsToAssign.length > 0 && leadData) {
        const assignments = professionalsToAssign.map(proId => {
          const pro = localProfessionals.find(p => p.id === proId);
          return {
            lead_id: leadData.id,
            professional_id: proId,
            distance_km: pro?.distance || null,
          };
        });

        const { error: assignmentError } = await supabase
          .from('lead_assignments')
          .insert(assignments);

        if (assignmentError) {
          console.error('Error creating assignments:', assignmentError);
        }
      }

      toast({
        title: "Demande envoyée !",
        description: `Votre demande de devis a été transmise à ${professionalsToAssign.length} professionnel(s). Vous serez contacté sous 24h.`,
      });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
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

  const renderConfigurationStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Configuration de la cuisine</h3>
      
      <div className="space-y-8">
        {/* Layout */}
        <div>
          <label className="form-label mb-3 block">Configuration <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Linéaire', 'En L', 'En U', 'Avec îlot', 'En parallèle', 'En G'].map((layout) => (
              <button
                key={layout}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, kitchenLayout: layout }))}
                className={`p-4 border rounded-lg text-center transition-all ${
                  formData.kitchenLayout === layout
                    ? 'border-agence-orange-500 bg-agence-orange-50 text-agence-orange-700'
                    : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
                }`}
              >
                {layout}
              </button>
            ))}
          </div>
        </div>

        {/* Kitchen Type */}
        <div>
          <label className="form-label mb-3 block">Type de cuisine</label>
          <div className="grid grid-cols-2 gap-3">
            {['Cuisine ouverte', 'Cuisine fermée', 'Semi-ouverte'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, kitchenType: type }))}
                className={`p-4 border rounded-lg text-center transition-all ${
                  formData.kitchenType === type
                    ? 'border-agence-orange-500 bg-agence-orange-50 text-agence-orange-700'
                    : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Surface */}
        <div>
          <label htmlFor="surface" className="form-label">Surface estimée <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="number"
              id="surface"
              name="surface"
              value={formData.surface}
              onChange={handleInputChange}
              required
              className="input-field w-full pr-12"
              placeholder="Surface de la cuisine"
              min="1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-agence-gray-500">m²</span>
          </div>
        </div>

        {/* Additional needs */}
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

  const renderMaterialsStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Matériaux & Finitions</h3>
      
      <div className="space-y-8">
        {/* Facade Finish */}
        <div>
          <label className="form-label mb-3 block">Façades (plusieurs choix possibles)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Matte', 'Brillante', 'Bois (aspect)', 'Béton', 'Verre', 'Laquée', 'Stratifiée', 'Autre'].map((finish) => (
              <button
                key={finish}
                type="button"
                onClick={() => handleMultiCheckbox('facadeFinish', finish)}
                className={`p-3 border rounded-lg text-center transition-all flex items-center justify-center gap-2 ${
                  formData.facadeFinish.includes(finish)
                    ? 'border-agence-orange-500 bg-agence-orange-50 text-agence-orange-700'
                    : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
                }`}
              >
                {formData.facadeFinish.includes(finish) && <Check size={16} />}
                {finish}
              </button>
            ))}
          </div>
        </div>

        {/* Countertop Material */}
        <div>
          <label className="form-label mb-3 block">Plan de travail (plusieurs choix possibles)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Stratifié', 'Quartz', 'Granit', 'Céramique', 'Bois massif', 'Inox', 'Compact', 'Pierre naturelle'].map((material) => (
              <button
                key={material}
                type="button"
                onClick={() => handleMultiCheckbox('countertopMaterial', material)}
                className={`p-3 border rounded-lg text-center transition-all flex items-center justify-center gap-2 ${
                  formData.countertopMaterial.includes(material)
                    ? 'border-agence-orange-500 bg-agence-orange-50 text-agence-orange-700'
                    : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
                }`}
              >
                {formData.countertopMaterial.includes(material) && <Check size={16} />}
                {material}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label htmlFor="furniture.colors" className="form-label">Coloris de mobilier souhaité</label>
          <input
            type="text"
            id="furniture.colors"
            name="furniture.colors"
            value={formData.furniture.colors}
            onChange={handleInputChange}
            className="input-field w-full"
            placeholder="Ex: Blanc mat, Bois naturel, Gris anthracite..."
          />
        </div>

        {/* Handles */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="furniture.handles"
            name="furniture.handles"
            checked={formData.furniture.handles}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-agence-orange-500 rounded"
          />
          <label htmlFor="furniture.handles" className="form-label cursor-pointer">Meubles avec poignées (sinon système push-to-open)</label>
        </div>

        {/* Sink & Faucet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
    </div>
  );

  const renderAppliancesStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Électroménager</h3>
      
      <div className="space-y-8">
        {/* Appliances Selection */}
        <div>
          <label className="form-label mb-3 block">Équipements souhaités (plusieurs choix possibles)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Four', 'Plaque de cuisson', 'Hotte', 'Lave-vaisselle', 'Réfrigérateur', 'Micro-ondes', 'Four vapeur', 'Cave à vin', 'Machine à café encastrable'].map((appliance) => (
              <button
                key={appliance}
                type="button"
                onClick={() => handleMultiCheckbox('appliances', appliance)}
                className={`p-3 border rounded-lg text-center transition-all flex items-center justify-center gap-2 ${
                  formData.appliances.includes(appliance)
                    ? 'border-agence-orange-500 bg-agence-orange-50 text-agence-orange-700'
                    : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
                }`}
              >
                {formData.appliances.includes(appliance) && <Check size={16} />}
                {appliance}
              </button>
            ))}
          </div>
        </div>

        {/* Plate Type */}
        {formData.appliances.includes('Plaque de cuisson') && (
          <div>
            <label className="form-label mb-3 block">Type de plaque</label>
            <div className="grid grid-cols-3 gap-3">
              {['Induction', 'Gaz', 'Vitrocéramique', 'Mixte'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, plateType: type }))}
                  className={`p-3 border rounded-lg text-center transition-all ${
                    formData.plateType === type
                      ? 'border-agence-orange-500 bg-agence-orange-50 text-agence-orange-700'
                      : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        <div>
          <label htmlFor="applianceBrands" className="form-label">Marques souhaitées (si connues)</label>
          <input
            type="text"
            id="applianceBrands"
            name="applianceBrands"
            value={formData.applianceBrands}
            onChange={handleInputChange}
            className="input-field w-full"
            placeholder="Ex: Bosch, Siemens, Miele, Samsung..."
          />
        </div>
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Documents & Inspirations</h3>
      
      <div className="space-y-8">
        {/* Floor Plan */}
        <div className="border border-agence-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-agence-orange-100 text-agence-orange-500 rounded-full">
              <Upload size={24} />
            </div>
            <div className="flex-1">
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
        
        {/* Photos */}
        <div className="border border-agence-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-agence-orange-100 text-agence-orange-500 rounded-full">
              <Upload size={24} />
            </div>
            <div className="flex-1">
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

        {/* Inspiration Photos */}
        <div className="border border-agence-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-agence-orange-100 text-agence-orange-500 rounded-full">
              <Instagram size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-agence-gray-800">Photos d'inspiration <span className="text-agence-gray-500 font-normal">(optionnel)</span></h4>
              <p className="text-agence-gray-600 text-sm mb-4">Téléchargez jusqu'à 5 photos de cuisines qui vous inspirent</p>
              
              <label className="btn-secondary inline-flex cursor-pointer">
                <input
                  type="file"
                  name="inspirationPhotos"
                  onChange={(e) => handleFileChange(e, 'inspirationPhotos')}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  multiple
                />
                <span>Sélectionner des inspirations</span>
              </label>
              
              {formData.inspirationPhotos && formData.inspirationPhotos.length > 0 && (
                <div className="mt-3 text-sm text-agence-gray-700">
                  <p className="mb-2">{formData.inspirationPhotos.length} photo(s) d'inspiration :</p>
                  <ul className="space-y-1 list-disc pl-5">
                    {Array.from(formData.inspirationPhotos).map((photo, index) => (
                      <li key={index}>{(photo as File).name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inspiration Links */}
        <div>
          <label htmlFor="inspirationLinks" className="form-label flex items-center gap-2">
            <LinkIcon size={16} />
            Liens Pinterest / Instagram
          </label>
          <textarea
            id="inspirationLinks"
            name="inspirationLinks"
            value={formData.inspirationLinks}
            onChange={handleInputChange}
            className="input-field w-full resize-none"
            rows={3}
            placeholder="Collez vos liens vers des tableaux Pinterest ou posts Instagram qui vous inspirent..."
          ></textarea>
        </div>

        {/* Store References */}
        <div>
          <label htmlFor="storeReferences" className="form-label">Références vues en magasin</label>
          <textarea
            id="storeReferences"
            name="storeReferences"
            value={formData.storeReferences}
            onChange={handleInputChange}
            className="input-field w-full resize-none"
            rows={3}
            placeholder="Ex: Modèle METOD chez IKEA, Cuisine KONTIKA chez But..."
          ></textarea>
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
            Même département
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
            Rayon de 50km
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
        {isLoadingPros ? (
          <div className="text-center p-8 border border-dashed border-agence-gray-300 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-agence-orange-500 mb-2" />
            <p className="text-agence-gray-600">Chargement des professionnels...</p>
          </div>
        ) : localProfessionals.length > 0 ? (
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
                    <h5 className="font-semibold text-agence-gray-800">{professional.company_name}</h5>
                    <div className="text-sm text-agence-gray-600 mt-1">
                      <span className="inline-block mr-4 capitalize">{professional.entity_type}</span>
                      <span className="inline-block mr-4">
                        <span className="inline-flex items-center">
                          <MapPin size={14} className="mr-1 text-agence-gray-500" />
                          {professional.city} ({professional.postal_code})
                        </span>
                      </span>
                      {professional.selected_plan === 'premium' && (
                        <span className="inline-flex items-center bg-agence-orange-100 text-agence-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                    {(professional.distance ?? 0) > 0 && (
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
            <p className="text-agence-gray-600 mb-2">
              {allProfessionals.length === 0 
                ? "Aucun professionnel n'est encore inscrit sur la plateforme."
                : "Aucun professionnel trouvé dans votre secteur."}
            </p>
            <p className="text-sm text-agence-gray-500">
              Votre demande sera automatiquement transmise aux professionnels les plus proches.
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
              Configuration cuisine
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-agence-gray-500">Configuration:</span>
                <p className="font-medium text-agence-gray-800">{formData.kitchenLayout || '-'}</p>
              </div>
              <div>
                <span className="text-agence-gray-500">Type:</span>
                <p className="font-medium text-agence-gray-800">{formData.kitchenType || '-'}</p>
              </div>
              <div>
                <span className="text-agence-gray-500">Surface:</span>
                <p className="font-medium text-agence-gray-800">{formData.surface} m²</p>
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
              Matériaux & Équipements
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-agence-gray-500">Façades:</span>
                <p className="font-medium text-agence-gray-800">{formData.facadeFinish.join(', ') || '-'}</p>
              </div>
              <div>
                <span className="text-agence-gray-500">Plan de travail:</span>
                <p className="font-medium text-agence-gray-800">{formData.countertopMaterial.join(', ') || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-agence-gray-500">Électroménager:</span>
                <p className="font-medium text-agence-gray-800">{formData.appliances.join(', ') || '-'}</p>
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
                        {pro.company_name} - {pro.entity_type}, {pro.city}
                      </li>
                    ) : null;
                  })}
                </ul>
              ) : (
                <p className="text-sm text-agence-gray-500">Attribution automatique aux professionnels les plus proches</p>
              )}
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
        return renderConfigurationStep();
      case 3:
        return renderMaterialsStep();
      case 4:
        return renderAppliancesStep();
      case 5:
        return renderDocumentsStep();
      case 6:
        return renderProfessionalsStep();
      case 7:
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <span>Soumettre ma demande</span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
