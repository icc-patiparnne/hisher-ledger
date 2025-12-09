import type { Highlighter } from 'shiki';

import { CODE_EDITOR_LANGS, shikiDarkTheme, shikiLightTheme } from './shiki';

class ShikiHighlighterService {
  private highlighter: Highlighter | null = null;
  private initializationPromise: Promise<Highlighter> | null = null;

  async getHighlighter(): Promise<Highlighter> {
    if (this.highlighter) {
      return this.highlighter;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.createHighlighter();
    this.highlighter = await this.initializationPromise;

    return this.highlighter;
  }

  private async createHighlighter(): Promise<Highlighter> {
    const { createHighlighter } = await import('shiki');

    return await createHighlighter({
      themes: [shikiLightTheme, shikiDarkTheme],
      langs: [...CODE_EDITOR_LANGS],
    });
  }

  dispose(): void {
    if (this.highlighter) {
      this.highlighter.dispose();
      this.highlighter = null;
      this.initializationPromise = null;
    }
  }
}

// Export singleton instance
export const shikiHighlighter = new ShikiHighlighterService();
