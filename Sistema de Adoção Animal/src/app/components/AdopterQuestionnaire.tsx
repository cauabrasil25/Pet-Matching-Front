import { useState } from 'react';
import { Home, Activity, Volume2, Baby, PawPrint, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type { AdopterProfile } from '../types';

interface AdopterQuestionnaireProps {
  onComplete: (profile: AdopterProfile) => void;
}

export function AdopterQuestionnaire({ onComplete }: AdopterQuestionnaireProps) {
  const [profile, setProfile] = useState<AdopterProfile>({
    tipoMoradia: null,
    nivelAtividade: null,
    toleranciaBarulho: null,
    temCriancas: null,
    temOutrosPets: null
  });

  const isComplete =
    profile.tipoMoradia !== null &&
    profile.nivelAtividade !== null &&
    profile.toleranciaBarulho !== null &&
    profile.temCriancas !== null &&
    profile.temOutrosPets !== null;

  const handleSubmit = () => {
    if (isComplete) {
      onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <h2>Questionário de Perfil</h2>
          <p className="text-muted-foreground">
            Para encontrar o pet perfeito para você, precisamos conhecer um pouco mais sobre seu estilo de vida
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              <Label>Tipo de moradia</Label>
            </div>
            <RadioGroup
              value={profile.tipoMoradia || ''}
              onValueChange={(value) => setProfile(prev => ({ ...prev, tipoMoradia: value as AdopterProfile['tipoMoradia'] }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className={`p-4 cursor-pointer transition-all ${profile.tipoMoradia === 'CASA' ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="casa" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="CASA" id="casa" />
                    <span>Casa</span>
                  </label>
                </Card>
                <Card className={`p-4 cursor-pointer transition-all ${profile.tipoMoradia === 'APARTAMENTO' ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="apartamento" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="APARTAMENTO" id="apartamento" />
                    <span>Apartamento</span>
                  </label>
                </Card>
                <Card className={`p-4 cursor-pointer transition-all ${profile.tipoMoradia === 'SITIO' ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="sitio" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="SITIO" id="sitio" />
                    <span>Sítio</span>
                  </label>
                </Card>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <Label>Nível de atividade</Label>
            </div>
            <RadioGroup
              value={profile.nivelAtividade || ''}
              onValueChange={(value) => setProfile(prev => ({ ...prev, nivelAtividade: value as AdopterProfile['nivelAtividade'] }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className={`p-4 cursor-pointer transition-all ${profile.nivelAtividade === 'SEDENTARIO' ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="sedentario" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="SEDENTARIO" id="sedentario" />
                    <span>Sedentário</span>
                  </label>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">Prefiro ficar em casa</p>
                </Card>
                <Card className={`p-4 cursor-pointer transition-all ${profile.nivelAtividade === 'MODERADO' ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="moderado" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="MODERADO" id="moderado" />
                    <span>Moderado</span>
                  </label>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">Caminhadas regulares</p>
                </Card>
                <Card className={`p-4 cursor-pointer transition-all ${profile.nivelAtividade === 'ATIVO' ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="ativo" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="ATIVO" id="ativo" />
                    <span>Ativo</span>
                  </label>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">Exercícios diários</p>
                </Card>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              <Label>Tolerância a barulho</Label>
            </div>
            <RadioGroup
              value={profile.toleranciaBarulho || ''}
              onValueChange={(value) => setProfile(prev => ({ ...prev, toleranciaBarulho: value as AdopterProfile['toleranciaBarulho'] }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className={`p-4 cursor-pointer transition-all ${profile.toleranciaBarulho === 'ALTA' ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="alta" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="ALTA" id="alta" />
                    <span>Alta</span>
                  </label>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">Barulho não me incomoda</p>
                </Card>
                <Card className={`p-4 cursor-pointer transition-all ${profile.toleranciaBarulho === 'BAIXA' ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="baixa" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="BAIXA" id="baixa" />
                    <span>Baixa</span>
                  </label>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">Prefiro ambientes tranquilos</p>
                </Card>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-primary" />
              <Label>Tem crianças em casa?</Label>
            </div>
            <RadioGroup
              value={profile.temCriancas === null ? '' : profile.temCriancas.toString()}
              onValueChange={(value) => setProfile(prev => ({ ...prev, temCriancas: value === 'true' }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className={`p-4 cursor-pointer transition-all ${profile.temCriancas === true ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="criancas-sim" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="true" id="criancas-sim" />
                    <span>Sim</span>
                  </label>
                </Card>
                <Card className={`p-4 cursor-pointer transition-all ${profile.temCriancas === false ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="criancas-nao" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="false" id="criancas-nao" />
                    <span>Não</span>
                  </label>
                </Card>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-primary" />
              <Label>Tem outros pets em casa?</Label>
            </div>
            <RadioGroup
              value={profile.temOutrosPets === null ? '' : profile.temOutrosPets.toString()}
              onValueChange={(value) => setProfile(prev => ({ ...prev, temOutrosPets: value === 'true' }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className={`p-4 cursor-pointer transition-all ${profile.temOutrosPets === true ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="pets-sim" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="true" id="pets-sim" />
                    <span>Sim</span>
                  </label>
                </Card>
                <Card className={`p-4 cursor-pointer transition-all ${profile.temOutrosPets === false ? 'border-2 border-primary' : 'border'}`}>
                  <label htmlFor="pets-nao" className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="false" id="pets-nao" />
                    <span>Não</span>
                  </label>
                </Card>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="w-full"
          size="lg"
        >
          Continuar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Card>
    </div>
  );
}
