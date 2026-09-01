import { CUSTOM_SEEDS } from '@/data/sampleSequences';
import { selectSequencesForCategory, useSequencesStore } from './sequencesStore';

beforeEach(() => {
  useSequencesStore.setState({ customSequences: CUSTOM_SEEDS, recentIds: [] });
});

describe('selectSequencesForCategory', () => {
  const state = { customSequences: CUSTOM_SEEDS, recentIds: ['s3', 's1', 'c1'] };

  it('returns sample-tagged base sequences for "sample"', () => {
    const result = selectSequencesForCategory('sample', state);
    expect(result.map((s) => s.id)).toEqual(['s5', 's6', 's7']);
  });

  it('returns saved-tagged base sequences for "saved"', () => {
    const result = selectSequencesForCategory('saved', state);
    expect(result.map((s) => s.id).sort()).toEqual(['s1', 's3', 'sv3'].sort());
  });

  it('returns custom sequences for "custom"', () => {
    expect(selectSequencesForCategory('custom', state)).toBe(state.customSequences);
  });

  it('resolves recent ids to sequences, preserving order, across base and custom', () => {
    const result = selectSequencesForCategory('recent', state);
    expect(result.map((s) => s.id)).toEqual(['s3', 's1', 'c1']);
  });

  it('silently drops unknown recent ids', () => {
    const result = selectSequencesForCategory('recent', { ...state, recentIds: ['does-not-exist', 's1'] });
    expect(result.map((s) => s.id)).toEqual(['s1']);
  });
});

describe('useSequencesStore', () => {
  it('starts seeded with CUSTOM_SEEDS and an empty recent list', () => {
    const state = useSequencesStore.getState();
    expect(state.customSequences).toEqual(CUSTOM_SEEDS);
    expect(state.recentIds).toEqual([]);
  });

  it('getById finds base and custom sequences', () => {
    expect(useSequencesStore.getState().getById('s1')?.title).toBe('Poranne przebudzenie');
    expect(useSequencesStore.getState().getById('c1')?.title).toBe('Moja sekwencja poranna');
    expect(useSequencesStore.getState().getById('missing')).toBeUndefined();
  });

  it('addCustomSequence appends a sequence and is retrievable via getById', () => {
    const created = useSequencesStore.getState().addCustomSequence({
      title: 'Testowa sekwencja',
      exercises: [{ name: 'Test', duration: 20 }],
    });
    expect(useSequencesStore.getState().customSequences).toContainEqual(created);
    expect(useSequencesStore.getState().getById(created.id)?.title).toBe('Testowa sekwencja');
  });

  it('updateCustomSequence replaces title and exercises for the targeted sequence only', () => {
    useSequencesStore.getState().updateCustomSequence('c1', {
      title: 'Zaktualizowana nazwa',
      exercises: [{ name: 'Nowa pozycja', duration: 25 }],
    });
    const state = useSequencesStore.getState();
    expect(state.getById('c1')).toEqual({ id: 'c1', title: 'Zaktualizowana nazwa', exercises: [{ name: 'Nowa pozycja', duration: 25 }] });
    expect(state.getById('c2')?.title).toBe('Szybki reset');
  });

  it('updateCustomSequence is a no-op for an unknown id', () => {
    useSequencesStore.getState().updateCustomSequence('missing', { title: 'X', exercises: [] });
    expect(useSequencesStore.getState().customSequences).toEqual(CUSTOM_SEEDS);
  });

  it('removeCustomSequence removes only the targeted sequence', () => {
    useSequencesStore.getState().removeCustomSequence('c1');
    const ids = useSequencesStore.getState().customSequences.map((s) => s.id);
    expect(ids).not.toContain('c1');
    expect(ids).toContain('c2');
  });

  it('pushRecent dedups, orders newest-first, and caps at 5', () => {
    const { pushRecent } = useSequencesStore.getState();
    ['s1', 's2', 's3', 's4', 'sv3', 'c1'].forEach(pushRecent);
    // s1 was pushed first, then bumped again — most recent push wins the front position.
    pushRecent('s1');
    const recentIds = useSequencesStore.getState().recentIds;
    expect(recentIds).toHaveLength(5);
    expect(recentIds[0]).toBe('s1');
    expect(new Set(recentIds).size).toBe(5);
  });
});
