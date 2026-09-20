import React from 'react';
import { Carrot, Sparkles } from 'lucide-react';
import { VegetableSelector } from '../components/vegetables/VegetableSelector.jsx';
import { StorageProfile } from '../components/vegetables/StorageProfile.jsx';
import { useVegetables } from '../hooks/useVegetables.js';
import { Loading } from '../components/common/Loading.jsx';

export function VegetablesPage() {
  const { profiles, activeProfile, selectVegetable, loading } = useVegetables();

  if (loading) {
    return <Loading text="Loading Vegetable Target Profiles..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
            <Carrot className="w-6 h-6 text-teal-400" />
            Vegetable Storage Profiles
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure optimal micro-climate environmental targets for automated ESP32 control.
          </p>
        </div>
      </div>

      {/* Active Profile Target Detailed View */}
      <StorageProfile profile={activeProfile} />

      {/* All Vegetable Profiles Selection Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          SELECT TARGET CROP PROFILE
        </h3>

        <VegetableSelector
          profiles={profiles}
          activeProfile={activeProfile}
          onSelect={selectVegetable}
        />
      </div>
    </div>
  );
}
