import type { Locale } from '../../types';

type LanguageOption = { id: number; label: string; value: Locale };

export const languages: LanguageOption[] = [
  { id: 1, label: 'EN', value: 'en' },
  { id: 2, label: 'DE', value: 'de' },
  { id: 3, label: 'RU', value: 'ru' },
];

type Translation = {
  table: string;
  gallery: string;
  seed: string;
  likes: string;
  random: string;
  language: string;
  subtitle: string;
  theme: string;
};

export const translations: Record<Locale, Translation> = {
  en: {
    table: 'Table',
    gallery: 'Gallery',
    seed: 'Seed',
    likes: 'Likes',
    random: 'Random seed',
    language: 'Language',
    subtitle: 'Endless generated tracks',
    theme: 'Toggle theme',
  },
  de: {
    table: 'Tabelle',
    gallery: 'Galerie',
    seed: 'Seed',
    likes: 'Likes',
    random: 'Zufälliger Seed',
    language: 'Sprache',
    subtitle: 'Endlos generierte Titel',
    theme: 'Thema wechseln',
  },
  ru: {
    table: 'Таблица',
    gallery: 'Галерея',
    seed: 'Сид',
    likes: 'Лайки',
    random: 'Случайный сид',
    language: 'Язык',
    subtitle: 'Бесконечная генерация треков',
    theme: 'Сменить тему',
  },
};
