
export const CRISIS_KEYWORDS = [
    'suicide',
    'kill myself',
    'i want to die',
    'end my life',
    'cutting myself',
    'end it all',
    'better off dead',
    'harm myself'
];

export function detectCrisis(text: string): boolean {
    const lowerText = text.toLowerCase();

    // Simple regex for keywords
    // In production, this should be more sophisticated (NLP) or handle negation ("I don't want to die")
    // But for a safety-first local check, inclusive matching is safer.
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
}
