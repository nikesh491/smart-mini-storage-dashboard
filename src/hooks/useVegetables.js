import { useState, useEffect } from 'react';
import { vegetableService } from '../services/vegetableService.js';

export function useVegetables() {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [allProfiles, active] = await Promise.all([
          vegetableService.getProfiles(),
          vegetableService.getActiveProfile()
        ]);
        setProfiles(allProfiles);
        setActiveProfile(active);
      } catch (err) {
        console.error('Error loading vegetables:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectVegetable = async (profileId) => {
    try {
      const selected = await vegetableService.selectProfile(profileId);
      setActiveProfile(selected);
      return selected;
    } catch (err) {
      console.error('Failed to select profile:', err);
    }
  };

  return {
    profiles,
    activeProfile,
    selectVegetable,
    loading,
  };
}
