import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { exampleTemplate, exampleData } from "./example";

export interface TemplateDataSource {
  name: string;
  data: Record<string, unknown>;
}

export interface TemplateStore {
  template: string;
  setTemplate: (template: string) => void;
  dataSources: TemplateDataSource[];
  setDataSource: (data_single: Record<string, unknown>, index: number) => void;
  addNewDataSource: () => void;
  changeDataSourceName: (name: string, index: number) => void;
  deleteDataSource: (index: number) => void;
}

// SSR-safe storage: use localStorage in browser, in-memory no-op storage on server
const ssrSafeStorage = createJSONStorage<TemplateStore>(() => {
  if (typeof window !== "undefined" && window?.localStorage) {
    return window.localStorage;
  }
  // simple in-memory fallback to avoid SSR crashes
  const memoryStore: Record<string, string | null> = {};
  return {
    getItem: (name: string) => memoryStore[name] ?? null,
    setItem: (name: string, value: string) => {
      memoryStore[name] = value;
    },
    removeItem: (name: string) => {
      delete memoryStore[name];
    },
  } as Storage;
});

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      template: exampleTemplate,
      setTemplate: (template) => set({ template }),
      dataSources: [{ name: "example", data: exampleData }],
      setDataSource: (data_single, index) =>
        set((state) => {
          const next = [...state.dataSources];
          if (index >= 0 && index < next.length) {
            next[index] = { ...next[index], data: data_single };
          } else {
            next.push({ name: "new", data: data_single });
          }
          return { dataSources: next };
        }),
      addNewDataSource: () =>
        set((state) => ({
          dataSources: [...state.dataSources, { name: "new", data: {} }],
        })),
      changeDataSourceName: (name, index) =>
        set((state) => ({
          dataSources: state.dataSources.map((ds, i) =>
            i === index ? { ...ds, name } : ds
          ),
        })),
      deleteDataSource: (index) =>
        set((state) => ({
          dataSources: state.dataSources.filter((_, i) => i !== index),
        })),
    }),
    {
      name: "template-store",
      storage: ssrSafeStorage,
    }
  )
);
