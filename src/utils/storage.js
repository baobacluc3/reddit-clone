import { seedData } from '../data/seed';

const KEY = 'reddit_clone_data';

export const loadData = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(raw);
};

export const saveData = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};
