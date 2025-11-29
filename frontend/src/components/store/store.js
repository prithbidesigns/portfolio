import { create } from "zustand";

const useStore = create((set) => ({
  menuState: false,
  canvasLoaded: false,
  firstLoad: false,
  activeTimeline: 0,
  locomotiveScroll: null,
  toggleMenu: () => set((state) => ({ ...state, menuState: !state.menuState })),
  setCanvasLoaded: () => set((state) => ({ ...state, canvasLoaded: true })),
  setFirstLoaded: () => set((state) => ({ ...state, firstLoad: true })),
  setLocomotiveScroll: (scroll) =>
    set((state) => ({ ...state, locomotiveScroll: scroll })),
  setActiveTimeline: (newTimeline) =>
    set((state) => ({ ...state, activeTimeline: newTimeline })),
}));

export const getMenuState = (state) => state.menuState;
export const getActiveTimeline = (state) => state.activeTimeline;
export const getCanvasLoaded = (state) => state.canvasLoaded;
export const getFirstLoad = (state) => state.firstLoad;
export const getLocomotiveScroll = (state) => state.locomotiveScroll;

export default useStore;
