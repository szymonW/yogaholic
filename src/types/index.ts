export interface Exercise {
  name: string;
  /** seconds */
  duration: number;
  /** local URI for custom exercises added via the image picker */
  imageUri?: string;
}

export type SequenceTag = 'sample' | 'saved';

export interface Sequence {
  id: string;
  title: string;
  tags?: SequenceTag[];
  exercises: Exercise[];
}

export type SequenceCategory = 'recent' | 'saved' | 'sample' | 'custom';

export interface HistoryEntry {
  id: string;
  sequenceId: string;
  /** ISO date string (yyyy-mm-dd) the session was completed on */
  dateISO: string;
  durationSeconds: number;
  exerciseCount: number;
}

export type CalendarEventStatus = 'done' | 'planned';

export interface DayEvent {
  hour: number;
  minute: number;
  durationMinutes: number;
  status: CalendarEventStatus;
}

export type RunPhase = 'idle' | 'prep' | 'exercise' | 'complete';
