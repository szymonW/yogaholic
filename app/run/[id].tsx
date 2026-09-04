import { useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CastButtonSafe } from '@/cast/CastButtonSafe';
import { EXERCISE_IMAGE_SLUGS } from '@/cast/imageSlugs';
import { buildCastRunPayload, CAST_COMPLETE_MESSAGE } from '@/cast/payload';
import { IconButton, ProgressBar, RingTimer, ScreenBackground } from '@/components';
import { CloseIcon, PauseIcon, PlayIcon, PreviousIcon, SkipIcon } from '@/components/icons';
import { useCastRunChannel } from '@/hooks/useCastRunChannel';
import { useRunTimer } from '@/hooks/useRunTimer';
import { useTranslation } from '@/i18n';
import { useHistoryStore, useSequencesStore, useSettingsStore } from '@/store';
import { colors, spacing, typography } from '@/theme';
import { splitExerciseName } from '@/utils/exercise';
import { goBack } from '@/utils/navigation';
import { formatDuration } from '@/utils/time';

const PREP_BEEP_SOUND = require('../../assets/sounds/Beep Short .mp3');

export default function RunScreen() {
  const t = useTranslation();
  const { id, repeat } = useLocalSearchParams<{ id: string; repeat?: string }>();
  const insets = useSafeAreaInsets();
  const sequence = useSequencesStore((state) => state.getById(id));
  const logSession = useHistoryStore((state) => state.logSession);
  const repeatCount = Math.min(9, Math.max(1, Number.parseInt(repeat ?? '1', 10) || 1));

  const {
    phase,
    runIndex,
    paused,
    exercises,
    currentExercise,
    remainingSeconds,
    exerciseProgress,
    overallProgress,
    togglePause,
    skip,
    previous,
    canGoPrevious,
  } = useRunTimer(sequence, repeatCount);

  const instructorVoiceEnabled = useSettingsStore((state) => state.instructorVoiceEnabled);
  const prepBeep = useAudioPlayer(PREP_BEEP_SOUND);
  const { isCasting, sendRunState } = useCastRunChannel();

  useEffect(() => {
    if (phase !== 'complete' || !sequence) return;
    if (isCasting) sendRunState(CAST_COMPLETE_MESSAGE);
    const durationSeconds = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
    logSession({ sequenceId: sequence.id, durationSeconds, exerciseCount: exercises.length, repeatCount });
    router.replace(repeatCount > 1 ? `/complete/${sequence.id}?repeat=${repeatCount}` : `/complete/${sequence.id}`);
  }, [phase, sequence, exercises, logSession, isCasting, sendRunState, repeatCount]);

  // One beep per counted-down second during "Przygotuj się", plus a single beep the moment
  // the exercise itself starts. Keyed by phase+runIndex(+remainingSeconds during prep) and
  // deduped against the last key we actually beeped for, so re-renders that don't represent
  // a genuinely new second/transition (e.g. an unrelated state change re-running this effect)
  // can never fire an extra beep.
  const lastBeepKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!instructorVoiceEnabled || (phase !== 'prep' && phase !== 'exercise')) return;
    const key = phase === 'prep' ? `prep:${runIndex}:${remainingSeconds}` : `exercise:${runIndex}`;
    if (key === lastBeepKeyRef.current) return;
    lastBeepKeyRef.current = key;
    prepBeep.seekTo(0);
    prepBeep.play();
  }, [phase, runIndex, remainingSeconds, instructorVoiceEnabled, prepBeep]);

  // Mirrors the phone's timer state to the connected Chromecast receiver, once per tick.
  useEffect(() => {
    if (!isCasting || !currentExercise) return;
    sendRunState(
      buildCastRunPayload({
        phase,
        runIndex,
        exerciseCount: exercises.length,
        currentExerciseName: currentExercise.name,
        remainingSeconds,
        exerciseProgress,
        overallProgress,
        imageSlug: EXERCISE_IMAGE_SLUGS[currentExercise.name],
      })
    );
  }, [isCasting, sendRunState, phase, runIndex, exercises.length, currentExercise, remainingSeconds, exerciseProgress, overallProgress]);

  if (!sequence) {
    return (
      <ScreenBackground style={styles.root}>
        <View style={[styles.topBar, { paddingTop: insets.top }]}>
          <IconButton onPress={goBack} accessibilityLabel={t.run.closeA11y}>
            <CloseIcon />
          </IconButton>
        </View>
        <View style={styles.center}>
          <Text style={typography.body}>{t.run.notFound}</Text>
        </View>
      </ScreenBackground>
    );
  }

  if (phase === 'idle' || phase === 'complete' || !currentExercise) {
    return <ScreenBackground style={styles.root} />;
  }

  const localizedName = t.exercises[currentExercise.name] ?? currentExercise.name;
  const { primary, original } = splitExerciseName(localizedName);
  const isPrep = phase === 'prep';

  return (
    <ScreenBackground style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={styles.topBarRow}>
          <IconButton onPress={goBack} accessibilityLabel={t.run.closeA11y}>
            <CloseIcon size={14} />
          </IconButton>
          <Text style={styles.progressLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
            {t.run.progress(runIndex + 1, exercises.length)}
          </Text>
          <CastButtonSafe style={styles.castButton} tintColor={colors.textPrimary} />
        </View>
        <ProgressBar progress={overallProgress} height={4} trackColor={colors.border} style={styles.topProgress} />
      </View>

      <View style={styles.center}>
        <RingTimer
          progress={isPrep ? 0 : exerciseProgress}
          blinkKey={isPrep ? `prep-${remainingSeconds}` : `exercise-${runIndex}`}
        >
          {currentExercise.imageUri ? (
            <Image source={currentExercise.imageUri} style={styles.illustrationImage} resizeMode="cover" />
          ) : (
            <Text style={styles.illustration}>{t.run.illustration(primary.toLowerCase())}</Text>
          )}
        </RingTimer>
        <Text style={styles.exerciseName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
          {primary}
        </Text>
        {original ? (
          <Text style={styles.exerciseOriginal} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
            ({original})
          </Text>
        ) : null}
        <Text style={styles.phaseCaption} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
          {isPrep ? t.run.getReady : t.run.timeRemaining}
        </Text>
        <Text style={styles.timeBig}>{isPrep ? String(remainingSeconds) : formatDuration(remainingSeconds)}</Text>
      </View>

      <View style={styles.controls}>
        <IconButton
          onPress={previous}
          disabled={!canGoPrevious}
          accessibilityLabel={t.run.previousA11y}
          size={52}
          backgroundColor={colors.surfaceAlt}
          style={styles.skipButton}
        >
          <PreviousIcon />
        </IconButton>
        <IconButton
          onPress={togglePause}
          accessibilityLabel={paused ? t.run.resumeA11y : t.run.pauseA11y}
          size={78}
          backgroundColor={colors.accent}
          style={styles.playButton}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </IconButton>
        <IconButton onPress={skip} accessibilityLabel={t.run.skipA11y} size={52} backgroundColor={colors.surfaceAlt} style={styles.skipButton}>
          <SkipIcon />
        </IconButton>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { paddingHorizontal: spacing.xl },
  topBarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  castButton: { width: 36, height: 36 },
  // flexShrink gives adjustsFontSizeToFit a bounded box to shrink within — combined with
  // numberOfLines=1, the whole "Ćwiczenie X z Y" stays on one line and fully visible (shrinking
  // the font instead of wrapping/truncating) even under large accessibility font sizes.
  progressLabel: { fontSize: 14, color: colors.textSecondary, flexShrink: 1, textAlign: 'center' },
  topProgress: { marginTop: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md - 2, paddingHorizontal: spacing.xl },
  illustration: { fontFamily: 'monospace', fontSize: 12, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.lg },
  illustrationImage: { width: '100%', height: '100%' },
  // exerciseName, exerciseOriginal and phaseCaption all use the same one-line-shrink-to-fit
  // treatment as progressLabel above (numberOfLines=1 + adjustsFontSizeToFit) — none of these
  // labels may ever wrap or get cut off mid-word, even under large accessibility font sizes.
  exerciseName: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginTop: spacing.xxs, width: '100%' },
  exerciseOriginal: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', width: '100%' },
  phaseCaption: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', width: '100%' },
  timeBig: { fontSize: 91, fontWeight: '700', color: colors.accent, fontVariant: ['tabular-nums'] },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl + spacing.sm,
  },
  playButton: { shadowColor: colors.accent, shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  skipButton: { borderWidth: 1, borderColor: colors.border },
});
