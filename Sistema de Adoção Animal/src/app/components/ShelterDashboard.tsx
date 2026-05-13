import { useState } from 'react';
import { Plus, Users, CheckCircle, X, PawPrint } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PetQuestionnaire, type PetFormData } from './PetQuestionnaire';
import type { Pet, Match } from '../types';

interface ShelterDashboardProps {
  shelterName: string;
  pets: Pet[];
  matches: Match[];
  onAddPet: (pet: Omit<Pet, 'id' | 'shelter'>) => void;
  onApproveMatch: (matchId: string) => void;
  onRejectMatch: (matchId: string) => void;
  onLogout: () => void;
}

export function ShelterDashboard({
  shelterName,
  pets,
  matches,
  onAddPet,
  onApproveMatch,
  onRejectMatch,
  onLogout
}: ShelterDashboardProps) {
  const [showAddPet, setShowAddPet] = useState(false);

  const shelterPets = pets.filter(p => p.shelter === shelterName);
  const pendingMatches = matches.filter(m => m.status === 'pending');
  const approvedMatches = matches.filter(m => m.status === 'approved');

  const handleSubmitPet = (petData: PetFormData) => {
    onAddPet({
      ...petData,
      imageUrl: petData.imageUrl || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1543466835-00537b3e30af' : '1514888286-882c66fc3b66'}?w=400&h=400&fit=crop`
    });
    setShowAddPet(false);
  };

  if (showAddPet) {
    return <PetQuestionnaire onComplete={handleSubmitPet} onCancel={() => setShowAddPet(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="flex items-center gap-2">
            <PawPrint className="text-primary" />
            AdoPet - {shelterName}
          </h1>
          <Button variant="outline" onClick={onLogout}>Sair</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pets" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="pets">Meus Pets ({shelterPets.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pendentes
              {pendingMatches.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingMatches.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Aprovados ({approvedMatches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowAddPet(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Pet
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelterPets.map(pet => (
                <Card key={pet.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div>
                      <h3>{pet.name}</h3>
                      <p className="text-muted-foreground">{pet.breed} • {pet.age} anos</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pet.temperament.slice(0, 3).map(trait => (
                        <Badge key={trait} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                    <div className="pt-2 text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{matches.filter(m => m.petId === pet.id).length} interessados</span>
                    </div>
                  </div>
                </Card>
              ))}

              {shelterPets.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <PawPrint className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum pet cadastrado ainda</p>
                  <Button className="mt-4" onClick={() => setShowAddPet(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar primeiro pet
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingMatches.map(match => {
                const pet = pets.find(p => p.id === match.petId);
                if (!pet) return null;

                return (
                  <Card key={match.id} className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={pet.imageUrl}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3>{match.adopterName} está interessado em {pet.name}</h3>
                          <p className="text-muted-foreground">Pontuação de compatibilidade: {match.score}%</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge>Match automático</Badge>
                          {match.score >= 80 && <Badge variant="default">Alta compatibilidade</Badge>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => onApproveMatch(match.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aprovar
                          </Button>
                          <Button
                            onClick={() => onRejectMatch(match.id)}
                            variant="outline"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Recusar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {pendingMatches.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum match pendente de aprovação</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="space-y-4">
              {approvedMatches.map(match => {
                const pet = pets.find(p => p.id === match.petId);
                if (!pet) return null;

                return (
                  <Card key={match.id} className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={pet.imageUrl}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3>{match.adopterName} → {pet.name}</h3>
                        <p className="text-muted-foreground">Aprovado • Compatibilidade: {match.score}%</p>
                        <Badge className="mt-2 bg-green-600">Match confirmado</Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {approvedMatches.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum match aprovado ainda</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
