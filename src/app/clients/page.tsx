"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getClients, deleteClient, updateClientStatus } from "@/lib/store";
import { Plus, MoreVertical, Search, Filter, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(amount).replace("XOF", "FCFA");
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "actif":
      return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 rounded-full border-0 px-3 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" /> Actif</Badge>;
    case "inactif":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full border-0 px-3 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2" /> Inactif</Badge>;
    default:
      return null;
  }
};

export default function ClientsPage() {
  const router = useRouter();
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientToDelete, setClientToDelete] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setClientsData(await getClients());
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateClientStatus(id, status);
    setClientsData(await getClients());
  };

  const handleDeleteClient = async () => {
    if (clientToDelete) {
      await deleteClient(clientToDelete.id);
      setClientsData(await getClients());
      setClientToDelete(null);
    }
  };

  const filteredClients = clientsData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Clients</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">Gérez votre répertoire de clients.</p>
        </div>
        <Button 
          onClick={() => router.push('/clients/nouveau')}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] h-11 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Client
        </Button>
      </div>

      <Card className="rounded-2xl border-gray-200 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-sm transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-100">
        <CardHeader className="pt-6 px-4 sm:px-6 pb-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-600" />
              <Input 
                placeholder="Rechercher par nom, email..." 
                className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-4 text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </CardHeader>
        
        {/* Vue Desktop */}
        <CardContent className="p-0 hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="font-semibold text-gray-800 pl-6 py-4">Nom / Entreprise</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4">Contact</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4">Total Facturé</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4 text-center">Statut</TableHead>
                <TableHead className="pr-6 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={`skeleton-desktop-${i}`}>
                    <TableCell className="pl-6 py-4">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="py-4 text-center"><Skeleton className="h-6 w-20 rounded-full mx-auto" /></TableCell>
                    <TableCell className="pr-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedClients.map((client) => (
                <TableRow 
                  key={client.id} 
                  className="group hover:bg-blue-50/50 hover:shadow-sm hover:-translate-y-[1px] active:scale-[0.99] active:bg-blue-100/50 transition-all duration-200 cursor-pointer bg-white"
                >
                  <TableCell onClick={() => router.push(`/clients/nouveau?id=${client.id}`)} className="pl-6 py-4">
                    <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{client.name}</div>
                    <div className="flex items-center text-gray-500 font-medium text-xs mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {client.address}
                    </div>
                  </TableCell>
                  <TableCell onClick={() => router.push(`/clients/nouveau?id=${client.id}`)} className="py-4">
                    <div className="flex items-center text-gray-700 font-medium mb-1">
                      <Mail className="w-3 h-3 mr-1.5 text-gray-400" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-gray-700 font-medium text-xs">
                      <Phone className="w-3 h-3 mr-1.5 text-gray-400" />
                      {client.phone}
                    </div>
                  </TableCell>
                  <TableCell onClick={() => router.push(`/clients/nouveau?id=${client.id}`)} className="font-bold text-gray-900 tabular-nums py-4">
                    {formatFCFA(client.totalBilled)}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className="focus:outline-none">
                        {getStatusBadge(client.status)}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-[140px] rounded-xl bg-white shadow-lg border border-gray-100 z-50 p-1">
                        {["actif", "inactif"].map((s) => (
                          <DropdownMenuItem 
                            key={s} 
                            className="cursor-pointer capitalize font-medium"
                            onClick={async (e) => {
                              e.preventDefault();
                              await handleStatusChange(client.id, s);
                            }}
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 ml-auto"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl bg-white shadow-lg border border-gray-100 z-50">
                        <DropdownMenuItem onClick={() => router.push(`/clients/nouveau?id=${client.id}`)} className="cursor-pointer font-medium">Voir détails</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/clients/nouveau?id=${client.id}`)} className="cursor-pointer font-medium">Modifier</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer font-medium">
                            Changer le statut
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="z-50 bg-white rounded-xl shadow-lg border border-gray-100">
                              <DropdownMenuItem onClick={() => handleStatusChange(client.id, 'actif')} className="cursor-pointer font-medium text-green-600 focus:text-green-600">Actif</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(client.id, 'inactif')} className="cursor-pointer font-medium text-red-600 focus:text-red-600">Inactif</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem className="cursor-pointer font-medium">Envoyer un email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setClientToDelete(client)} className="cursor-pointer font-medium text-red-600 focus:text-red-600">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500 bg-white font-medium">
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Vue Mobile */}
        <CardContent className="p-0 sm:hidden">
          <div className="flex flex-col">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`skeleton-mob-${i}`} className="p-4 border-b border-gray-100 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2 mb-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))
            ) : paginatedClients.map((client) => (
              <div 
                key={client.id} 
                onClick={() => router.push(`/clients/nouveau?id=${client.id}`)}
                className="group p-4 border-b border-gray-100 bg-white hover:bg-blue-50/50 active:bg-blue-100/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{client.name}</div>
                    <div className="flex items-center text-gray-500 font-medium text-xs mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {client.address}
                    </div>
                  </div>
                  {getStatusBadge(client.status)}
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-gray-700 font-medium text-sm">
                    <Mail className="w-3 h-3 mr-1.5 text-gray-400" />
                    {client.email}
                  </div>
                  <div className="flex items-center text-gray-700 font-medium text-sm">
                    <Phone className="w-3 h-3 mr-1.5 text-gray-400" />
                    {client.phone}
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Facturé</div>
                  <div className="font-bold text-gray-900 tabular-nums">
                    {formatFCFA(client.totalBilled)}
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && filteredClients.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-medium bg-white">
                Aucun client trouvé.
              </div>
            )}
          </div>
        </CardContent>
        <CardContent className="p-4 border-t border-gray-100 bg-gray-50/30">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                  className={cn("rounded-xl", currentPage === 1 && "pointer-events-none opacity-50")} 
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === i + 1}
                    onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}
                    className="rounded-xl"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                  className={cn("rounded-xl", currentPage === totalPages && "pointer-events-none opacity-50")} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <AlertDialog open={clientToDelete !== null} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent className="bg-white rounded-2xl p-6 border-0 shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">Supprimer le client</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-[15px] leading-relaxed mt-2">
              Êtes-vous sûr de vouloir supprimer ce client ({clientToDelete?.name}) ? Cette action est irréversible et supprimera également toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl font-bold border-gray-200 text-gray-700 hover:bg-gray-50 sm:mr-3">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 border-0">
              Oui, supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
