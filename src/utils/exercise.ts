/** Splits "Pozycja góry (Tadasana)" into the Polish name and the parenthesized original. */
export function splitExerciseName(name: string): { primary: string; original?: string } {
  const match = name.match(/^(.*?)\s*\((.*)\)\s*$/);
  if (!match) return { primary: name };
  return { primary: match[1], original: match[2] };
}
