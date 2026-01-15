import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  postal_code: string;
  project_type: string | null;
  budget_range: string | null;
  status: string;
  created_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
  onStatusChange: (id: string, status: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'contacted':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Contacté</Badge>;
    case 'in_progress':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">En cours</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Annulé</Badge>;
    default:
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Nouveau</Badge>;
  }
};

const LeadsTable = ({
  leads,
  loading,
  onDelete,
  onView,
  onStatusChange,
}: LeadsTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune demande client pour le moment.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Type de projet</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <div className="font-medium">
                  {lead.first_name} {lead.last_name}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm">{lead.email}</div>
                  <div className="text-sm text-muted-foreground">{lead.phone}</div>
                </div>
              </TableCell>
              <TableCell>
                {lead.city} ({lead.postal_code})
              </TableCell>
              <TableCell>
                {lead.project_type || '-'}
              </TableCell>
              <TableCell>
                {lead.budget_range || '-'}
              </TableCell>
              <TableCell>
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-background"
                >
                  <option value="new">Nouveau</option>
                  <option value="contacted">Contacté</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </TableCell>
              <TableCell>
                {format(new Date(lead.created_at), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onView(lead)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(lead.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;
