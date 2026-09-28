const FORM_STORAGE_PREFIXES = ['stakeholder_draft_', 'activity_draft_'];

export function preserveFormData() {
  const formData: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && FORM_STORAGE_PREFIXES.some((p) => key.startsWith(p))) {
      formData[key] = localStorage.getItem(key) || '';
    }
  }
  return formData;
}

export function restoreFormData(formData: Record<string, string>) {
  Object.entries(formData).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
}
