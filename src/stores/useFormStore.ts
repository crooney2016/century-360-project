import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
  validated: boolean;
}

interface FormState {
  fields: Record<string, FormField>;
  isSubmitting: boolean;
  isValid: boolean;

  // Actions
  setField: (name: string, value: string) => void;
  setFieldError: (name: string, error: string | null) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  validateField: (name: string, validator?: (value: string) => string | null) => void;
  validateForm: () => boolean;
  resetField: (name: string) => void;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
}

const createEmptyField = (): FormField => ({
  value: "",
  error: null,
  touched: false,
  validated: false,
});

export const useFormStore = create<FormState>()(
  devtools(
    (set, get) => ({
      fields: {},
      isSubmitting: false,
      isValid: false,

      setField: (name, value) =>
        set(state => ({
          fields: {
            ...state.fields,
            [name]: {
              ...(state.fields[name] || createEmptyField()),
              value,
              touched: true,
            },
          },
        })),

      setFieldError: (name, error) =>
        set(state => ({
          fields: {
            ...state.fields,
            [name]: {
              ...(state.fields[name] || createEmptyField()),
              error,
              validated: true,
            },
          },
        })),

      setFieldTouched: (name, touched) =>
        set(state => ({
          fields: {
            ...state.fields,
            [name]: {
              ...(state.fields[name] || createEmptyField()),
              touched,
            },
          },
        })),

      validateField: (name, validator) => {
        const { fields } = get();
        const field = fields[name];
        if (!field) return;

        const error = validator ? validator(field.value) : null;
        get().setFieldError(name, error);
      },

      validateForm: () => {
        const { fields } = get();
        const isValid = Object.values(fields).every(field => !field.error && field.validated);
        set({ isValid });
        return isValid;
      },

      resetField: name =>
        set(state => ({
          fields: {
            ...state.fields,
            [name]: createEmptyField(),
          },
        })),

      resetForm: () => set({ fields: {}, isValid: false, isSubmitting: false }),

      setSubmitting: isSubmitting => set({ isSubmitting }),
    }),
    { name: "form-store" }
  )
);
