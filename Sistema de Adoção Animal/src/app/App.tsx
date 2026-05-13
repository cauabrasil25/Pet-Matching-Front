import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { AdopterDashboard } from './components/AdopterDashboard';
import { ShelterDashboard } from './components/ShelterDashboard';
import { initialPets, initialMatches } from './data/mockData';
import type { User, Pet, Match, AdopterProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adopterProfile, setAdopterProfile] = useState<AdopterProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [matches, setMatches] = useState<Match[]>(initialMatches);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // In real app, load user profile from backend if it exists
  };

  const handleQuestionnaireComplete = (profile: AdopterProfile) => {
    setAdopterProfile(profile);
    // In real app, save profile to backend
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleLikePet = (petId: string) => {
    if (!currentUser || currentUser.type !== 'adopter') return;

    // Create a new match with random score between 75-98
    const score = Math.floor(Math.random() * 24) + 75;
    const newMatch: Match = {
      id: `m${Date.now()}`,
      petId,
      adopterName: currentUser.name,
      score,
      status: 'pending',
      timestamp: new Date()
    };

    setMatches(prev => [...prev, newMatch]);
  };

  const handleAddPet = (newPetData: Omit<Pet, 'id' | 'shelter'>) => {
    if (!currentUser || currentUser.type !== 'shelter') return;

    const newPet: Pet = {
      ...newPetData,
      id: `pet${Date.now()}`,
      shelter: currentUser.name
    };

    setPets(prev => [...prev, newPet]);
  };

  const handleApproveMatch = (matchId: string) => {
    setMatches(prev =>
      prev.map(match =>
        match.id === matchId ? { ...match, status: 'approved' as const } : match
      )
    );
  };

  const handleRejectMatch = (matchId: string) => {
    setMatches(prev =>
      prev.map(match =>
        match.id === matchId ? { ...match, status: 'rejected' as const } : match
      )
    );
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (currentUser.type === 'adopter') {
    return (
      <AdopterDashboard
        pets={pets}
        matches={matches.filter(m => m.adopterName === currentUser.name)}
        adopterProfile={adopterProfile}
        onLikePet={handleLikePet}
        onUpdateProfile={handleQuestionnaireComplete}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUser.type === 'shelter') {
    const shelterMatches = matches.filter(match => {
      const pet = pets.find(p => p.id === match.petId);
      return pet?.shelter === currentUser.name;
    });

    return (
      <ShelterDashboard
        shelterName={currentUser.name}
        pets={pets}
        matches={shelterMatches}
        onAddPet={handleAddPet}
        onApproveMatch={handleApproveMatch}
        onRejectMatch={handleRejectMatch}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}