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
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Reusable UI helpers
const ToggleButton = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-3 border rounded-lg text-center transition-all flex items-center justify-center gap-2 text-sm ${
      selected
        ? 'border-agence-orange-500 bg-agence-orange-50 text-agence-orange-700 font-medium'
        : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
    }`}
  >
    {selected && <Check size={14} />}
    {label}
  </button>
);

const RadioOption = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-3 border rounded-lg text-center transition-all text-sm ${
      selected
        ? 'border-agence-orange-500 bg-agence-orange-50 text-agence-orange-700 font-medium'
        : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'
    }`}
  >
    {label}
  </button>
);

const SectionTitle = ({ icon, title }: { icon: string; title: string }) => (
  <h4 className="text-lg font-semibold text-agence-gray-800 mt-8 mb-4 flex items-center gap-2">
    <span>{icon}</span> {title}
  </h4>
);

// Appliance component with "Je conserve" / "À prévoir" toggle + sub-options
const ApplianceField = ({
  label,
  keepValue,
  onKeepChange,
  subOptions,
  selectedSubs,
  onSubChange,
}: {
  label: string;
  keepValue: 'keep' | 'new' | '';
  onKeepChange: (v: 'keep' | 'new') => void;
  subOptions?: string[];
  selectedSubs?: string[];
  onSubChange?: (v: string) => void;
}) => (
  <div className="border border-agence-gray-200 rounded-lg p-4 bg-white">
    <p className="font-medium text-agence-gray-800 mb-3">{label}</p>
    <div className="grid grid-cols-2 gap-2 mb-2">
      <RadioOption label="🔄 Je conserve le mien" selected={keepValue === 'keep'} onClick={() => onKeepChange('keep')} />
      <RadioOption label="🆕 À prévoir" selected={keepValue === 'new'} onClick={() => onKeepChange('new')} />
    </div>
    {keepValue === 'new' && subOptions && subOptions.length > 0 && (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
        {subOptions.map(opt => (
          <ToggleButton
            key={opt}
            label={opt}
            selected={selectedSubs?.includes(opt) || false}
            onClick={() => onSubChange?.(opt)}
          />
        ))}
      </div>
    )}
  </div>
);

const MultiStepForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  // ---- Form State ----
  const [formData, setFormData] = useState({
    // Step 1: Personal info
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null,

    // Step 2: Housing
    housingType: '' as 'maison' | 'appartement' | '',
    floor: '',
    hasElevator: '' as 'oui' | 'non' | '',
    buildingOver2Years: '' as 'oui' | 'non' | '',

    // Step 3: Projects
    projects: [] as string[],

    // ---- CUISINE ----
    kitchenInstallType: [] as string[],
    kitchenMealSolution: [] as string[],
    kitchenPersons: '',
    kitchenCountertop: [] as string[],
    // Sanitaire
    kitchenSinkCuves: [] as string[],
    kitchenSinkMaterial: [] as string[],
    kitchenMitigeur: '' as string,
    // Electromenager
    ovenKeep: '' as 'keep' | 'new' | '',
    ovenSubs: [] as string[],
    hobKeep: '' as 'keep' | 'new' | '',
    hobSubs: [] as string[],
    hobFoyers: [] as string[],
    hoodKeep: '' as 'keep' | 'new' | '',
    hoodSubs: [] as string[],
    hoodType: [] as string[],
    dishwasherKeep: '' as 'keep' | 'new' | '',
    dishwasherSubs: [] as string[],
    fridgeKeep: '' as 'keep' | 'new' | '',
    fridgeSubs: [] as string[],
    microwaveKeep: '' as 'keep' | 'new' | '',
    microwaveSubs: [] as string[],
    coffeeMachineKeep: '' as 'keep' | 'new' | '',
    wineCellarKeep: '' as 'keep' | 'new' | '',
    wineCellarSubs: [] as string[],
    // Prestations
    kitchenPrestations: [] as string[],
    kitchenBudget: '',

    // ---- SALLE DE BAIN ----
    bathroomVasque: '' as string,
    bathroomColonne: false,
    bathroomMiroir: '' as string,
    bathroomAutre: '',
    bathroomBudget: '',

    // ---- DRESSING ----
    dressingRoom: '' as string,
    dressingStructure: '' as string,
    dressingOpening: '' as string,
    dressingBudget: '',

    // Documents
    floorPlan: null as File | null,
    photos: [] as File[],
    inspirationPhotos: [] as File[],
    inspirationLinks: '',
    storeReferences: '',

    // Professionals
    selectedProfessionals: [] as string[],
  });

  const [localProfessionals, setLocalProfessionals] = useState<Professional[]>([]);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [proximity, setProximity] = useState('both');
  const [isLoadingPros, setIsLoadingPros] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);

  // Fetch professionals
  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoadingPros(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('id, company_name, entity_type, city, postal_code, latitude, longitude, selected_plan')
        .eq('status', 'approved');
      if (!error && data) setAllProfessionals(data);
      setIsLoadingPros(false);
    };
    fetchProfessionals();
  }, []);

  // Geocode
  useEffect(() => {
    const geocodeAddress = async () => {
      if (formData.postalCode.length === 5 && formData.city) {
        setIsGeolocating(true);
        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(formData.postalCode + ' ' + formData.city)}&limit=1`
          );
          const data = await response.json();
          if (data.features?.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
          }
        } catch (error) { console.error('Geocoding error:', error); }
        finally { setIsGeolocating(false); }
      }
    };
    const debounce = setTimeout(geocodeAddress, 500);
    return () => clearTimeout(debounce);
  }, [formData.postalCode, formData.city]);

  // Filter pros by location
  useEffect(() => {
    if (formData.latitude && formData.longitude && allProfessionals.length > 0) {
      const withDist = allProfessionals
        .filter(p => p.latitude && p.longitude)
        .map(p => ({
          ...p,
          distance: parseFloat(calculateDistance(formData.latitude!, formData.longitude!, p.latitude!, p.longitude!).toFixed(1))
        }));

      const dept = formData.postalCode.substring(0, 2);
      let filtered: Professional[] = [];
      if (proximity === 'postcode' || proximity === 'both') {
        filtered.push(...withDist.filter(p => p.postal_code.startsWith(dept)));
      }
      if (proximity === 'radius' || proximity === 'both') {
        filtered.push(...withDist.filter(p => (p.distance || 0) <= 50 && !filtered.some(f => f.id === p.id)));
      }
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setLocalProfessionals(filtered.length > 0 ? filtered : withDist.slice(0, 10));
    }
  }, [formData.latitude, formData.longitude, formData.postalCode, allProfessionals, proximity]);

  useEffect(() => { setSelectedCount(formData.selectedProfessionals.length); }, [formData.selectedProfessionals]);

  // ---- Dynamic steps ----
  const getSteps = () => {
    const steps = [
      { title: 'Infos', key: 'personal' },
      { title: 'Logement', key: 'housing' },
      { title: 'Projets', key: 'projects' },
    ];
    if (formData.projects.includes('cuisine')) steps.push({ title: 'Cuisine', key: 'kitchen' });
    if (formData.projects.includes('salle_de_bain')) steps.push({ title: 'Salle de bain', key: 'bathroom' });
    if (formData.projects.includes('dressing')) steps.push({ title: 'Dressing', key: 'dressing' });
    steps.push(
      { title: 'Documents', key: 'documents' },
      { title: 'Pros', key: 'professionals' },
      { title: 'Confirmation', key: 'confirmation' },
    );
    return steps;
  };

  const steps = getSteps();

  // Helpers
  const set = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleArr = (field: string, value: string) => {
    setFormData(prev => {
      const arr = (prev as any)[field] as string[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    set(e.target.name, e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (!files) return;
    if (fieldName === 'floorPlan') set('floorPlan', files[0]);
    else if (fieldName === 'photos') set('photos', Array.from(files).slice(0, 5));
    else if (fieldName === 'inspirationPhotos') set('inspirationPhotos', Array.from(files).slice(0, 5));
  };

  const toggleProfessionalSelection = (id: string) => {
    setFormData(prev => {
      const sel = prev.selectedProfessionals;
      if (sel.includes(id)) return { ...prev, selectedProfessionals: sel.filter(s => s !== id) };
      if (sel.length >= 5) {
        toast({ title: "Maximum atteint", description: "Vous pouvez sélectionner jusqu'à 5 professionnels.", variant: "destructive" });
        return prev;
      }
      return { ...prev, selectedProfessionals: [...sel, id] };
    });
  };

  const nextStep = () => {
    const proStep = steps.findIndex(s => s.key === 'professionals');
    if (currentStep === proStep && formData.selectedProfessionals.length < 3) {
      toast({ title: "Sélection requise", description: "Veuillez sélectionner au moins 3 professionnels.", variant: "destructive" });
      return;
    }
    if (currentStep < steps.length - 1) { setCurrentStep(currentStep + 1); window.scrollTo(0, 0); }
  };

  const prevStep = () => {
    if (currentStep > 0) { setCurrentStep(currentStep - 1); window.scrollTo(0, 0); }
  };

  // ---- SUBMIT ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const parts: string[] = [];
      parts.push(`Logement: ${formData.housingType}${formData.housingType === 'appartement' ? ` / Étage ${formData.floor} / Ascenseur: ${formData.hasElevator}` : ''}`);
      parts.push(`Bâtiment +2 ans: ${formData.buildingOver2Years}`);
      parts.push(`Projets: ${formData.projects.join(', ')}`);

      if (formData.projects.includes('cuisine')) {
        parts.push(`--- CUISINE ---`);
        if (formData.kitchenInstallType.length) parts.push(`Installation: ${formData.kitchenInstallType.join(', ')}`);
        if (formData.kitchenMealSolution.length) parts.push(`Solution repas: ${formData.kitchenMealSolution.join(', ')}`);
        if (formData.kitchenPersons) parts.push(`Personnes: ${formData.kitchenPersons}`);
        if (formData.kitchenCountertop.length) parts.push(`Plan de travail: ${formData.kitchenCountertop.join(', ')}`);
        if (formData.kitchenSinkCuves.length) parts.push(`Évier: ${formData.kitchenSinkCuves.join(', ')}`);
        if (formData.kitchenSinkMaterial.length) parts.push(`Matière évier: ${formData.kitchenSinkMaterial.join(', ')}`);
        if (formData.kitchenMitigeur) parts.push(`Mitigeur: ${formData.kitchenMitigeur}`);
        const appliances = [
          formData.ovenKeep === 'new' ? `Four: ${formData.ovenSubs.join(', ') || 'À prévoir'}` : formData.ovenKeep === 'keep' ? 'Four: conservé' : null,
          formData.hobKeep === 'new' ? `Plaque: ${formData.hobSubs.join(', ') || 'À prévoir'}${formData.hobFoyers.length ? ` (${formData.hobFoyers.join(', ')} foyers)` : ''}` : formData.hobKeep === 'keep' ? 'Plaque: conservée' : null,
          formData.hoodKeep === 'new' ? `Hotte: ${formData.hoodSubs.join(', ') || 'À prévoir'}${formData.hoodType.length ? ` - ${formData.hoodType.join(', ')}` : ''}` : formData.hoodKeep === 'keep' ? 'Hotte: conservée' : null,
          formData.dishwasherKeep === 'new' ? `Lave-vaisselle: ${formData.dishwasherSubs.join(', ') || 'À prévoir'}` : formData.dishwasherKeep === 'keep' ? 'LV: conservé' : null,
          formData.fridgeKeep === 'new' ? `Réfrigérateur: ${formData.fridgeSubs.join(', ') || 'À prévoir'}` : formData.fridgeKeep === 'keep' ? 'Frigo: conservé' : null,
          formData.microwaveKeep === 'new' ? `Micro-ondes: ${formData.microwaveSubs.join(', ') || 'À prévoir'}` : formData.microwaveKeep === 'keep' ? 'MO: conservé' : null,
          formData.coffeeMachineKeep === 'new' ? 'Machine à café: À prévoir' : formData.coffeeMachineKeep === 'keep' ? 'Café: conservé' : null,
          formData.wineCellarKeep === 'new' ? `Cave à vin: ${formData.wineCellarSubs.join(', ') || 'À prévoir'}` : formData.wineCellarKeep === 'keep' ? 'Cave: conservée' : null,
        ].filter(Boolean);
        if (appliances.length) parts.push(`Électroménager: ${appliances.join(' | ')}`);
        if (formData.kitchenPrestations.length) parts.push(`Prestations: ${formData.kitchenPrestations.join(', ')}`);
        if (formData.kitchenBudget) parts.push(`Budget cuisine: ${formData.kitchenBudget}`);
      }

      if (formData.projects.includes('salle_de_bain')) {
        parts.push(`--- SALLE DE BAIN ---`);
        if (formData.bathroomVasque) parts.push(`Vasque: ${formData.bathroomVasque}`);
        if (formData.bathroomColonne) parts.push(`Colonne: Oui`);
        if (formData.bathroomMiroir) parts.push(`Miroir: ${formData.bathroomMiroir}`);
        if (formData.bathroomAutre) parts.push(`Autre: ${formData.bathroomAutre}`);
        if (formData.bathroomBudget) parts.push(`Budget SdB: ${formData.bathroomBudget}`);
      }

      if (formData.projects.includes('dressing')) {
        parts.push(`--- DRESSING ---`);
        if (formData.dressingRoom) parts.push(`Pièce: ${formData.dressingRoom}`);
        if (formData.dressingStructure) parts.push(`Structure: ${formData.dressingStructure}`);
        if (formData.dressingOpening) parts.push(`Ouverture: ${formData.dressingOpening}`);
        if (formData.dressingBudget) parts.push(`Budget dressing: ${formData.dressingBudget}`);
      }

      if (formData.inspirationLinks) parts.push(`Liens inspiration: ${formData.inspirationLinks}`);
      if (formData.storeReferences) parts.push(`Références magasin: ${formData.storeReferences}`);

      const description = parts.join('\n');
      const projectType = formData.projects.join(', ');

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
          project_type: projectType,
          budget_range: [formData.kitchenBudget, formData.bathroomBudget, formData.dressingBudget].filter(Boolean).join(' | ') || null,
          description: description || null,
        })
        .select()
        .single();

      if (leadError) {
        toast({ title: "Erreur", description: "Une erreur est survenue lors de l'envoi.", variant: "destructive" });
        return;
      }

      let prosToAssign = formData.selectedProfessionals;
      if (prosToAssign.length === 0 && localProfessionals.length > 0) {
        prosToAssign = localProfessionals.slice(0, 3).map(p => p.id);
      }

      if (prosToAssign.length > 0 && leadData) {
        const assignments = prosToAssign.map(proId => {
          const pro = localProfessionals.find(p => p.id === proId);
          return { lead_id: leadData.id, professional_id: proId, distance_km: pro?.distance || null };
        });
        await supabase.from('lead_assignments').insert(assignments);
      }

      toast({ title: "Demande envoyée !", description: `Votre demande a été transmise à ${prosToAssign.length} professionnel(s).` });
      setTimeout(() => { window.location.href = '/'; }, 3000);
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue. Veuillez réessayer.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ RENDER STEPS ============

  const renderPersonalInfo = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">1️⃣ Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Prénom <span className="text-red-500">*</span></label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="input-field w-full" placeholder="Votre prénom" />
        </div>
        <div>
          <label className="form-label">Nom <span className="text-red-500">*</span></label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="input-field w-full" placeholder="Votre nom" />
        </div>
        <div>
          <label className="form-label">Téléphone <span className="text-red-500">*</span></label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="input-field w-full" placeholder="Votre numéro" />
        </div>
        <div>
          <label className="form-label">Email <span className="text-red-500">*</span></label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="input-field w-full" placeholder="Votre email" />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">Adresse d'installation <span className="text-red-500">*</span></label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="input-field w-full" placeholder="Adresse complète" />
        </div>
        <div>
          <label className="form-label">Code Postal <span className="text-red-500">*</span></label>
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required className="input-field w-full" placeholder="Code postal" />
        </div>
        <div>
          <label className="form-label">Ville <span className="text-red-500">*</span></label>
          <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="input-field w-full" placeholder="Ville" />
        </div>
      </div>
    </div>
  );

  const renderHousing = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">2️⃣ Type de logement</h3>
      <div className="space-y-6">
        <div>
          <label className="form-label mb-3 block">Type de logement <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption label="🏠 Maison" selected={formData.housingType === 'maison'} onClick={() => set('housingType', 'maison')} />
            <RadioOption label="🏢 Appartement" selected={formData.housingType === 'appartement'} onClick={() => set('housingType', 'appartement')} />
          </div>
        </div>

        {formData.housingType === 'appartement' && (
          <div className="space-y-6 p-4 border border-agence-gray-200 rounded-lg bg-agence-gray-50">
            <div>
              <label className="form-label">Étage</label>
              <input type="number" name="floor" value={formData.floor} onChange={handleInputChange} className="input-field w-full" placeholder="Étage" min="0" />
            </div>
            <div>
              <label className="form-label mb-3 block">Ascenseur</label>
              <div className="grid grid-cols-2 gap-3">
                <RadioOption label="Oui" selected={formData.hasElevator === 'oui'} onClick={() => set('hasElevator', 'oui')} />
                <RadioOption label="Non" selected={formData.hasElevator === 'non'} onClick={() => set('hasElevator', 'non')} />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="form-label mb-3 block">Le bâtiment a-t-il plus de 2 ans ?</label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption label="Oui" selected={formData.buildingOver2Years === 'oui'} onClick={() => set('buildingOver2Years', 'oui')} />
            <RadioOption label="Non" selected={formData.buildingOver2Years === 'non'} onClick={() => set('buildingOver2Years', 'non')} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">3️⃣ Votre / Vos projets</h3>
      <p className="text-agence-gray-600 mb-4">Sélectionnez un ou plusieurs projets :</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { key: 'cuisine', label: '🍳 Cuisine' },
          { key: 'salle_de_bain', label: '🚿 Salle de bain' },
          { key: 'dressing', label: '👔 Dressing' },
          { key: 'meuble_tv', label: '📺 Meuble TV' },
          { key: 'autre', label: '🔧 Autre agencement' },
        ].map(p => (
          <ToggleButton key={p.key} label={p.label} selected={formData.projects.includes(p.key)} onClick={() => toggleArr('projects', p.key)} />
        ))}
      </div>
    </div>
  );

  const renderKitchen = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">🔷 Section Cuisine</h3>

      {/* Configuration */}
      <SectionTitle icon="📐" title="Configuration" />
      <div className="space-y-6">
        <div>
          <label className="form-label mb-3 block">Type d'installation</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['Linéaire', 'Parallèle', 'Îlot', 'En L', 'En U'].map(v => (
              <ToggleButton key={v} label={v} selected={formData.kitchenInstallType.includes(v)} onClick={() => toggleArr('kitchenInstallType', v)} />
            ))}
          </div>
        </div>
        <div>
          <label className="form-label mb-3 block">Solution repas</label>
          <div className="grid grid-cols-3 gap-2">
            {['Îlot', 'Table indépendante', 'Plan snack'].map(v => (
              <ToggleButton key={v} label={v} selected={formData.kitchenMealSolution.includes(v)} onClick={() => toggleArr('kitchenMealSolution', v)} />
            ))}
          </div>
        </div>
        <div>
          <label className="form-label">Nombre de personnes</label>
          <input type="number" name="kitchenPersons" value={formData.kitchenPersons} onChange={handleInputChange} className="input-field w-full" placeholder="Nombre de personnes dans le foyer" min="1" />
        </div>
      </div>

      {/* Plan de travail */}
      <SectionTitle icon="🪨" title="Plan de travail" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {['Stratifié', 'Compact', 'Quartz', 'Céramique', 'Pierre naturelle', 'Mixte'].map(v => (
          <ToggleButton key={v} label={v} selected={formData.kitchenCountertop.includes(v)} onClick={() => toggleArr('kitchenCountertop', v)} />
        ))}
      </div>

      {/* Sanitaire */}
      <SectionTitle icon="🚰" title="Sanitaire" />
      <div className="space-y-6">
        <div>
          <label className="form-label mb-3 block">Évier</label>
          <div className="grid grid-cols-3 gap-2">
            {['1 cuve', '1½ cuve', '2 cuves'].map(v => (
              <ToggleButton key={v} label={v} selected={formData.kitchenSinkCuves.includes(v)} onClick={() => toggleArr('kitchenSinkCuves', v)} />
            ))}
          </div>
        </div>
        <div>
          <label className="form-label mb-3 block">Matière</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['Inox', 'Céramique', 'Granit', 'Autre'].map(v => (
              <ToggleButton key={v} label={v} selected={formData.kitchenSinkMaterial.includes(v)} onClick={() => toggleArr('kitchenSinkMaterial', v)} />
            ))}
          </div>
        </div>
        <div>
          <label className="form-label mb-3 block">Mitigeur</label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption label="Avec douchette" selected={formData.kitchenMitigeur === 'avec_douchette'} onClick={() => set('kitchenMitigeur', 'avec_douchette')} />
            <RadioOption label="Sans douchette" selected={formData.kitchenMitigeur === 'sans_douchette'} onClick={() => set('kitchenMitigeur', 'sans_douchette')} />
          </div>
        </div>
      </div>

      {/* Électroménager */}
      <SectionTitle icon="⚡" title="Électroménager" />
      <div className="space-y-4">
        <ApplianceField label="Four" keepValue={formData.ovenKeep} onKeepChange={v => set('ovenKeep', v)} subOptions={['Classique', 'Pyrolyse', 'Catalyse']} selectedSubs={formData.ovenSubs} onSubChange={v => toggleArr('ovenSubs', v)} />
        <ApplianceField label="Table de cuisson" keepValue={formData.hobKeep} onKeepChange={v => set('hobKeep', v)} subOptions={['Induction', 'Mixte', 'Gaz', 'Induction + hotte intégrée', 'Gaz + hotte intégrée']} selectedSubs={formData.hobSubs} onSubChange={v => toggleArr('hobSubs', v)} />
        {formData.hobKeep === 'new' && (
          <div className="ml-4">
            <label className="form-label mb-2 block">Nombre de foyers</label>
            <div className="grid grid-cols-3 gap-2">
              {['3', '4', 'Zone flexible'].map(v => (
                <ToggleButton key={v} label={v} selected={formData.hobFoyers.includes(v)} onClick={() => toggleArr('hobFoyers', v)} />
              ))}
            </div>
          </div>
        )}
        <ApplianceField label="Hotte" keepValue={formData.hoodKeep} onKeepChange={v => set('hoodKeep', v)} subOptions={['Décorative', 'Intégrée', 'Casquette', 'Sur plan de travail']} selectedSubs={formData.hoodSubs} onSubChange={v => toggleArr('hoodSubs', v)} />
        {formData.hoodKeep === 'new' && (
          <div className="ml-4">
            <label className="form-label mb-2 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['Évacuation externe', 'Recyclage'].map(v => (
                <ToggleButton key={v} label={v} selected={formData.hoodType.includes(v)} onClick={() => toggleArr('hoodType', v)} />
              ))}
            </div>
          </div>
        )}
        <ApplianceField label="Lave-vaisselle" keepValue={formData.dishwasherKeep} onKeepChange={v => set('dishwasherKeep', v)} subOptions={['Pose libre', 'Encastrable', '45 cm', '60 cm']} selectedSubs={formData.dishwasherSubs} onSubChange={v => toggleArr('dishwasherSubs', v)} />
        <ApplianceField label="Réfrigérateur" keepValue={formData.fridgeKeep} onKeepChange={v => set('fridgeKeep', v)} subOptions={['Pose libre', 'Encastrable', 'Tout utile', 'Combiné', 'Américain', 'Side-by-side']} selectedSubs={formData.fridgeSubs} onSubChange={v => toggleArr('fridgeSubs', v)} />
        <ApplianceField label="Micro-ondes" keepValue={formData.microwaveKeep} onKeepChange={v => set('microwaveKeep', v)} subOptions={['Pose libre', 'Encastrable']} selectedSubs={formData.microwaveSubs} onSubChange={v => toggleArr('microwaveSubs', v)} />
        <ApplianceField label="Machine à café" keepValue={formData.coffeeMachineKeep} onKeepChange={v => set('coffeeMachineKeep', v)} />
        <ApplianceField label="Cave à vin" keepValue={formData.wineCellarKeep} onKeepChange={v => set('wineCellarKeep', v)} subOptions={['Pose libre', 'Encastrable']} selectedSubs={formData.wineCellarSubs} onSubChange={v => toggleArr('wineCellarSubs', v)} />
      </div>

      {/* Prestations */}
      <SectionTitle icon="🛠️" title="Prestations souhaitées" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {['Démontage ancienne cuisine', 'Livraison', 'Pose', 'Travaux électriques', 'Travaux plomberie'].map(v => (
          <ToggleButton key={v} label={v} selected={formData.kitchenPrestations.includes(v)} onClick={() => toggleArr('kitchenPrestations', v)} />
        ))}
      </div>

      {/* Budget */}
      <SectionTitle icon="💰" title="Budget cuisine" />
      <textarea name="kitchenBudget" value={formData.kitchenBudget} onChange={handleInputChange} className="input-field w-full resize-none" rows={2} placeholder="Indiquez votre budget estimé pour la cuisine..." />
    </div>
  );

  const renderBathroom = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">🔷 Section Salle de bain</h3>

      <SectionTitle icon="🪞" title="Mobilier" />
      <div className="space-y-6">
        <div>
          <label className="form-label mb-3 block">Meuble vasque</label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption label="Simple vasque" selected={formData.bathroomVasque === 'simple'} onClick={() => set('bathroomVasque', 'simple')} />
            <RadioOption label="Double vasque" selected={formData.bathroomVasque === 'double'} onClick={() => set('bathroomVasque', 'double')} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="bathroomColonne"
            checked={formData.bathroomColonne}
            onChange={e => set('bathroomColonne', e.target.checked)}
            className="w-5 h-5 text-agence-orange-500 rounded"
          />
          <label htmlFor="bathroomColonne" className="form-label cursor-pointer">Colonne</label>
        </div>
        <div>
          <label className="form-label mb-3 block">Miroir</label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption label="Avec éclairage" selected={formData.bathroomMiroir === 'avec_eclairage'} onClick={() => set('bathroomMiroir', 'avec_eclairage')} />
            <RadioOption label="Sans éclairage" selected={formData.bathroomMiroir === 'sans_eclairage'} onClick={() => set('bathroomMiroir', 'sans_eclairage')} />
          </div>
        </div>
        <div>
          <label className="form-label">Autre demande</label>
          <textarea name="bathroomAutre" value={formData.bathroomAutre} onChange={handleInputChange} className="input-field w-full resize-none" rows={3} placeholder="Précisez vos besoins..." />
        </div>
      </div>

      <SectionTitle icon="💰" title="Budget salle de bain" />
      <textarea name="bathroomBudget" value={formData.bathroomBudget} onChange={handleInputChange} className="input-field w-full resize-none" rows={2} placeholder="Budget estimé..." />
    </div>
  );

  const renderDressing = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">🔷 Section Dressing / Aménagement</h3>

      <div className="space-y-6">
        <div>
          <label className="form-label mb-3 block">Pièce concernée</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Chambre parentale', 'Chambre enfant', 'Salle à manger', 'Entrée', 'Buanderie', 'Salon'].map(v => (
              <RadioOption key={v} label={v} selected={formData.dressingRoom === v} onClick={() => set('dressingRoom', v)} />
            ))}
          </div>
        </div>
        <div>
          <label className="form-label mb-3 block">Structure</label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption label="Ouvert" selected={formData.dressingStructure === 'ouvert'} onClick={() => set('dressingStructure', 'ouvert')} />
            <RadioOption label="Fermé" selected={formData.dressingStructure === 'ferme'} onClick={() => set('dressingStructure', 'ferme')} />
          </div>
        </div>
        <div>
          <label className="form-label mb-3 block">Type d'ouverture</label>
          <div className="grid grid-cols-3 gap-2">
            <RadioOption label="Battantes" selected={formData.dressingOpening === 'battantes'} onClick={() => set('dressingOpening', 'battantes')} />
            <RadioOption label="Coulissantes" selected={formData.dressingOpening === 'coulissantes'} onClick={() => set('dressingOpening', 'coulissantes')} />
            <RadioOption label="Pliantes" selected={formData.dressingOpening === 'pliantes'} onClick={() => set('dressingOpening', 'pliantes')} />
          </div>
        </div>
      </div>

      <SectionTitle icon="💰" title="Budget dressing" />
      <textarea name="dressingBudget" value={formData.dressingBudget} onChange={handleInputChange} className="input-field w-full resize-none" rows={2} placeholder="Budget estimé..." />
    </div>
  );

  const renderDocuments = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">📄 Documents & Inspirations</h3>
      <div className="space-y-8">
        {/* Floor Plan */}
        <div className="border border-agence-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-agence-orange-100 text-agence-orange-500 rounded-full"><Upload size={24} /></div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-agence-gray-800">Plan avec dimensions</h4>
              <p className="text-agence-gray-600 text-sm mb-4">PDF, JPG ou PNG</p>
              <label className="btn-secondary inline-flex cursor-pointer">
                <input type="file" onChange={e => handleFileChange(e, 'floorPlan')} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                <span>Sélectionner un fichier</span>
              </label>
              {formData.floorPlan && <p className="mt-2 text-sm text-agence-gray-700">✓ {formData.floorPlan.name}</p>}
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="border border-agence-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-agence-orange-100 text-agence-orange-500 rounded-full"><Upload size={24} /></div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-agence-gray-800">Photos de la pièce <span className="text-agence-gray-500 font-normal">(optionnel)</span></h4>
              <p className="text-agence-gray-600 text-sm mb-4">Jusqu'à 5 photos</p>
              <label className="btn-secondary inline-flex cursor-pointer">
                <input type="file" onChange={e => handleFileChange(e, 'photos')} accept=".jpg,.jpeg,.png" className="hidden" multiple />
                <span>Sélectionner des photos</span>
              </label>
              {formData.photos.length > 0 && <p className="mt-2 text-sm text-agence-gray-700">{formData.photos.length} photo(s)</p>}
            </div>
          </div>
        </div>

        {/* Inspiration */}
        <div className="border border-agence-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-agence-orange-100 text-agence-orange-500 rounded-full"><Instagram size={24} /></div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-agence-gray-800">Photos d'inspiration <span className="text-agence-gray-500 font-normal">(optionnel)</span></h4>
              <label className="btn-secondary inline-flex cursor-pointer">
                <input type="file" onChange={e => handleFileChange(e, 'inspirationPhotos')} accept=".jpg,.jpeg,.png" className="hidden" multiple />
                <span>Sélectionner des inspirations</span>
              </label>
              {formData.inspirationPhotos.length > 0 && <p className="mt-2 text-sm text-agence-gray-700">{formData.inspirationPhotos.length} photo(s)</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="form-label flex items-center gap-2"><LinkIcon size={16} /> Liens Pinterest / Instagram</label>
          <textarea name="inspirationLinks" value={formData.inspirationLinks} onChange={handleInputChange} className="input-field w-full resize-none" rows={3} placeholder="Collez vos liens..." />
        </div>
        <div>
          <label className="form-label">Références vues en magasin</label>
          <textarea name="storeReferences" value={formData.storeReferences} onChange={handleInputChange} className="input-field w-full resize-none" rows={3} placeholder="Ex: Modèle vu chez..." />
        </div>

        <div className="flex items-start space-x-3 p-4 bg-agence-orange-50 border border-agence-orange-200 rounded-lg">
          <Info className="text-agence-orange-500 h-5 w-5 mt-0.5" />
          <p className="text-agence-gray-700 text-sm">Les photos et plans nous aident à mieux comprendre votre projet.</p>
        </div>
      </div>
    </div>
  );

  const renderProfessionals = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Choisissez vos professionnels</h3>
      <div className="mb-6 p-4 bg-agence-orange-50 border border-agence-orange-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="text-agence-orange-500 h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-medium text-agence-gray-800">Sélectionnez entre 3 et 5 professionnels</h4>
            <p className="text-sm text-agence-gray-600">Ils recevront votre demande de devis.</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="form-label">Filtrer par proximité</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { key: 'postcode', label: 'Même département' },
            { key: 'radius', label: 'Rayon de 50km' },
            { key: 'both', label: 'Les deux' },
          ].map(f => (
            <button key={f.key} type="button" onClick={() => setProximity(f.key)}
              className={`py-2 px-3 rounded-md border text-sm font-medium ${proximity === f.key ? 'bg-agence-orange-100 border-agence-orange-300 text-agence-orange-800' : 'bg-white border-agence-gray-200 text-agence-gray-700 hover:bg-agence-gray-50'}`}
            >{f.label}</button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-agence-gray-800">Professionnels dans votre secteur</h4>
        <div className="text-sm font-medium px-3 py-1 bg-agence-orange-100 text-agence-orange-800 rounded-full">{selectedCount}/5</div>
      </div>

      <div className="space-y-4">
        {isLoadingPros ? (
          <div className="text-center p-8 border border-dashed border-agence-gray-300 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-agence-orange-500 mb-2" />
            <p className="text-agence-gray-600">Chargement...</p>
          </div>
        ) : localProfessionals.length > 0 ? (
          localProfessionals.map(pro => {
            const isSelected = formData.selectedProfessionals.includes(pro.id);
            return (
              <div key={pro.id} className={`p-4 border rounded-lg transition-all ${isSelected ? 'border-agence-orange-500 bg-agence-orange-50' : 'border-agence-gray-200 bg-white hover:border-agence-orange-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-agence-gray-800">{pro.company_name}</h5>
                    <div className="text-sm text-agence-gray-600 mt-1">
                      <span className="capitalize mr-4">{pro.entity_type}</span>
                      <span className="inline-flex items-center"><MapPin size={14} className="mr-1" />{pro.city} ({pro.postal_code})</span>
                      {pro.selected_plan === 'premium' && <span className="ml-2 bg-agence-orange-100 text-agence-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">Premium</span>}
                    </div>
                    {(pro.distance ?? 0) > 0 && <div className="mt-1 inline-block px-2 py-1 bg-agence-gray-100 text-agence-gray-700 text-xs rounded-md">{pro.distance} km</div>}
                  </div>
                  <button type="button" onClick={() => toggleProfessionalSelection(pro.id)}
                    className={`flex items-center justify-center w-6 h-6 rounded-full border ${isSelected ? 'bg-agence-orange-500 border-agence-orange-500 text-white' : 'border-agence-gray-300 bg-white'}`}>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 border border-dashed border-agence-gray-300 rounded-lg">
            <p className="text-agence-gray-600">{allProfessionals.length === 0 ? "Aucun professionnel inscrit." : "Aucun professionnel trouvé dans votre secteur."}</p>
            <p className="text-sm text-agence-gray-500">Votre demande sera transmise automatiquement.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold mb-6 text-agence-gray-800">Confirmation</h3>
      <div className="bg-white border border-agence-gray-200 rounded-lg p-6 shadow-sm mb-8">
        <p className="text-agence-gray-700 mb-6">Vérifiez vos informations avant de soumettre.</p>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b pb-2">Informations personnelles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-agence-gray-500">Nom:</span><p className="font-medium">{formData.firstName} {formData.lastName}</p></div>
              <div><span className="text-agence-gray-500">Tél:</span><p className="font-medium">{formData.phone}</p></div>
              <div><span className="text-agence-gray-500">Email:</span><p className="font-medium">{formData.email}</p></div>
              <div><span className="text-agence-gray-500">Adresse:</span><p className="font-medium">{formData.address}, {formData.postalCode} {formData.city}</p></div>
              <div><span className="text-agence-gray-500">Logement:</span><p className="font-medium capitalize">{formData.housingType || '-'}</p></div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b pb-2">Projets sélectionnés</h4>
            <p className="font-medium text-sm capitalize">{formData.projects.map(p => p.replace('_', ' ')).join(', ') || '-'}</p>
          </div>

          {formData.projects.includes('cuisine') && (
            <div>
              <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b pb-2">Cuisine</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-agence-gray-500">Installation:</span><p className="font-medium">{formData.kitchenInstallType.join(', ') || '-'}</p></div>
                <div><span className="text-agence-gray-500">Plan de travail:</span><p className="font-medium">{formData.kitchenCountertop.join(', ') || '-'}</p></div>
                <div><span className="text-agence-gray-500">Prestations:</span><p className="font-medium">{formData.kitchenPrestations.join(', ') || '-'}</p></div>
                {formData.kitchenBudget && <div><span className="text-agence-gray-500">Budget:</span><p className="font-medium">{formData.kitchenBudget}</p></div>}
              </div>
            </div>
          )}

          {formData.projects.includes('salle_de_bain') && (
            <div>
              <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b pb-2">Salle de bain</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-agence-gray-500">Vasque:</span><p className="font-medium">{formData.bathroomVasque || '-'}</p></div>
                <div><span className="text-agence-gray-500">Miroir:</span><p className="font-medium">{formData.bathroomMiroir?.replace('_', ' ') || '-'}</p></div>
                {formData.bathroomBudget && <div><span className="text-agence-gray-500">Budget:</span><p className="font-medium">{formData.bathroomBudget}</p></div>}
              </div>
            </div>
          )}

          {formData.projects.includes('dressing') && (
            <div>
              <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b pb-2">Dressing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-agence-gray-500">Pièce:</span><p className="font-medium">{formData.dressingRoom || '-'}</p></div>
                <div><span className="text-agence-gray-500">Structure:</span><p className="font-medium">{formData.dressingStructure || '-'}</p></div>
                <div><span className="text-agence-gray-500">Ouverture:</span><p className="font-medium">{formData.dressingOpening || '-'}</p></div>
                {formData.dressingBudget && <div><span className="text-agence-gray-500">Budget:</span><p className="font-medium">{formData.dressingBudget}</p></div>}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-agence-gray-800 mb-3 border-b pb-2">Professionnels sélectionnés</h4>
            {formData.selectedProfessionals.length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {formData.selectedProfessionals.map(proId => {
                  const pro = localProfessionals.find(p => p.id === proId);
                  return pro ? <li key={pro.id} className="text-agence-gray-700">{pro.company_name} - {pro.city}</li> : null;
                })}
              </ul>
            ) : (
              <p className="text-sm text-agence-gray-500">Attribution automatique</p>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-agence-gray-50 border border-agence-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <input type="checkbox" id="termsAccepted" className="w-5 h-5 text-agence-orange-500" required />
            <label htmlFor="termsAccepted" className="text-sm text-agence-gray-700">
              J'accepte les <a href="/terms" className="text-agence-orange-500 hover:underline">conditions générales</a> et la <a href="/privacy" className="text-agence-orange-500 hover:underline">politique de confidentialité</a>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // ---- Step Renderer ----
  const renderStep = () => {
    const key = steps[currentStep]?.key;
    switch (key) {
      case 'personal': return renderPersonalInfo();
      case 'housing': return renderHousing();
      case 'projects': return renderProjects();
      case 'kitchen': return renderKitchen();
      case 'bathroom': return renderBathroom();
      case 'dressing': return renderDressing();
      case 'documents': return renderDocuments();
      case 'professionals': return renderProfessionals();
      case 'confirmation': return renderConfirmation();
      default: return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator currentStep={currentStep} steps={steps} />
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-agence-gray-200 p-6 md:p-8">
        {renderStep()}
        <div className="flex justify-between mt-8 pt-6 border-t border-agence-gray-200">
          {currentStep > 0 ? (
            <button type="button" onClick={prevStep} className="btn-secondary flex items-center gap-2">
              <ArrowLeft size={16} /> Précédent
            </button>
          ) : <div />}
          {isLastStep ? (
            <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Envoi...</> : <><Check size={16} /> Envoyer ma demande</>}
            </button>
          ) : (
            <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
              Suivant <ArrowRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
