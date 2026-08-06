import type { Exercise } from '@/types';

// Seed pool of selectable exercises (name in Polish with Sanskrit original in parentheses),
// ported 1:1 from the approved Claude Design mockup (const POOL).
export const EXERCISE_POOL: Exercise[] = [
  { name: 'Pozycja góry (Tadasana)', duration: 30 },
  { name: 'Pies z głową w dół (Adho Mukha Svanasana)', duration: 45 },
  { name: 'Wojownik I (Virabhadrasana I)', duration: 40 },
  { name: 'Wojownik II (Virabhadrasana II)', duration: 40 },
  { name: 'Trójkąt (Trikonasana)', duration: 40 },
  { name: 'Deska (Phalakasana)', duration: 30 },
  { name: 'Kobra (Bhujangasana)', duration: 30 },
  { name: 'Dziecko (Balasana)', duration: 60 },
  { name: 'Drzewo (Vrksasana)', duration: 30 },
  { name: 'Pozycja krzesła (Utkatasana)', duration: 35 },
  { name: 'Pozycja trupa (Savasana)', duration: 90 },
  { name: 'Skrętoskłon leżący (Supta Matsyendrasana)', duration: 45 },
];
