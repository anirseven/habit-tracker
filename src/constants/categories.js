export const CATEGORIES = [
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#4caf50' },
  { id: 'work', name: 'Work & Productivity', icon: '💼', color: '#2196f3' },
  { id: 'learning', name: 'Learning & Growth', icon: '📚', color: '#9c27b0' },
  { id: 'personal', name: 'Personal Care', icon: '🧘', color: '#ff9800' },
  { id: 'social', name: 'Social & Family', icon: '👥', color: '#e91e63' },
  { id: 'finance', name: 'Finance & Money', icon: '💰', color: '#009688' },
  { id: 'hobbies', name: 'Hobbies & Fun', icon: '🎨', color: '#f44336' },
  { id: 'other', name: 'Other', icon: '📌', color: '#607d8b' },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
