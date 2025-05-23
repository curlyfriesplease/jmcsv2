import type { Settings } from '../App';

export interface Quote {
  text: string;
  isFavourite: boolean;
  isNSFW: boolean;
  source: 'v1' | 'v2';
  id: string;
}

type QuoteArray = [string, number, number];

// We'll load the quotes dynamically to avoid import issues
async function loadQuoteData(): Promise<{
  v1Quotes: QuoteArray[];
  v2Quotes: QuoteArray[];
}> {
  try {
    const v1Module = await import('../quotes/v1quotes.js');
    const v2Module = await import('../quotes/v2quotes.js');
    return {
      v1Quotes: v1Module.quoteList || [],
      v2Quotes: v2Module.quoteList || [],
    };
  } catch (error) {
    console.error('Error loading quote data:', error);
    // Fallback data for testing
    return {
      v1Quotes: [
        ['Sample quote 1', 0, 0],
        ['Sample quote 2', 1, 0],
        ['Sample NSFW quote', 0, 1],
      ],
      v2Quotes: [
        ['Sample v2 quote 1', 0, 0],
        ['Sample v2 quote 2', 0, 0],
      ],
    };
  }
}

class QuotesManager {
  private allQuotes: Quote[] = [];
  private seenQuoteIds: Set<string> = new Set();
  private availableQuotes: Quote[] = [];
  private isLoaded = false;

  constructor() {
    this.loadSeenQuotes();
    this.loadQuotes();
  }

  private async loadQuotes() {
    const { v1Quotes, v2Quotes } = await loadQuoteData();

    // Convert v1 quotes
    const v1QuotesFormatted: Quote[] = v1Quotes.map(
      (quote: QuoteArray, index: number) => ({
        text: quote[0],
        isFavourite: quote[1] === 1,
        isNSFW: quote[2] === 1,
        source: 'v1' as const,
        id: `v1-${index}`,
      })
    );

    // Convert v2 quotes
    const v2QuotesFormatted: Quote[] = v2Quotes.map(
      (quote: QuoteArray, index: number) => ({
        text: quote[0],
        isFavourite: quote[1] === 1,
        isNSFW: quote[2] === 1,
        source: 'v2' as const,
        id: `v2-${index}`,
      })
    );

    this.allQuotes = [...v1QuotesFormatted, ...v2QuotesFormatted];
    this.isLoaded = true;
  }

  private loadSeenQuotes() {
    const seenQuotes = localStorage.getItem('seen-quotes');
    if (seenQuotes) {
      this.seenQuoteIds = new Set(JSON.parse(seenQuotes));
    }
  }

  private saveSeenQuotes() {
    localStorage.setItem(
      'seen-quotes',
      JSON.stringify(Array.from(this.seenQuoteIds))
    );
  }

  public updateAvailableQuotes(settings: Settings) {
    if (!this.isLoaded) return;

    let filtered = this.allQuotes;

    // Filter out v1 quotes if setting is enabled
    if (settings.excludeV1Quotes) {
      filtered = filtered.filter((quote) => quote.source !== 'v1');
    }

    // Filter out NSFW quotes if setting is enabled
    if (settings.removeNSFWQuotes) {
      filtered = filtered.filter((quote) => !quote.isNSFW);
    }

    // Remove already seen quotes
    this.availableQuotes = filtered.filter(
      (quote) => !this.seenQuoteIds.has(quote.id)
    );
  }

  public getRandomQuote(): Quote | null {
    if (!this.isLoaded || this.availableQuotes.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.availableQuotes.length);
    const selectedQuote = this.availableQuotes[randomIndex];

    // Mark as seen
    this.seenQuoteIds.add(selectedQuote.id);
    this.saveSeenQuotes();

    // Remove from available quotes
    this.availableQuotes.splice(randomIndex, 1);

    return selectedQuote;
  }

  public restoreAllQuotes() {
    // Clear seen quotes
    this.seenQuoteIds.clear();
    localStorage.removeItem('seen-quotes');
    // Reset available quotes to all quotes
    this.availableQuotes = [...this.allQuotes];
  }

  public getRemainingCount(): number {
    return this.availableQuotes.length;
  }

  public getTotalCount(): number {
    return this.allQuotes.length;
  }

  public getSeenCount(): number {
    return this.seenQuoteIds.size;
  }

  public isReady(): boolean {
    return this.isLoaded;
  }
}

export const quotesManager = new QuotesManager();
