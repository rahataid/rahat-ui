const FORM_STORAGE_PREFIX = 'stakeholder_draft_';

export function preserveFormData() {
  const formData: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(FORM_STORAGE_PREFIX)) {
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
