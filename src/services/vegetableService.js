import { apiClient } from './api.js';
import { vegetableProfiles } from '../data/vegetableData.js';

let activeProfileId = 'carrot';

export const vegetableService = {
  getProfiles: async () => {
    const remoteData = await apiClient.get('/vegetables');
    if (remoteData) return remoteData;
    return vegetableProfiles;
  },

  getActiveProfile: async () => {
    const remoteData = await apiClient.get('/vegetables/active');
    if (remoteData) return remoteData;
    return vegetableProfiles.find(v => v.id === activeProfileId) || vegetableProfiles[0];
  },

  selectProfile: async (profileId) => {
    activeProfileId = profileId;
    const selected = vegetableProfiles.find(v => v.id === profileId);
    await apiClient.post('/vegetables/select', { profileId, profile: selected });
    return selected;
  }
};
