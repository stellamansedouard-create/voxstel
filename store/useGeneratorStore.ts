import { create } from "zustand";
import type {
  Category,
  AITool,
  DirectQuestion,
  PreviousQAItem,
  ImageReference,
  TextReference,
  GeneratedPrompt,
  GeneratorState,
  GeneratorStep,
} from "@/types";

interface GeneratorActions {
  setCategory: (category: Category) => void;
  setUseCase: (useCase: string) => void;
  setTool: (tool: AITool) => void;
  setDescription: (description: string) => void;
  setUsageContext: (usageContext: string) => void;
  setAdaptiveData: (data: { directQuestions: DirectQuestion[] }) => void;
  setDirectAnswer: (id: string, value: string) => void;
  setRefinePrecisionData: (questions: DirectQuestion[]) => void;
  setRefinePrecisionAnswer: (id: string, value: string) => void;
  setRefinementData: (data: {
    previousQA: PreviousQAItem[];
    newDirectQuestions: DirectQuestion[];
  }) => void;
  // Image reference
  setImageReference: (ref: ImageReference) => void;
  toggleImageAspect: (id: string) => void;
  clearImageReference: () => void;
  // Text reference
  setTextReference: (ref: TextReference) => void;
  toggleTextAspect: (id: string) => void;
  clearTextReference: () => void;
  setGeneratedPrompt: (prompt: GeneratedPrompt) => void;
  setStep: (step: GeneratorStep) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  restartDescription: () => void;
  reset: () => void;
  goBack: () => void;
  restoreState: (state: Partial<ExtendedState>) => void;
}

interface ExtendedState extends GeneratorState {
  refinementCount: number;
  refinePrecisionQuestions: DirectQuestion[];
  refinePrecisionAnswers: Record<string, string>;
  hasUsedRefinePrecision: boolean;
}

const initialState: ExtendedState = {
  category: null,
  useCase: null,
  tool: null,
  description: "",
  usageContext: "",
  directQuestions: [],
  directAnswers: {},
  previousQA: [],
  isRefinement: false,
  imageReference: null,
  textReference: null,
  generatedPrompt: null,
  step: "category",
  isLoading: false,
  error: null,
  refinementCount: 0,
  refinePrecisionQuestions: [],
  refinePrecisionAnswers: {},
  hasUsedRefinePrecision: false,
};

const STEP_ORDER: GeneratorStep[] = [
  "category",
  "usecase",
  "tool",
  "description",
  "adaptive",
  "result",
];

export const useGeneratorStore = create<ExtendedState & GeneratorActions>(
  (set, get) => ({
    ...initialState,

    setCategory: (category) =>
      set({
        category,
        step: "usecase",
        useCase: null,
        tool: null,
        description: "",
        usageContext: "",
        directQuestions: [],
        directAnswers: {},
        previousQA: [],
        isRefinement: false,
        imageReference: null,
        textReference: null,
        generatedPrompt: null,
        refinementCount: 0,
        refinePrecisionQuestions: [],
        refinePrecisionAnswers: {},
        hasUsedRefinePrecision: false,
        error: null,
      }),

    setUseCase: (useCase) =>
      set({
        useCase,
        step: "tool",
        tool: null,
        description: "",
        usageContext: "",
        directQuestions: [],
        directAnswers: {},
        previousQA: [],
        isRefinement: false,
        generatedPrompt: null,
        refinementCount: 0,
        refinePrecisionQuestions: [],
        refinePrecisionAnswers: {},
        hasUsedRefinePrecision: false,
        error: null,
      }),

    setTool: (tool) =>
      set({
        tool,
        step: "description",
        description: "",
        usageContext: "",
        directQuestions: [],
        directAnswers: {},
        previousQA: [],
        isRefinement: false,
        generatedPrompt: null,
        refinementCount: 0,
        refinePrecisionQuestions: [],
        refinePrecisionAnswers: {},
        hasUsedRefinePrecision: false,
        error: null,
      }),

    setDescription: (description) => set({ description }),
    setUsageContext: (usageContext) => set({ usageContext }),

    setAdaptiveData: (data) =>
      set({
        directQuestions: data.directQuestions,
        step: "adaptive",
        isRefinement: false,
        previousQA: [],
        refinePrecisionQuestions: [],
        refinePrecisionAnswers: {},
        hasUsedRefinePrecision: false,
        error: null,
      }),

    setDirectAnswer: (id, value) =>
      set((state) => ({
        directAnswers: { ...state.directAnswers, [id]: value },
      })),

    setRefinePrecisionData: (questions) =>
      set({
        refinePrecisionQuestions: questions,
        refinePrecisionAnswers: {},
        hasUsedRefinePrecision: true,
      }),

    setRefinePrecisionAnswer: (id, value) =>
      set((state) => ({
        refinePrecisionAnswers: { ...state.refinePrecisionAnswers, [id]: value },
      })),

    setRefinementData: (data) =>
      set((state) => ({
        previousQA: data.previousQA,
        directQuestions: data.newDirectQuestions,
        refinementCount: state.refinementCount + 1,
        step: "adaptive",
        isRefinement: true,
        generatedPrompt: null,
        refinePrecisionQuestions: [],
        refinePrecisionAnswers: {},
        hasUsedRefinePrecision: false,
        error: null,
      })),

    setImageReference: (ref) => set({ imageReference: ref }),
    toggleImageAspect: (id) =>
      set((state) => {
        if (!state.imageReference) return {};
        const selected = state.imageReference.selectedAspectIds;
        const next = selected.includes(id)
          ? selected.filter((x) => x !== id)
          : [...selected, id];
        return { imageReference: { ...state.imageReference, selectedAspectIds: next } };
      }),
    clearImageReference: () => set({ imageReference: null }),

    setTextReference: (ref) => set({ textReference: ref }),
    toggleTextAspect: (id) =>
      set((state) => {
        if (!state.textReference) return {};
        const selected = state.textReference.selectedAspectIds;
        const next = selected.includes(id)
          ? selected.filter((x) => x !== id)
          : [...selected, id];
        return { textReference: { ...state.textReference, selectedAspectIds: next } };
      }),
    clearTextReference: () => set({ textReference: null }),

    setGeneratedPrompt: (prompt) =>
      set({ generatedPrompt: prompt, step: "result", error: null }),

    setStep: (step) => set({ step }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    restartDescription: () =>
      set((state) => ({
        description: "",
        usageContext: "",
        directQuestions: [],
        directAnswers: {},
        previousQA: [],
        isRefinement: false,
        generatedPrompt: null,
        step: "description",
        refinementCount: 0,
        refinePrecisionQuestions: [],
        refinePrecisionAnswers: {},
        hasUsedRefinePrecision: false,
        error: null,
        isLoading: false,
        category: state.category,
        useCase: state.useCase,
        tool: state.tool,
        imageReference: state.imageReference,
        textReference: state.textReference,
      })),

    reset: () => set(initialState),

    restoreState: (state) => set(state),

    goBack: () => {
      const { step } = get();
      const currentIndex = STEP_ORDER.indexOf(step);
      if (currentIndex > 0) {
        set({ step: STEP_ORDER[currentIndex - 1], error: null, isLoading: false });
      }
    },
  })
);
