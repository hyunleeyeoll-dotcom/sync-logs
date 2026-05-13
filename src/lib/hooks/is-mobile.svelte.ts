export class IsMobile {
  current = false;
  #query: MediaQueryList | null = null;

  constructor() {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      this.#query = window.matchMedia("(max-width: 768px)");
      this.current = this.#query.matches;
      const listener = (event: MediaQueryListEvent) => {
        this.current = event.matches;
      };
      this.#query.addEventListener?.("change", listener);
    }
  }

  valueOf() {
    return this.current;
  }
}
