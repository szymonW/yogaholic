import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ScreenBackground, ScreenHeader, StepButton } from '@/components';
import { DragHandleIcon } from '@/components/icons';
import { useTranslation } from '@/i18n';
import { selectAllExercises, useExercisePoolStore, useSequencesStore } from '@/store';
import { colors, radius, spacing, typography } from '@/theme';
import type { Exercise } from '@/types';
import { goBack } from '@/utils/navigation';
import { formatDuration, formatDurationPadded } from '@/utils/time';

const DURATION_STEP = 5;
const DURATION_MIN = 10;
const ROW_HEIGHT_FALLBACK = 60;

interface EditableItem {
  id: string;
  exercise: Exercise;
}

interface SequenceItemRowProps {
  editableItem: EditableItem;
  isDragging: boolean;
  dragY: Animated.Value;
  onChangeDuration: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragMove: (id: string, dy: number) => void;
  onDragEnd: () => void;
  onMeasureHeight: (height: number) => void;
}

function SequenceItemRow({
  editableItem,
  isDragging,
  dragY,
  onChangeDuration,
  onRemove,
  onDragStart,
  onDragMove,
  onDragEnd,
  onMeasureHeight,
}: SequenceItemRowProps) {
  const t = useTranslation();
  const { id, exercise } = editableItem;
  const name = t.exercises[exercise.name] ?? exercise.name;

  // Created once per row instance (stable key = id) so an in-progress gesture
  // survives the row being reordered to a new index mid-drag.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 2,
      onPanResponderGrant: () => onDragStart(id),
      onPanResponderMove: (_, gestureState) => onDragMove(id, gestureState.dy),
      onPanResponderRelease: onDragEnd,
      onPanResponderTerminate: onDragEnd,
    })
  ).current;

  return (
    <Animated.View
      style={[styles.itemRow, isDragging && styles.itemRowDragging, isDragging && { transform: [{ translateY: dragY }] }]}
      onLayout={(e) => onMeasureHeight(e.nativeEvent.layout.height)}
    >
      <View {...panResponder.panHandlers} style={styles.dragHandle} accessibilityLabel={t.create.moveA11y(name)}>
        <DragHandleIcon />
      </View>
      <Text style={styles.itemName}>{name}</Text>
      <StepButton label="−" onStep={() => onChangeDuration(id, -DURATION_STEP)} />
      <Text style={styles.itemTime}>{formatDuration(exercise.duration)}</Text>
      <StepButton label="+" onStep={() => onChangeDuration(id, DURATION_STEP)} />
      <Pressable onPress={() => onRemove(id)} accessibilityLabel={t.create.removeA11y(name)} style={styles.removeButton}>
        <Text style={styles.removeLabel}>×</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function CreateSequenceScreen() {
  const t = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const customExercises = useExercisePoolStore((state) => state.customExercises);
  const addCustomSequence = useSequencesStore((state) => state.addCustomSequence);
  const updateCustomSequence = useSequencesStore((state) => state.updateCustomSequence);
  const existingSequence = useSequencesStore((state) => (id ? state.getById(id) : undefined));
  const pool = selectAllExercises({ customExercises });

  const idCounter = useRef(0);
  const makeId = () => `item-${Date.now()}-${idCounter.current++}`;

  const [name, setName] = useState(existingSequence?.title ?? '');
  const [items, setItems] = useState<EditableItem[]>(() => (existingSequence?.exercises ?? []).map((exercise) => ({ id: makeId(), exercise })));
  const [pickerOpen, setPickerOpen] = useState(false);

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragY = useRef(new Animated.Value(0)).current;
  const rowHeightRef = useRef(ROW_HEIGHT_FALLBACK);
  const startIndexRef = useRef(0);
  const currentIndexRef = useRef(0);
  const totalRef = useRef(0);
  const draggingIdRef = useRef<string | null>(null);

  const canSave = name.trim().length > 0 && items.length > 0;
  const totalSeconds = items.reduce((sum, it) => sum + it.exercise.duration, 0);
  const addedCounts = items.reduce<Record<string, number>>((counts, it) => {
    counts[it.exercise.name] = (counts[it.exercise.name] ?? 0) + 1;
    return counts;
  }, {});

  const addFromPool = (exercise: Exercise) =>
    setItems((prev) => [...prev, { id: makeId(), exercise: { name: exercise.name, duration: exercise.duration, imageUri: exercise.imageUri } }]);

  const changeDuration = useCallback(
    (itemId: string, delta: number) =>
      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, exercise: { ...it.exercise, duration: Math.max(DURATION_MIN, it.exercise.duration + delta) } } : it
        )
      ),
    []
  );
  const removeItem = useCallback((itemId: string) => setItems((prev) => prev.filter((it) => it.id !== itemId)), []);

  const handleMeasureHeight = useCallback((height: number) => {
    if (height > 0) rowHeightRef.current = height + spacing.sm;
  }, []);

  const handleDragStart = useCallback((itemId: string) => {
    const index = itemsRef.current.findIndex((it) => it.id === itemId);
    if (index === -1) return;
    startIndexRef.current = index;
    currentIndexRef.current = index;
    totalRef.current = itemsRef.current.length;
    draggingIdRef.current = itemId;
    dragY.setValue(0);
    setDraggingId(itemId);
  }, [dragY]);

  const handleDragMove = useCallback(
    (itemId: string, dy: number) => {
      if (draggingIdRef.current !== itemId) return;
      const step = rowHeightRef.current;
      const rawIndex = startIndexRef.current + dy / step;
      const newIndex = Math.min(Math.max(Math.round(rawIndex), 0), totalRef.current - 1);
      dragY.setValue(dy - (newIndex - startIndexRef.current) * step);

      if (newIndex !== currentIndexRef.current) {
        const from = currentIndexRef.current;
        currentIndexRef.current = newIndex;
        setItems((prev) => {
          const next = [...prev];
          const [moved] = next.splice(from, 1);
          next.splice(newIndex, 0, moved);
          return next;
        });
      }
    },
    [dragY]
  );

  const handleDragEnd = useCallback(() => {
    draggingIdRef.current = null;
    Animated.timing(dragY, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    setDraggingId(null);
  }, [dragY]);

  const handleSave = () => {
    if (!canSave) return;
    const exercises = items.map((it) => it.exercise);
    if (isEditing && id) {
      updateCustomSequence(id, { title: name.trim(), exercises });
    } else {
      addCustomSequence({ title: name.trim(), exercises });
    }
    goBack();
  };

  if (isEditing && !existingSequence) {
    return (
      <ScreenBackground style={styles.root}>
        <ScreenHeader title={t.create.editTitle} size="h2" onBack={goBack} />
        <View style={styles.notFound}>
          <Text style={typography.body}>{t.create.notFound}</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground style={styles.root}>
      <ScreenHeader
        title={`${isEditing ? t.create.editTitle : t.create.newTitle} (${formatDurationPadded(totalSeconds)})`}
        size="h2"
        onBack={goBack}
      />

      <ScrollView contentContainerStyle={styles.content} scrollEnabled={draggingId === null}>
        <View style={styles.field}>
          <Text style={styles.label}>{t.create.nameLabel}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t.create.namePlaceholder}
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t.create.positionsLabel(items.length)}</Text>

          {items.map((it) => (
            <SequenceItemRow
              key={it.id}
              editableItem={it}
              isDragging={draggingId === it.id}
              dragY={dragY}
              onChangeDuration={changeDuration}
              onRemove={removeItem}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onMeasureHeight={handleMeasureHeight}
            />
          ))}

          <Button title={t.create.addPosition} variant="secondary" style={styles.dashed} onPress={() => setPickerOpen((v) => !v)} />

          {pickerOpen ? (
            <ScrollView style={styles.picker} nestedScrollEnabled>
              {pool.map((exercise, index) => {
                const addedCount = addedCounts[exercise.name] ?? 0;
                return (
                  <Pressable
                    key={`${exercise.name}-${index}`}
                    onPress={() => addFromPool(exercise)}
                    style={[styles.pickerRow, addedCount > 0 && styles.pickerRowAdded]}
                  >
                    <Text style={styles.pickerName}>{t.exercises[exercise.name] ?? exercise.name}</Text>
                    <View style={styles.pickerRight}>
                      {addedCount > 0 ? <Text style={styles.pickerAdded}>{t.create.addedBadge(addedCount)}</Text> : null}
                      <Text style={styles.pickerTime}>{formatDuration(exercise.duration)}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={isEditing ? t.create.saveChanges : t.create.saveSequence} size="lg" disabled={!canSave} onPress={handleSave} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxs,
    gap: spacing.xl,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontSize: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  itemRowDragging: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  dragHandle: {
    width: 22,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  itemTime: {
    fontSize: 14,
    color: colors.accent,
    minWidth: 40,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLabel: {
    fontSize: 18,
    color: colors.textTertiary,
  },
  dashed: {
    borderStyle: 'dashed',
    borderColor: colors.accentDashed,
    marginTop: spacing.xs,
  },
  picker: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.sm,
    maxHeight: 220,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
  },
  pickerRowAdded: {
    backgroundColor: colors.surface,
  },
  pickerName: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  pickerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pickerAdded: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  pickerTime: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});
