const store = {
  settings: {
    defaultProfile: true
  },
  setDefaultProfile: (_value: boolean) => {},
};

/**
 * Dummy setting store that replace the use-settings-store.deprecated.ts
 */
export const useSettingsStore = () =>  store;