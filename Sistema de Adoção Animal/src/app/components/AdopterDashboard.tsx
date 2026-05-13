import { useState } from 'react';
import { Heart, Filter, MessageCircle, CheckCircle, ClipboardList } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AdopterQuestionnaire } from './AdopterQuestionnaire';
import type { Pet, Match, AdopterProfile } from '../types';

interface AdopterDashboardProps {
  pets: Pet[];
  matches: Match[];
  adopterProfile: AdopterProfile | null;
  onLikePet: (petId: string) => void;
  onUpdateProfile: (profile: AdopterProfile) => void;
  onLogout: () => void;
}

export function AdopterDashboard({ pets, matches, adopterProfile, onLikePet, onUpdateProfile, onLogout }: AdopterDashboardProps) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [likedPets, setLikedPets] = useState<Set<string>>(new Set());
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleLike = (pet: Pet) => {
    setLikedPets(prev => new Set([...prev, pet.id]));
    onLikePet(pet.id);
  };

  const filteredPets = pets.filter(pet => {
    if (speciesFilter !== 'all' && pet.species !== speciesFilter) return false;
    if (sizeFilter !== 'all' && pet.size !== sizeFilter) return false;
    return true;
  });

  const matchedPets = matches
    .filter(m => m.status === 'approved')
    .map(m => pets.find(p => p.id === m.petId))
    .filter(Boolean) as Pet[];

  const handleQuestionnaireUpdate = (profile: AdopterProfile) => {
    onUpdateProfile(profile);
    setShowQuestionnaire(false);
  };

  if (showQuestionnaire) {
    return (
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" onClick={() => setShowQuestionnaire(false)}>
            Voltar ao Dashboard
          </Button>
        </div>
        <AdopterQuestionnaire onComplete={handleQuestionnaireUpdate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="flex items-center gap-2">
            <Heart className="text-destructive" />
            AdoPet - Adotante
          </h1>
          <Button variant="outline" onClick={onLogout}>Sair</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="browse">Buscar Pets</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="matches">Matches ({matchedPets.length})</TabsTrigger>
            <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex gap-4 items-center">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Espécie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as espécies</SelectItem>
                  <SelectItem value="dog">Cachorro</SelectItem>
                  <SelectItem value="cat">Gato</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tamanhos</SelectItem>
                  <SelectItem value="small">Pequeno</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map(pet => (
                <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-card">
                      {pet.species === 'dog' ? '🐕' : '🐱'} {pet.age} anos
                    </Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3>{pet.name}</h3>
                      <p className="text-muted-foreground capitalize">{pet.breed} • {pet.size === 'small' ? 'Pequeno' : pet.size === 'medium' ? 'Médio' : 'Grande'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pet.temperament.map(trait => (
                        <Badge key={trait} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => setSelectedPet(pet)}
                        variant="outline"
                      >
                        Ver detalhes
                      </Button>
                      <Button
                        onClick={() => handleLike(pet)}
                        disabled={likedPets.has(pet.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {likedPets.has(pet.id) ? <CheckCircle className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(likedPets).map(petId => {
                const pet = pets.find(p => p.id === petId);
                if (!pet) return null;
                return (
                  <Card key={pet.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted">
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <h3>{pet.name}</h3>
                      <p className="text-muted-foreground">{pet.breed}</p>
                      <Button className="w-full" onClick={() => setSelectedPet(pet)}>
                        Ver detalhes
                      </Button>
                    </div>
                  </Card>
                );
              })}
              {likedPets.size === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Você ainda não favoritou nenhum pet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="matches">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedPets.map(pet => (
                <Card key={pet.id} className="overflow-hidden border-2 border-destructive/50">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-destructive">Match!</Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3>{pet.name}</h3>
                    <p className="text-muted-foreground">{pet.shelter}</p>
                    <Button className="w-full" variant="default">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Entrar em contato
                    </Button>
                  </div>
                </Card>
              ))}
              {matchedPets.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ainda não há matches aprovados</p>
                  <p className="mt-2">Continue curtindo pets para aumentar suas chances!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3>Meu Perfil de Adoção</h3>
                    <p className="text-muted-foreground">
                      Suas preferências ajudam a encontrar o pet ideal
                    </p>
                  </div>
                  <Button onClick={() => setShowQuestionnaire(true)}>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Editar Questionário
                  </Button>
                </div>

                {adopterProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Tipo de moradia</p>
                      <p className="capitalize">
                        {adopterProfile.tipoMoradia === 'CASA' ? 'Casa' :
                         adopterProfile.tipoMoradia === 'APARTAMENTO' ? 'Apartamento' : 'Sítio'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-muted-foreground">Nível de atividade</p>
                      <p className="capitalize">
                        {adopterProfile.nivelAtividade === 'SEDENTARIO' ? 'Sedentário' :
                         adopterProfile.nivelAtividade === 'MODERADO' ? 'Moderado' : 'Ativo'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-muted-foreground">Tolerância a barulho</p>
                      <p className="capitalize">{adopterProfile.toleranciaBarulho}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-muted-foreground">Tem crianças em casa</p>
                      <p>{adopterProfile.temCriancas ? 'Sim' : 'Não'}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-muted-foreground">Tem outros pets</p>
                      <p>{adopterProfile.temOutrosPets ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      Você ainda não preencheu o questionário de perfil
                    </p>
                    <Button onClick={() => setShowQuestionnaire(true)}>
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Preencher Questionário
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={selectedPet !== null} onOpenChange={() => setSelectedPet(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPet && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPet.name}</DialogTitle>
                <DialogDescription>{selectedPet.breed}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedPet.imageUrl}
                    alt={selectedPet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Idade</p>
                    <p>{selectedPet.age} anos</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tamanho</p>
                    <p className="capitalize">{selectedPet.size === 'small' ? 'Pequeno' : selectedPet.size === 'medium' ? 'Médio' : 'Grande'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Espécie</p>
                    <p className="capitalize">{selectedPet.species === 'dog' ? 'Cachorro' : 'Gato'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Abrigo</p>
                    <p>{selectedPet.shelter}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Temperamento</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPet.temperament.map(trait => (
                      <Badge key={trait}>{trait}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Sobre</p>
                  <p>{selectedPet.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-destructive hover:bg-destructive/90"
                    onClick={() => {
                      handleLike(selectedPet);
                      setSelectedPet(null);
                    }}
                    disabled={likedPets.has(selectedPet.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {likedPets.has(selectedPet.id) ? 'Favoritado' : 'Favoritar'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
