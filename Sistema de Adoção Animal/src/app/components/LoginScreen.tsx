import { useState } from 'react';
import { Heart, PawPrint, LogIn, UserPlus, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'adopter' | 'shelter'>('adopter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [shelterName, setShelterName] = useState('');

  const passwordRules = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = passwordRules.minLength && passwordRules.hasNumber && passwordRules.hasSpecialChar;
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    if (mode === 'signup') {
      if (!isPasswordValid || !passwordsMatch) return;
    }

    // Simulate login/signup - backend would handle authentication and return user data with role
    const userName = userType === 'adopter' ? name : shelterName;

    onLogin({
      type: userType,
      name: userName || email.split('@')[0]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-destructive" />
            <h1>AdoPet</h1>
          </div>
          <p className="text-muted-foreground">
            Conectando pets e adotantes através de matching inteligente
          </p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <Label>Tipo de usuário</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      userType === 'adopter'
                        ? 'border-2 border-primary bg-primary/5'
                        : 'border hover:border-primary/50'
                    }`}
                    onClick={() => setUserType('adopter')}
                  >
                    <div className="text-center space-y-2">
                      <Heart className={`w-6 h-6 mx-auto ${userType === 'adopter' ? 'text-destructive' : 'text-muted-foreground'}`} />
                      <div>
                        <p>Adotante</p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      userType === 'shelter'
                        ? 'border-2 border-primary bg-primary/5'
                        : 'border hover:border-primary/50'
                    }`}
                    onClick={() => setUserType('shelter')}
                  >
                    <div className="text-center space-y-2">
                      <PawPrint className={`w-6 h-6 mx-auto ${userType === 'shelter' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p>Abrigo</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {userType === 'adopter' ? (
                <div className="space-y-2">
                  <Label htmlFor="adopter-name">Nome completo</Label>
                  <Input
                    id="adopter-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="shelter-name">Nome do abrigo</Label>
                  <Input
                    id="shelter-name"
                    value={shelterName}
                    onChange={(e) => setShelterName(e.target.value)}
                    placeholder="Digite o nome do abrigo"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {password && (
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">A senha deve conter:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {passwordRules.minLength ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={passwordRules.minLength ? 'text-green-600' : 'text-muted-foreground'}>
                        Mínimo 8 caracteres
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRules.hasNumber ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={passwordRules.hasNumber ? 'text-green-600' : 'text-muted-foreground'}>
                        Pelo menos um número
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRules.hasSpecialChar ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={passwordRules.hasSpecialChar ? 'text-green-600' : 'text-muted-foreground'}>
                        Pelo menos um caractere especial (!@#$%^&*)
                      </span>
                    </div>
                    {confirmPassword && (
                      <div className="flex items-center gap-2">
                        {passwordsMatch ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-destructive" />
                        )}
                        <span className={passwordsMatch ? 'text-green-600' : 'text-destructive'}>
                          As senhas coincidem
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={mode === 'signup' && (!isPasswordValid || !passwordsMatch)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Criar conta
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4 border-t border-border">
          <p className="text-muted-foreground">
            Sistema de adoção com matching inteligente
          </p>
        </div>
      </Card>
    </div>
  );
}
