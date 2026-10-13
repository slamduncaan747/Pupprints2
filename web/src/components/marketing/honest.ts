/**
 * We are a new brand with no sales history, so any catalog copy that claims popularity or demand
 * ("best-selling", "most popular", "most gifted") is dropped before it reaches a page.
 */
const UNVERIFIABLE = /best-?sell|most[- ](requested|popular|gifted|loved)|everyone asks|customers love|bestseller|fan favou?rite/i;

export function isUnverifiable(text: string) {
  return UNVERIFIABLE.test(text);
}

/** Removes sentences that make unverifiable popularity claims. */
export function honestText(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !UNVERIFIABLE.test(sentence))
    .join(" ");
}
