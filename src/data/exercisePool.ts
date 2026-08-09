import type { Exercise } from '@/types';

// Seed pool of selectable exercises (name in Polish with Sanskrit original in parentheses),
// ported 1:1 from the approved Claude Design mockup (const POOL).
export const EXERCISE_POOL: Exercise[] = [
  { name: 'Pozycja góry (Tadasana)', duration: 30, imageUri: require('../../assets/exercises/Mountain Pose (Tadasana).png') },
  { name: 'Pies z głową w dół (Adho Mukha Svanasana)', duration: 45, imageUri: require('../../assets/exercises/dog.png') },
  { name: 'Wojownik I (Virabhadrasana I)', duration: 40, imageUri: require('../../assets/exercises/Warrior I (Virabhadrasana I).png') },
  { name: 'Dziecko (Balasana)', duration: 60, imageUri: require("../../assets/exercises/Child's Pose (Balasana).png") },
  { name: 'Drzewo (Vrksasana)', duration: 30, imageUri: require('../../assets/exercises/Tree Pose (Vrksasana).png') },
  {
    name: 'Skrętoskłon leżący (Supta Matsyendrasana)',
    duration: 45,
    imageUri: require('../../assets/exercises/skretosklon lezacy (supta matsyendrasana).png'),
  },
  { name: 'Przysiad jogina (Malasana)', duration: 40, imageUri: require('../../assets/exercises/Malasana.png') },
  { name: 'Siad skrzyżny (Sukhasana)', duration: 60, imageUri: require('../../assets/exercises/siad_skrzyzny.png') },
  {
    name: 'Pozycja kota i krowy (Marjaryasana-Bitilasana)',
    duration: 40,
    imageUri: require('../../assets/exercises/Cat-Cow (Marjaryasana–Bitilasana).png'),
  },
  {
    name: 'Pies z głową w górę (Urdhva Mukha Svanasana)',
    duration: 40,
    imageUri: require('../../assets/exercises/Pies z głową w górę (Urdhva Mukha Svanasana).png'),
  },
  { name: 'Skłon w przód (Uttanasana)', duration: 35, imageUri: require('../../assets/exercises/Skłon w przód (Uttanasana).png') },
  {
    name: 'Szczęśliwe dziecko (Ananda Balasana)',
    duration: 45,
    imageUri: require('../../assets/exercises/Szczęśliwe dziecko (Ananda Balasana).png'),
  },
];
