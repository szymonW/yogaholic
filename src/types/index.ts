import type { ImageSourcePropType } from 'react-native';

export interface Exercise {
  name: string;
  /** seconds */
  duration: number;
  /** picker-selected URI for custom exercises, or a bundled asset (require(...)) for seed exercises */
  imageUri?: ImageSourcePropType;
}

export type SequenceTag = 'sample';

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
  /** ms epoch, approximated as completion time minus durationSeconds — used to place the session on the calendar's hourly grid */
  startedAtMs: number;
  durationSeconds: number;
  exerciseCount: number;
  /** Repetition multiplier the sequence was run at (x1–x9); omitted/1 for a normal single run. */
  repeatCount?: number;
}

export type CalendarEventStatus = 'done' | 'planned';

export interface DayEvent {
  hour: number;
  minute: number;
  durationMinutes: number;
  status: CalendarEventStatus;
}

export type RunPhase = 'idle' | 'prep' | 'exercise' | 'complete';
