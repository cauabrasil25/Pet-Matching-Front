import { useState } from 'react';
import { Activity, Volume2, Heart, Users, Baby, PawPrint, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PetQuestionnaireProps {
  onComplete: (petData: PetFormData) => void;
  onCancel: () => void;
}

export interface PetFormData {
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  temperament: string[];
  description: string;
  imageUrl: string;
  status: 'DISPONIVEL' | 'PENDENTE' | 'ADOTADO';
  nivelEnergia: 'BAIXO' | 'MEDIO' | 'ALTO';
  nivelBarulho: 'BAIXO' | 'ALTO';
  temDeficienciaFisica: boolean;
  temDoencaCronica: boolean;
  sociavelEstranhos: boolean;
  sociavelCriancas: boolean;
  sociavelAnimais: boolean;
}

export function PetQuestionnaire({ onComplete, onCancel }: PetQuestionnaireProps) {
  const [formData, setFormData] = useState<Partial<PetFormData>>({
    name: '',
    species: 'dog',
    breed: '',
    age: 0,
    size: 'medium',
    temperament: [],
    description: '',
    imageUrl: '',
    status: 'DISPONIVEL',
    nivelEnergia: undefined,
    nivelBarulho: undefined,
    temDeficienciaFisica: undefined,
    temDoencaCronica: undefined,
    sociavelEstranhos: undefined,
    sociavelCriancas: undefined,
    sociavelAnimais: undefined
  });

  const isFormComplete =
    formData.name &&
    formData.breed &&
    formData.age &&
    formData.age > 0 &&
    formData.nivelEnergia !== undefined &&
    formData.nivelBarulho !== undefined &&
    formData.temDeficienciaFisica !== undefined &&
    formData.temDoencaCronica !== undefined &&
    formData.sociavelEstranhos !== undefined &&
    formData.sociavelCriancas !== undefined &&
    formData.sociavelAnimais !== undefined;

  const handleSubmit = () => {
    if (isFormComplete) {
      onComplete({
        ...formData,
        temperament: []
      } as PetFormData);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl mx-auto p-8 my-8 space-y-8">
        <div className="text-center space-y-2">
          <h2>Cadastrar Novo Pet</h2>
          <p className="text-muted-foreground">
            Preencha as informações do pet para adoção
          </p>
        </div>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3>Informações Básicas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do pet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Rex"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Espécie *</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value: 'dog' | 'cat') => setFormData(prev => ({ ...prev, species: value }))}
                >
                  <SelectTrigger id="species">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Cachorro</SelectItem>
                    <SelectItem value="cat">Gato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breed">Raça *</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                  placeholder="Ex: Vira-lata"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Idade (anos) *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 3"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Tamanho *</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value: 'small' | 'medium' | 'large') => setFormData(prev => ({ ...prev, size: value }))}
                >
                  <SelectTrigger id="size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeno</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'DISPONIVEL' | 'PENDENTE' | 'ADOTADO') => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="ADOTADO">Adotado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Conte mais sobre o pet..."
                rows={3}
              />
            </div>
          </div>

          {/* Características e Comportamento */}
          <div className="space-y-4 pt-4 border-t">
            <h3>Características e Comportamento</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <Label>Nível de energia *</Label>
              </div>
              <RadioGroup
                value={formData.nivelEnergia || ''}
                onValueChange={(value: 'BAIXO' | 'MEDIO' | 'ALTO') => setFormData(prev => ({ ...prev, nivelEnergia: value }))}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Card className={`p-4 cursor-pointer transition-all ${formData.nivelEnergia === 'BAIXO' ? 'border-2 border-primary' : 'border'}`}>
                    <label htmlFor="energia-baixo" className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="BAIXO" id="energia-baixo" />
                      <div>
                        <span>Baixo</span>
                        <p className="text-sm text-muted-foreground">Calmo e tranquilo</p>
                      </div>
                    </label>
                  </Card>
                  <Card className={`p-4 cursor-pointer transition-all ${formData.nivelEnergia === 'MEDIO' ? 'border-2 border-primary' : 'border'}`}>
                    <label htmlFor="energia-medio" className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="MEDIO" id="energia-medio" />
                      <div>
                        <span>Médio</span>
                        <p className="text-sm text-muted-foreground">Equilibrado</p>
                      </div>
                    </label>
                  </Card>
                  <Card className={`p-4 cursor-pointer transition-all ${formData.nivelEnergia === 'ALTO' ? 'border-2 border-primary' : 'border'}`}>
                    <label htmlFor="energia-alto" className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="ALTO" id="energia-alto" />
                      <div>
                        <span>Alto</span>
                        <p className="text-sm text-muted-foreground">Muito ativo</p>
                      </div>
                    </label>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <Label>Nível de barulho *</Label>
              </div>
              <RadioGroup
                value={formData.nivelBarulho || ''}
                onValueChange={(value: 'BAIXO' | 'ALTO') => setFormData(prev => ({ ...prev, nivelBarulho: value }))}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className={`p-4 cursor-pointer transition-all ${formData.nivelBarulho === 'BAIXO' ? 'border-2 border-primary' : 'border'}`}>
                    <label htmlFor="barulho-baixo" className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="BAIXO" id="barulho-baixo" />
                      <div>
                        <span>Baixo</span>
                        <p className="text-sm text-muted-foreground">Quieto e silencioso</p>
                      </div>
                    </label>
                  </Card>
                  <Card className={`p-4 cursor-pointer transition-all ${formData.nivelBarulho === 'ALTO' ? 'border-2 border-primary' : 'border'}`}>
                    <label htmlFor="barulho-alto" className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="ALTO" id="barulho-alto" />
                      <div>
                        <span>Alto</span>
                        <p className="text-sm text-muted-foreground">Late/mia bastante</p>
                      </div>
                    </label>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <Label>Condições de saúde *</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">Tem deficiência física?</p>
                  <RadioGroup
                    value={formData.temDeficienciaFisica === undefined ? '' : formData.temDeficienciaFisica?.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, temDeficienciaFisica: value === 'true' }))}
                  >
                    <div className="flex gap-3">
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.temDeficienciaFisica === true ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="def-sim" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="true" id="def-sim" />
                          <span>Sim</span>
                        </label>
                      </Card>
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.temDeficienciaFisica === false ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="def-nao" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="false" id="def-nao" />
                          <span>Não</span>
                        </label>
                      </Card>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <p className="mb-2">Tem doença crônica?</p>
                  <RadioGroup
                    value={formData.temDoencaCronica === undefined ? '' : formData.temDoencaCronica?.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, temDoencaCronica: value === 'true' }))}
                  >
                    <div className="flex gap-3">
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.temDoencaCronica === true ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="doenca-sim" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="true" id="doenca-sim" />
                          <span>Sim</span>
                        </label>
                      </Card>
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.temDoencaCronica === false ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="doenca-nao" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="false" id="doenca-nao" />
                          <span>Não</span>
                        </label>
                      </Card>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <Label>Sociabilidade *</Label>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    <p>Sociável com estranhos?</p>
                  </div>
                  <RadioGroup
                    value={formData.sociavelEstranhos === undefined ? '' : formData.sociavelEstranhos?.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sociavelEstranhos: value === 'true' }))}
                  >
                    <div className="flex gap-3">
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.sociavelEstranhos === true ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="estranhos-sim" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="true" id="estranhos-sim" />
                          <span>Sim</span>
                        </label>
                      </Card>
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.sociavelEstranhos === false ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="estranhos-nao" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="false" id="estranhos-nao" />
                          <span>Não</span>
                        </label>
                      </Card>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Baby className="w-4 h-4" />
                    <p>Sociável com crianças?</p>
                  </div>
                  <RadioGroup
                    value={formData.sociavelCriancas === undefined ? '' : formData.sociavelCriancas?.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sociavelCriancas: value === 'true' }))}
                  >
                    <div className="flex gap-3">
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.sociavelCriancas === true ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="criancas-sim" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="true" id="criancas-sim" />
                          <span>Sim</span>
                        </label>
                      </Card>
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.sociavelCriancas === false ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="criancas-nao" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="false" id="criancas-nao" />
                          <span>Não</span>
                        </label>
                      </Card>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <PawPrint className="w-4 h-4" />
                    <p>Sociável com outros animais?</p>
                  </div>
                  <RadioGroup
                    value={formData.sociavelAnimais === undefined ? '' : formData.sociavelAnimais?.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sociavelAnimais: value === 'true' }))}
                  >
                    <div className="flex gap-3">
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.sociavelAnimais === true ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="animais-sim" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="true" id="animais-sim" />
                          <span>Sim</span>
                        </label>
                      </Card>
                      <Card className={`p-3 cursor-pointer transition-all flex-1 ${formData.sociavelAnimais === false ? 'border-2 border-primary' : 'border'}`}>
                        <label htmlFor="animais-nao" className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value="false" id="animais-nao" />
                          <span>Não</span>
                        </label>
                      </Card>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormComplete}
              className="flex-1"
            >
              Cadastrar Pet
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
