import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application } from '@/types/application';

interface ApplicationState {
  currentApplication: Partial<Application> | null;
  setCurrentApplication: (application: Partial<Application> | null) => void;
  updateCurrentApplication: (data: Partial<Application>) => void;
  clearCurrentApplication: () => void;
  formStep: number;
  setFormStep: (step: number) => void;
  isDocumentUploadComplete: boolean;
  setDocumentUploadComplete: (isComplete: boolean) => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    set => ({
      currentApplication: null,
      setCurrentApplication: application => set({ currentApplication: application }),
      updateCurrentApplication: data =>
        set(state => ({
          currentApplication: state.currentApplication
            ? { ...state.currentApplication, ...data }
            : data,
        })),
      clearCurrentApplication: () => set({ currentApplication: null }),
      formStep: 1,
      setFormStep: step => set({ formStep: step }),
      isDocumentUploadComplete: false,
      setDocumentUploadComplete: isComplete => set({ isDocumentUploadComplete: isComplete }),
    }),
    {
      name: 'application-storage',
      partialize: state => ({
        currentApplication: state.currentApplication,
        formStep: state.formStep,
        isDocumentUploadComplete: state.isDocumentUploadComplete,
      }),
    },
  ),
);
