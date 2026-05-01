import { createContext, useContext } from 'react';

const SmoothScrollContext = createContext({
  anchorOffset: 118,
  isEnabled: false,
  isReducedMotion: false,
  scrollTo: () => {},
  scrollToTop: () => {},
});

function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export { useSmoothScroll };
export default SmoothScrollContext;
