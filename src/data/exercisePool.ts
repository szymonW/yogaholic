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
  { name: 'Wielbłąd (Ustrasana)', duration: 30, imageUri: require('../../assets/exercises/Camel Pose (Ustrasana).png') },
  {
    name: 'Leżąca pozycja bogini (Supta Baddha Konasana)',
    duration: 60,
    imageUri: require('../../assets/exercises/Leżąca pozycja bogini (Supta Baddha Konasana).png'),
  },
  { name: 'Niski wykrok (Anjaneyasana)', duration: 35, imageUri: require('../../assets/exercises/Niski wykrok (Anjaneyasana).png') },
  {
    name: 'Pozycja pioruna z rozciąganiem boku (Parsva Vajrasana)',
    duration: 35,
    imageUri: require('../../assets/exercises/Pozycja Pioruna z rozciąganiem boku (Parsva Vajrasana).png'),
  },
  { name: 'Pozycja boginii (Utkata Konasana)', duration: 35, imageUri: require('../../assets/exercises/Pozycja boginii (Utkata Konasana).png') },
  { name: 'Pozycja diamentu (Vajrasana)', duration: 60, imageUri: require('../../assets/exercises/Pozycja diamentu (Vajrasana).png') },
  {
    name: 'Pozycja kija na czterech kończynach (Chaturanga Dandasana)',
    duration: 20,
    imageUri: require('../../assets/exercises/Pozycja kija na czterech kończynach (Chaturanga Dandasana).png'),
  },
  { name: 'Pozycja kobry (Bhujangasana)', duration: 30, imageUri: require('../../assets/exercises/Pozycja kobry (Bhujangasana).png') },
  { name: 'Pozycja krokodyla (Makarasana)', duration: 60, imageUri: require('../../assets/exercises/Pozycja krokodyla (Makarasana).png') },
  { name: 'Pozycja mostu (Setu Bandhasana)', duration: 40, imageUri: require('../../assets/exercises/Pozycja mostu (Setu Bandhasana).png') },
  {
    name: 'Pozycja półksiężyca (Ardha Chandrasana)',
    duration: 35,
    imageUri: require('../../assets/exercises/Pozycja półksiężyca (Ardha Chandrasana).png'),
  },
  { name: 'Pozycja pługa (Halasana)', duration: 30, imageUri: require('../../assets/exercises/Pozycja pługa (Halasana).png') },
  { name: 'Pozycja trójkąta (Trikonasana)', duration: 40, imageUri: require('../../assets/exercises/Pozycja trójkąta (Trikonasana).png') },
  { name: 'Pozycja trupa (Savasana)', duration: 90, imageUri: require('../../assets/exercises/Pozycja trupa (Savasana).png') },
  {
    name: 'Pozycja wojownika II (Virabhadrasana II)',
    duration: 40,
    imageUri: require('../../assets/exercises/Pozycja wojownika II (Virabhadrasana II).png'),
  },
  {
    name: 'Pozycja wojownika III (Virabhadrasana III)',
    duration: 30,
    imageUri: require('../../assets/exercises/Pozycja wojownika III (Virabhadrasana III).png'),
  },
  { name: 'Rozciąganie szyi', duration: 30, imageUri: require('../../assets/exercises/Rozciaganie szyi.png') },
  {
    name: 'Skłon w rozkroku (Prasarita Padottanasana)',
    duration: 40,
    imageUri: require('../../assets/exercises/Skłon w rozkroku (Prasarita Padottanasana).png'),
  },
  { name: 'Uniesienie rąk (Urdhva Hastasana)', duration: 20, imageUri: require('../../assets/exercises/Uniesienie rąk (Urdhva Hastasana).png') },
  {
    name: 'Wydłużony kąt boczny (Utthita Parsvakonasana)',
    duration: 40,
    imageUri: require('../../assets/exercises/Wydłużony kąt boczny (Utthita Parsvakonasana).png'),
  },
];
