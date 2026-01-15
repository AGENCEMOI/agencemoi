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
import { Check, X, Eye, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Professional {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  postal_code: string;
  entity_type: string;
  selected_plan: string;
  status: string;
  created_at: string;
}

interface ProfessionalsTableProps {
  professionals: Professional[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (professional: Professional) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approuvé</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejeté</Badge>;
    default:
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
  }
};

const ProfessionalsTable = ({
  professionals,
  loading,
  onApprove,
  onReject,
  onDelete,
  onView,
}: ProfessionalsTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun professionnel inscrit pour le moment.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entreprise</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((pro) => (
            <TableRow key={pro.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{pro.company_name}</div>
                  <div className="text-sm text-muted-foreground">{pro.entity_type}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{pro.contact_name}</div>
                  <div className="text-sm text-muted-foreground">{pro.contact_email}</div>
                </div>
              </TableCell>
              <TableCell>
                {pro.city} ({pro.postal_code})
              </TableCell>
              <TableCell>
                <Badge variant="outline">{pro.selected_plan}</Badge>
              </TableCell>
              <TableCell>{getStatusBadge(pro.status)}</TableCell>
              <TableCell>
                {format(new Date(pro.created_at), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onView(pro)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {pro.status === 'pending' && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onApprove(pro.id)}
                        title="Approuver"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onReject(pro.id)}
                        title="Rejeter"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(pro.id)}
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

export default ProfessionalsTable;
