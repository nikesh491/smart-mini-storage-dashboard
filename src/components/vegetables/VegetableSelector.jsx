import React from 'react';
import { VegetableCard } from './VegetableCard.jsx';

export function VegetableSelector({ profiles = [], activeProfile, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {profiles.map((profile) => (
        <VegetableCard
          key={profile.id}
          profile={profile}
          isActive={activeProfile?.id === profile.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
