import type { Sequence } from '@/types';

// Ported 1:1 from the approved Claude Design mockup (const BASE_SEQUENCES).
// Immutable, app-provided sequences — "sample" and/or "saved".
export const BASE_SEQUENCES: Sequence[] = [
  {
    id: 's1',
    title: 'Poranne przebudzenie',
    tags: ['saved'],
    exercises: [
      { name: 'Pozycja góry (Tadasana)', duration: 30 },
      { name: 'Pies z głową w dół (Adho Mukha Svanasana)', duration: 45 },
      { name: 'Wojownik I Prawa (Virabhadrasana I)', duration: 40 },
      { name: 'Trójkąt (Trikonasana)', duration: 40 },
      { name: 'Dziecko (Balasana)', duration: 60 },
    ],
  },
  {
    id: 's3',
    title: 'Wieczorne rozciąganie',
    tags: ['saved'],
    exercises: [
      { name: 'Pozycja kota i krowy (Marjaryasana-Bitilasana)', duration: 40 },
      { name: 'Skrętoskłon leżący Prawa (Supta Matsyendrasana)', duration: 45 },
      { name: 'Pół-mostek (Ardha Setu Bandhasana)', duration: 35 },
      { name: 'Pozycja trupa (Savasana)', duration: 90 },
    ],
  },
  {
    id: 'sv3',
    title: 'Joga dla pleców',
    tags: ['saved'],
    exercises: [
      { name: 'Pozycja kota i krowy (Marjaryasana-Bitilasana)', duration: 40 },
      { name: 'Kobra (Bhujangasana)', duration: 30 },
      { name: 'Łuk (Dhanurasana)', duration: 30 },
      { name: 'Skrętoskłon leżący Prawa (Supta Matsyendrasana)', duration: 45 },
    ],
  },
];

// Starter content for the user's "custom" category (ported from const CUSTOM_SEEDS).
// Unlike BASE_SEQUENCES these are just an editable/removable starting point.
export const CUSTOM_SEEDS: Sequence[] = [
  {
    id: 'c1',
    title: 'Moja sekwencja poranna',
    exercises: [
      { name: 'Pozycja góry (Tadasana)', duration: 30 },
      { name: 'Wojownik I Prawa (Virabhadrasana I)', duration: 40 },
      { name: 'Pozycja krzesła (Utkatasana)', duration: 35 },
      { name: 'Dziecko (Balasana)', duration: 60 },
    ],
  },
  {
    id: 'c2',
    title: 'Szybki reset',
    exercises: [
      { name: 'Deska (Phalakasana)', duration: 30 },
      { name: 'Pozycja krzesła (Utkatasana)', duration: 35 },
      { name: 'Pozycja kota i krowy (Marjaryasana-Bitilasana)', duration: 40 },
    ],
  },
];
