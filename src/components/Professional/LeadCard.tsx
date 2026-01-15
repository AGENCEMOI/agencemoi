import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Euro, Phone, Mail, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  project_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  description: string | null;
  status: string;
  created_at: string;
  distance_km?: number | null;
}

interface LeadCardProps {
  lead: Lead;
  onContact: (lead: Lead) => void;
}

const getProjectTypeLabel = (type: string | null) => {
  const types: Record<string, string> = {
    kitchen: 'Cuisine',
    bathroom: 'Salle de bain',
    library: 'Bibliothèque',
    dressing: 'Dressing',
    other: 'Autre',
  };
  return type ? types[type] || type : '-';
};

const getBudgetLabel = (budget: string | null) => {
  const budgets: Record<string, string> = {
    less5k: '< 5 000 €',
    '5kTo10k': '5 000 - 10 000 €',
    '10kTo15k': '10 000 - 15 000 €',
    '15kTo20k': '15 000 - 20 000 €',
    more20k: '> 20 000 €',
  };
  return budget ? budgets[budget] || budget : '-';
};

const getTimelineLabel = (timeline: string | null) => {
  const timelines: Record<string, string> = {
    lessThan3: '< 3 mois',
    '3to6': '3-6 mois',
    moreThan6: '> 6 mois',
  };
  return timeline ? timelines[timeline] || timeline : '-';
};

const LeadCard = ({ lead, onContact }: LeadCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {lead.first_name} {lead.last_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>{lead.city} ({lead.postal_code})</span>
              {lead.distance_km && (
                <Badge variant="secondary" className="ml-2">
                  {lead.distance_km} km
                </Badge>
              )}
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            {getProjectTypeLabel(lead.project_type)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Euro size={14} className="text-muted-foreground" />
            <span>{getBudgetLabel(lead.budget_range)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground" />
            <span>{getTimelineLabel(lead.timeline)}</span>
          </div>
        </div>

        {lead.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {lead.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Reçu le {format(new Date(lead.created_at), 'dd MMM yyyy', { locale: fr })}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.location.href = `tel:${lead.phone}`}
          >
            <Phone size={14} className="mr-2" />
            Appeler
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.location.href = `mailto:${lead.email}`}
          >
            <Mail size={14} className="mr-2" />
            Email
          </Button>
          <Button
            size="sm"
            onClick={() => onContact(lead)}
          >
            <ExternalLink size={14} className="mr-2" />
            Détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
