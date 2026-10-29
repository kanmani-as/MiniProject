export function getSavedEventIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('utsav_saved_events');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isEventSaved(eventId: string): boolean {
  const list = getSavedEventIds();
  return list.includes(eventId);
}

export function toggleSaveEvent(eventId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getSavedEventIds();
    let updated: string[];
    let isSaved: boolean;
    if (list.includes(eventId)) {
      updated = list.filter(id => id !== eventId);
      isSaved = false;
    } else {
      updated = [...list, eventId];
      isSaved = true;
    }
    localStorage.setItem('utsav_saved_events', JSON.stringify(updated));
    window.dispatchEvent(new Event('utsav_bookmarks_changed'));
    return isSaved;
  } catch {
    return false;
  }
}

export function getSavedPasses(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('utsav_my_passes');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePassLocally(pass: any) {
  if (typeof window === 'undefined') return;
  try {
    const current = getSavedPasses();
    const updated = [pass, ...current.filter((p: any) => p.id !== pass.id)];
    localStorage.setItem('utsav_my_passes', JSON.stringify(updated));
    window.dispatchEvent(new Event('utsav_passes_changed'));
  } catch (e) {
    console.error(e);
  }
}
