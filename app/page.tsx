'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

type Language = 'EN' | 'RU' | 'UZ' | 'JP';
type RegistrationChannel = 'email' | 'telegram';
type Accent = 'violet' | 'orange' | 'blue' | 'green' | 'pink';
type View = 'overview' | 'projects' | 'categories' | 'review';
type DetailTab = 'overview' | 'questions' | 'board';

type Project = {
  id: string;
  title: string;
  owner: string;
  category: string;
  status: 'Published' | 'Draft';
  description: string;
  tags: string[];
  accent: Accent;
  updated: string;
  views: string;
  features: string[];
  demoUrl: string;
  coverUrl?: string;
};

type BoardColumn = 'todo' | 'progress' | 'done';

type BoardItem = {
  id: string;
  projectId: string;
  column: BoardColumn;
  title: string;
  detail: string;
};

type Profile = {
  name: string;
  handle: string;
  role: string;
  track: string;
  bio: string;
  avatar: string;
  avatarUrl?: string;
};

const initialProfile: Profile = {
  name: 'JDU Creative Lab',
  handle: '@jdu-creator',
  role: 'Student creator',
  track: '',
  bio: '',
  avatar: 'JD',
};

type Question = {
  id: string;
  author: string;
  initials: string;
  role: string;
  time: string;
  text: string;
  answer?: {
    author: string;
    initials: string;
    text: string;
  };
};

type Review = {
  id: string;
  projectId: string;
  project: string;
  author: string;
  initials: string;
  role: string;
  rating: number;
  text: string;
};

const initialProjects: Project[] = [
  {
    id: '01',
    title: 'Nihongo Talk Trainer',
    owner: 'Akari Karimova',
    category: 'Learning systems',
    status: 'Published',
    description: 'A warm, practical space where Japanese learners can practice real conversations and keep their progress.',
    tags: ['Web app', 'Education', 'Japanese'],
    accent: 'violet',
    updated: '2 hours ago',
    views: '1.2k',
    features: ['Scenario-based practice', 'Pronunciation feedback', 'Learning history', 'Teacher workspace'],
    demoUrl: '',
  },
  {
    id: '02',
    title: 'Osh Table',
    owner: 'Muhammad Rakhimov',
    category: 'Community tools',
    status: 'Published',
    description: 'A multilingual restaurant guide built from local voices, useful maps, and stories worth sharing.',
    tags: ['Reviews', 'Map', 'Local'],
    accent: 'orange',
    updated: 'Yesterday',
    views: '846',
    features: ['Restaurant profiles', 'Community reviews', 'Photo + map context', 'Search and filters'],
    demoUrl: '',
  },
  {
    id: '03',
    title: 'JDU Open Archive',
    owner: 'Sardor Yusupov',
    category: 'Culture + code',
    status: 'Published',
    description: 'A living index of student-made systems, design experiments, and the next version of Tashkent.',
    tags: ['Portfolio', 'Archive', 'Multi-language'],
    accent: 'blue',
    updated: '3 days ago',
    views: '2.4k',
    features: ['Project stories', 'External links', 'Questions + board', 'Four-language UI'],
    demoUrl: '',
  },
  {
    id: '04',
    title: 'Quiet City Index',
    owner: 'M. Safarova',
    category: 'Culture + code',
    status: 'Draft',
    description: 'A calm guide to overlooked places, independent makers, and small rituals around the city.',
    tags: ['Editorial', 'City', 'Research'],
    accent: 'green',
    updated: 'Last week',
    views: '—',
    features: ['Editorial stories', 'Category search', 'Creator profiles'],
    demoUrl: '',
  },
];

const initialQuestions: Record<string, Question[]> = {
  '01': [
    {
      id: 'q-01-01',
      author: 'Nodira K.',
      initials: 'NK',
      role: 'student',
      time: '2 days ago',
      text: 'How do you keep the practice prompts from feeling repetitive?',
      answer: {
        author: 'Akari Karimova',
        initials: 'AK',
        text: 'Each scenario rotates by level and mood, so the learner practises the same skill in a new context.',
      },
    },
    {
      id: 'q-01-02',
      author: 'Kenji Mori',
      initials: 'KM',
      role: 'mentor',
      time: 'yesterday',
      text: 'Which part of the flow helped you feel more confident speaking?',
    },
  ],
  '02': [
    {
      id: 'q-02-01',
      author: 'Dilnoza A.',
      initials: 'DA',
      role: 'visitor',
      time: '4 hours ago',
      text: 'Can I filter the restaurants by a vegetarian menu and a quiet atmosphere?',
      answer: {
        author: 'Muhammad Rakhimov',
        initials: 'MR',
        text: 'Yes — open Filters and combine “Vegetarian” with “Calm”. More community tags are coming next.',
      },
    },
    {
      id: 'q-02-02',
      author: 'Saidbek T.',
      initials: 'ST',
      role: 'local guide',
      time: 'last week',
      text: 'How do you check whether a review is still accurate?',
    },
  ],
  '03': [
    {
      id: 'q-03-01',
      author: 'Mina S.',
      initials: 'MS',
      role: 'reviewer',
      time: '3 days ago',
      text: 'Will students be able to submit a case study without writing code?',
      answer: {
        author: 'Sardor Yusupov',
        initials: 'SY',
        text: 'Yes. The archive accepts a story, a visual, and a demo link, so the format stays open to different kinds of work.',
      },
    },
  ],
  '04': [
    {
      id: 'q-04-01',
      author: 'Aziza R.',
      initials: 'AR',
      role: 'editor',
      time: 'last week',
      text: 'What is the first place you would like to visit from this list?',
    },
  ],
};

const feedback: Review[] = [
  {
    id: 'r-01',
    projectId: '01',
    project: 'Nihongo Talk Trainer',
    author: 'Mai Sato',
    initials: 'MS',
    role: 'language mentor',
    rating: 5,
    text: 'The project makes speaking practice feel approachable. I understood the flow in less than a minute.',
  },
  {
    id: 'r-02',
    projectId: '02',
    project: 'Osh Table',
    author: 'Aziza R.',
    initials: 'AR',
    role: 'early visitor',
    rating: 5,
    text: 'I found two new places for the weekend and liked that every recommendation has a real local voice behind it.',
  },
  {
    id: 'r-03',
    projectId: '03',
    project: 'JDU Open Archive',
    author: 'Timur K.',
    initials: 'TK',
    role: 'portfolio reviewer',
    rating: 4,
    text: 'Clear enough to present in three minutes, but deep enough to keep exploring. The project story is strong.',
  },
];

const ui: Record<Language, Record<string, string>> = {
  EN: {
    workspace: 'JDU portfolio workspace',
    overview: 'Overview',
    projects: 'Projects',
    categories: 'Categories',
    review: 'Portfolio review',
    status: 'Open archive',
    add: 'Add project',
    profile: 'Profile',
    createProfile: 'Create profile',
    profileReady: 'Profile ready',
    join: 'Join JDU',
    joinTitle: 'Create your JDU account',
    joinBody: 'Choose a contact method, then finish your public creator profile.',
    emailTab: 'Email',
    telegramTab: 'Telegram',
    joinName: 'Your name',
    emailAddress: 'Email address',
    telegramUsername: 'Telegram username',
    joinSubmit: 'Continue to profile',
    joinNote: 'Your contact stays private and is used only for your account request.',
    joinSuccess: 'Registration saved. Finish your public profile next.',
    joinError: 'Registration could not be saved. Please try again.',
    editProfile: 'Edit profile',
    profileEditBody: 'Update your creator identity before you publish the next project to the JDU archive.',
    completeProfile: 'Complete profile',
    profileTitle: 'Create your profile',
    profileBody: 'Set up your creator identity before you publish a project to the JDU archive.',
    profileName: 'Display name',
    profileRole: 'Role',
    profileTrack: 'Track / category',
    profileBio: 'Short bio',
    avatarPhoto: 'Profile photo',
    choosePhoto: 'Choose a photo',
    photoHint: 'JPG, PNG or WebP · max 5 MB',
    saveProfile: 'Save profile',
    maybeLater: 'Maybe later',
    finishProfileFirst: 'Complete your profile before adding a project.',
    profileSaved: 'Profile saved. Your project can be published next.',
    projectLibrary: 'Project library',
    languageSet: 'Four languages',
    communityTools: 'Questions + board',
    demoLinks: 'Real demo links',
    demoReady: 'Demo link ready',
    addFirstProject: 'Add your first project',
    continueSetup: 'Continue setup',
    featured: 'Featured project',
    featuredTitle: 'Make work easy to find.',
    featuredBody: 'Create a profile, publish your project, and give the next student a clear place to start.',
    openProject: 'Open project',
    readiness: 'Your publishing path',
    readinessBody: 'Start with your profile, then add a project and turn it into a clear case study.',
    guide: 'Before you publish',
    guideBody: 'A short checklist for turning a class project into a portfolio case study.',
    readGuide: 'Read guide',
    library: 'Project library',
    libraryBody: 'All the work in one searchable place.',
    all: 'All projects',
    published: 'Published',
    drafts: 'Drafts',
    search: 'Search projects',
    open: 'Open',
    by: 'by',
    updated: 'Updated',
    projectDetails: 'Project details',
    overviewTab: 'Overview',
    questions: 'Questions',
    board: 'Board',
    features: 'Key features',
    views: 'Views',
    demo: 'Demo link',
    noDemo: 'Add a demo URL before publishing',
    addTitle: 'Add a project',
    addBody: 'Add a case study to your profile and publish it to the JDU archive. You can start as a draft.',
    title: 'Project name',
    owner: 'Creator / team',
    category: 'Category',
    categoryStats: 'Projects',
    publishedStats: 'Published',
    description: 'Short description',
    demoUrl: 'Demo URL (optional)',
    coverImage: 'Project cover',
    coverHint: 'Add a 4:3 image to make your case easy to recognize.',
    chooseCover: 'Choose cover',
    photoUploadError: 'Image could not be uploaded. Try again.',
    profileSavedWithoutPhoto: 'Profile saved. The photo can be uploaded again later.',
    projectSavedWithoutPhoto: 'Project saved. The cover can be uploaded again later.',
    save: 'Save project',
    close: 'Close',
    added: 'Project added to this workspace.',
    noQuestions: 'No questions yet. Start the conversation.',
    ask: 'Ask a question',
    post: 'Post',
    reviewReady: '3 of 4 essentials ready',
    feedback: 'Community feedback',
    feedbackBody: 'A small pulse from people who opened the projects and left a note.',
    averageScore: 'average score',
    openFeedback: 'Open discussion',
    reply: 'creator reply',
    leaveFeedback: 'Leave feedback',
    feedbackPlaceholder: 'What did you notice in this project?',
    saveFeedback: 'Post feedback',
    feedbackSaved: 'Feedback saved to the project.',
    profileSaveError: 'The profile could not be saved. Please try again.',
    projectUpdateError: 'The project could not be updated. Please try again.',
    projectDeleteError: 'The project could not be deleted. Please try again.',
    projectUpdated: 'Project updated.',
    projectDeleted: 'Project deleted from the workspace.',
    publish: 'Publish',
    moveToDraft: 'Move to draft',
    edit: 'Edit project',
    delete: 'Delete',
    confirmDelete: 'Delete this project and its questions, reviews and board items?',
    statusDraft: 'Draft',
    statusPublished: 'Published',
    boardEmpty: 'No tasks here yet.',
    boardAddTask: 'Add a board task',
    boardTaskTitle: 'Task title',
    boardTaskDetail: 'Short note (optional)',
    boardTaskColumn: 'Column',
    boardColumnTodo: 'To do',
    boardColumnProgress: 'In progress',
    boardColumnDone: 'Done',
    boardAdd: 'Add task',
    boardMove: 'Move',
    boardLoading: 'Loading board…',
    boardSaveError: 'The board item could not be saved. Please try again.',
    boardAdded: 'Task added to the project board.',
    manageOwnerOnly: 'Only the project creator can edit this project.',
    openDemo: 'Open demo',
    guideMessage: 'Guide mode is ready for the report meeting.',
    projectStatus: 'Publishing status',
    editBody: 'Update the case study, change its status, or replace the cover image.',
    latestFeedback: 'Latest feedback',
    boardFallback: 'The project is ready for another round of notes.',
  },
  RU: {
    workspace: 'рабочее пространство JDU',
    overview: 'Обзор',
    projects: 'Проекты',
    categories: 'Категории',
    review: 'Проверка портфолио',
    status: 'Открытый архив',
    add: 'Добавить проект',
    profile: 'Профиль',
    createProfile: 'Создать профиль',
    profileReady: 'Профиль готов',
    join: 'Регистрация',
    joinTitle: 'Создай аккаунт JDU',
    joinBody: 'Выбери способ связи, затем заполни публичный профиль автора.',
    emailTab: 'Email',
    telegramTab: 'Telegram',
    joinName: 'Твоё имя',
    emailAddress: 'Email',
    telegramUsername: 'Имя пользователя в Telegram',
    joinSubmit: 'Продолжить к профилю',
    joinNote: 'Контакт скрыт и используется только для заявки на аккаунт.',
    joinSuccess: 'Регистрация сохранена. Теперь заполни публичный профиль.',
    joinError: 'Не удалось сохранить регистрацию. Попробуй ещё раз.',
    editProfile: 'Изменить профиль',
    profileEditBody: 'Обнови данные автора перед публикацией следующего проекта в архиве JDU.',
    completeProfile: 'Заполнить профиль',
    profileTitle: 'Создай свой профиль',
    profileBody: 'Сначала укажи информацию о себе — затем опубликуй проект в архиве JDU.',
    profileName: 'Имя или название',
    profileRole: 'Роль',
    profileTrack: 'Направление / категория',
    profileBio: 'Коротко о себе',
    avatarPhoto: 'Фото профиля',
    choosePhoto: 'Выбрать фото',
    photoHint: 'JPG, PNG или WebP · до 5 МБ',
    saveProfile: 'Сохранить профиль',
    maybeLater: 'Позже',
    finishProfileFirst: 'Сначала заполни профиль, затем добавь проект.',
    profileSaved: 'Профиль сохранён. Теперь можно опубликовать проект.',
    projectLibrary: 'Библиотека проектов',
    languageSet: 'Четыре языка',
    communityTools: 'Вопросы + доска',
    demoLinks: 'Реальные ссылки на демо',
    demoReady: 'Демо-ссылка готова',
    addFirstProject: 'Добавить свой проект',
    continueSetup: 'Продолжить настройку',
    featured: 'Избранный проект',
    featuredTitle: 'Пусть работу легко найти.',
    featuredBody: 'Создай профиль, выложи проект и оставь следующему студенту понятную точку входа.',
    openProject: 'Открыть проект',
    readiness: 'Путь к публикации',
    readinessBody: 'Начни с профиля, затем добавь проект и преврати его в понятный кейс.',
    guide: 'Перед публикацией',
    guideBody: 'Короткий чек-лист: как превратить учебный проект в кейс.',
    readGuide: 'Открыть гайд',
    library: 'Библиотека проектов',
    libraryBody: 'Все работы в одном месте с поиском.',
    all: 'Все проекты',
    published: 'Опубликованные',
    drafts: 'Черновики',
    search: 'Поиск проектов',
    open: 'Открыть',
    by: 'автор',
    updated: 'Обновлён',
    projectDetails: 'Детали проекта',
    overviewTab: 'Обзор',
    questions: 'Вопросы',
    board: 'Доска',
    features: 'Ключевые функции',
    views: 'Просмотры',
    demo: 'Демо-ссылка',
    noDemo: 'Добавь URL демо перед публикацией',
    addTitle: 'Добавить проект',
    addBody: 'Добавь кейс в свой профиль и опубликуй его в архиве JDU. Начать можно с черновика.',
    title: 'Название проекта',
    owner: 'Автор / команда',
    category: 'Категория',
    categoryStats: 'Работ',
    publishedStats: 'Опубликовано',
    description: 'Краткое описание',
    demoUrl: 'URL демо (необязательно)',
    coverImage: 'Обложка проекта',
    coverHint: 'Добавь изображение 4:3, чтобы кейс было легко узнать.',
    chooseCover: 'Выбрать обложку',
    photoUploadError: 'Не удалось загрузить изображение. Попробуй ещё раз.',
    profileSavedWithoutPhoto: 'Профиль сохранён. Фото можно загрузить позже.',
    projectSavedWithoutPhoto: 'Проект сохранён. Обложку можно загрузить позже.',
    save: 'Сохранить проект',
    close: 'Закрыть',
    added: 'Проект добавлен в это рабочее пространство.',
    noQuestions: 'Вопросов пока нет. Начни обсуждение.',
    ask: 'Задать вопрос',
    post: 'Опубликовать',
    reviewReady: '3 из 4 пунктов готово',
    feedback: 'Отзывы сообщества',
    feedbackBody: 'Небольшая подборка отзывов людей, которые открыли проекты и оставили заметку.',
    averageScore: 'средняя оценка',
    openFeedback: 'Открыть обсуждение',
    reply: 'ответ автора',
    leaveFeedback: 'Оставить отзыв',
    feedbackPlaceholder: 'Что ты заметил в этом проекте?',
    saveFeedback: 'Опубликовать отзыв',
    feedbackSaved: 'Отзыв сохранён в проекте.',
    profileSaveError: 'Не удалось сохранить профиль. Попробуй ещё раз.',
    projectUpdateError: 'Не удалось обновить проект. Попробуй ещё раз.',
    projectDeleteError: 'Не удалось удалить проект. Попробуй ещё раз.',
    projectUpdated: 'Проект обновлён.',
    projectDeleted: 'Проект удалён из рабочего пространства.',
    publish: 'Опубликовать',
    moveToDraft: 'Вернуть в черновик',
    edit: 'Изменить проект',
    delete: 'Удалить',
    confirmDelete: 'Удалить проект вместе с вопросами, отзывами и задачами доски?',
    statusDraft: 'Черновик',
    statusPublished: 'Опубликован',
    boardEmpty: 'Здесь пока нет задач.',
    boardAddTask: 'Добавить задачу на доску',
    boardTaskTitle: 'Название задачи',
    boardTaskDetail: 'Короткая заметка (необязательно)',
    boardTaskColumn: 'Колонка',
    boardColumnTodo: 'К выполнению',
    boardColumnProgress: 'В работе',
    boardColumnDone: 'Готово',
    boardAdd: 'Добавить задачу',
    boardMove: 'Переместить',
    boardLoading: 'Загрузка доски…',
    boardSaveError: 'Не удалось сохранить задачу. Попробуй ещё раз.',
    boardAdded: 'Задача добавлена на доску проекта.',
    manageOwnerOnly: 'Изменять проект может только его автор.',
    openDemo: 'Открыть демо',
    guideMessage: 'Гайд готов для отчётной встречи.',
    projectStatus: 'Статус публикации',
    editBody: 'Обнови кейс, измени статус или замени обложку проекта.',
    latestFeedback: 'Последний отзыв',
    boardFallback: 'Проект готов к следующему раунду заметок.',
  },
  UZ: {
    workspace: 'JDU portfolio ish maydoni',
    overview: 'Umumiy',
    projects: 'Loyihalar',
    categories: 'Kategoriyalar',
    review: 'Portfolio tekshiruvi',
    status: 'Ochiq arxiv',
    add: 'Loyiha qo‘shish',
    profile: 'Profil',
    createProfile: 'Profil yaratish',
    profileReady: 'Profil tayyor',
    join: 'Ro‘yxatdan o‘tish',
    joinTitle: 'JDU akkauntini yarating',
    joinBody: 'Aloqa usulini tanlang, keyin ochiq muallif profilini to‘ldiring.',
    emailTab: 'Email',
    telegramTab: 'Telegram',
    joinName: 'Ismingiz',
    emailAddress: 'Email manzil',
    telegramUsername: 'Telegram foydalanuvchi nomi',
    joinSubmit: 'Profilga davom etish',
    joinNote: 'Kontakt yashirin qoladi va faqat akkaunt so‘rovi uchun ishlatiladi.',
    joinSuccess: 'Ro‘yxatdan o‘tish saqlandi. Endi ochiq profilingizni to‘ldiring.',
    joinError: 'Ro‘yxatdan o‘tishni saqlab bo‘lmadi. Qayta urinib ko‘ring.',
    editProfile: 'Profilni tahrirlash',
    profileEditBody: 'JDU arxiviga keyingi loyihani joylashdan oldin ijodkor maʼlumotlarini yangilang.',
    completeProfile: 'Profilni to‘ldirish',
    profileTitle: 'Profilingizni yarating',
    profileBody: 'Avval ijodkor ma’lumotlarini kiriting, keyin loyihani JDU arxiviga joylang.',
    profileName: 'Ism yoki nom',
    profileRole: 'Rol',
    profileTrack: 'Yo‘nalish / kategoriya',
    profileBio: 'Qisqa bio',
    avatarPhoto: 'Profil rasmi',
    choosePhoto: 'Rasm tanlash',
    photoHint: 'JPG, PNG yoki WebP · 5 MB gacha',
    saveProfile: 'Profilni saqlash',
    maybeLater: 'Keyinroq',
    finishProfileFirst: 'Loyiha qo‘shishdan oldin profilingizni to‘ldiring.',
    profileSaved: 'Profil saqlandi. Endi loyihani joylashingiz mumkin.',
    projectLibrary: 'Loyihalar kutubxonasi',
    languageSet: 'To‘rt til',
    communityTools: 'Savollar + doska',
    demoLinks: 'Haqiqiy demo havolalari',
    demoReady: 'Demo havolasi tayyor',
    addFirstProject: 'O‘z loyihangizni qo‘shing',
    continueSetup: 'Sozlashni davom ettirish',
    featured: 'Tanlangan loyiha',
    featuredTitle: 'Ishni topishni oson qiling.',
    featuredBody: 'Profil yarating, loyihangizni joylang va keyingi talabaga aniq boshlanish nuqtasini qoldiring.',
    openProject: 'Loyihani ochish',
    readiness: 'Nashr yo‘li',
    readinessBody: 'Profilingizdan boshlang, keyin loyiha qo‘shib uni aniq case study ga aylantiring.',
    guide: 'Nashrdan oldin',
    guideBody: 'O‘quv loyihasini portfolio case study ga aylantirish uchun qisqa ro‘yxat.',
    readGuide: 'Qo‘llanmani ochish',
    library: 'Loyihalar kutubxonasi',
    libraryBody: 'Barcha ishlar qidiriladigan bitta joyda.',
    all: 'Barcha loyihalar',
    published: 'Nashr qilingan',
    drafts: 'Qoralamalar',
    search: 'Loyihalarni qidirish',
    open: 'Ochish',
    by: 'muallif',
    updated: 'Yangilangan',
    projectDetails: 'Loyiha tafsilotlari',
    overviewTab: 'Umumiy',
    questions: 'Savollar',
    board: 'Doska',
    features: 'Asosiy funksiyalar',
    views: 'Ko‘rishlar',
    demo: 'Demo havolasi',
    noDemo: 'Nashrdan oldin demo URL qo‘shing',
    addTitle: 'Loyiha qo‘shish',
    addBody: 'Profilingizga case study qo‘shing va uni JDU arxiviga joylang. Avval qoralama sifatida saqlash mumkin.',
    title: 'Loyiha nomi',
    owner: 'Muallif / jamoa',
    category: 'Kategoriya',
    categoryStats: 'Loyihalar',
    publishedStats: 'Nashr',
    description: 'Qisqa tavsif',
    demoUrl: 'Demo URL (ixtiyoriy)',
    coverImage: 'Loyiha muqovasi',
    coverHint: 'Case ni tanib olish oson bo‘lishi uchun 4:3 rasm qo‘shing.',
    chooseCover: 'Muqova tanlash',
    photoUploadError: 'Rasmni yuklab bo‘lmadi. Qayta urinib ko‘ring.',
    profileSavedWithoutPhoto: 'Profil saqlandi. Rasmni keyinroq yuklash mumkin.',
    projectSavedWithoutPhoto: 'Loyiha saqlandi. Muqovani keyinroq yuklash mumkin.',
    save: 'Loyihani saqlash',
    close: 'Yopish',
    added: 'Loyiha ish maydoniga qo‘shildi.',
    noQuestions: 'Hali savollar yo‘q. Suhbatni boshlang.',
    ask: 'Savol berish',
    post: 'Joylash',
    reviewReady: '4 dan 3 tasi tayyor',
    feedback: 'Hamjamiyat fikrlari',
    feedbackBody: 'Loyihalarni ko‘rgan va o‘z fikrini qoldirgan odamlarning qisqa izohlari.',
    averageScore: 'o‘rtacha baho',
    openFeedback: 'Muhokamani ochish',
    reply: 'muallif javobi',
    leaveFeedback: 'Fikr qoldirish',
    feedbackPlaceholder: 'Bu loyihada nimani sezdingiz?',
    saveFeedback: 'Fikrni joylash',
    feedbackSaved: 'Fikr loyihaga saqlandi.',
    profileSaveError: 'Profilni saqlab bo‘lmadi. Qayta urinib ko‘ring.',
    projectUpdateError: 'Loyihani yangilab bo‘lmadi. Qayta urinib ko‘ring.',
    projectDeleteError: 'Loyihani o‘chirib bo‘lmadi. Qayta urinib ko‘ring.',
    projectUpdated: 'Loyiha yangilandi.',
    projectDeleted: 'Loyiha ish maydonidan o‘chirildi.',
    publish: 'Nashr qilish',
    moveToDraft: 'Qoralamaga qaytarish',
    edit: 'Loyihani tahrirlash',
    delete: 'O‘chirish',
    confirmDelete: 'Loyiha, savollar, fikrlar va doska vazifalari o‘chirilsinmi?',
    statusDraft: 'Qoralama',
    statusPublished: 'Nashr qilingan',
    boardEmpty: 'Bu yerda hali vazifalar yo‘q.',
    boardAddTask: 'Doskaga vazifa qo‘shish',
    boardTaskTitle: 'Vazifa nomi',
    boardTaskDetail: 'Qisqa izoh (ixtiyoriy)',
    boardTaskColumn: 'Ustun',
    boardColumnTodo: 'Bajariladi',
    boardColumnProgress: 'Jarayonda',
    boardColumnDone: 'Tayyor',
    boardAdd: 'Vazifa qo‘shish',
    boardMove: 'Ko‘chirish',
    boardLoading: 'Doska yuklanmoqda…',
    boardSaveError: 'Vazifani saqlab bo‘lmadi. Qayta urinib ko‘ring.',
    boardAdded: 'Vazifa loyiha doskasiga qo‘shildi.',
    manageOwnerOnly: 'Loyihani faqat uning muallifi tahrirlashi mumkin.',
    openDemo: 'Demoni ochish',
    guideMessage: 'Qo‘llanma hisobot uchrashuviga tayyor.',
    projectStatus: 'Nashr holati',
    editBody: 'Case study ni yangilang, holatini o‘zgartiring yoki muqovani almashtiring.',
    latestFeedback: 'So‘nggi fikr',
    boardFallback: 'Loyiha keyingi fikrlar bosqichiga tayyor.',
  },
  JP: {
    workspace: 'JDU ポートフォリオワークスペース',
    overview: '概要',
    projects: 'プロジェクト',
    categories: 'カテゴリー',
    review: 'ポートフォリオ確認',
    status: '公開アーカイブ',
    add: '作品を追加',
    profile: 'プロフィール',
    createProfile: 'プロフィールを作成',
    profileReady: 'プロフィール準備完了',
    join: '参加する',
    joinTitle: 'JDUアカウントを作成',
    joinBody: '連絡方法を選び、公開プロフィールを完成させましょう。',
    emailTab: 'Email',
    telegramTab: 'Telegram',
    joinName: '名前',
    emailAddress: 'メールアドレス',
    telegramUsername: 'Telegramユーザー名',
    joinSubmit: 'プロフィールへ進む',
    joinNote: '連絡先は非公開で、アカウント申請にのみ使用されます。',
    joinSuccess: '登録を保存しました。次に公開プロフィールを完成してください。',
    joinError: '登録を保存できませんでした。もう一度お試しください。',
    editProfile: 'プロフィールを編集',
    profileEditBody: '次の作品をJDUアーカイブに公開する前に、作者情報を更新しましょう。',
    completeProfile: 'プロフィールを完成',
    profileTitle: 'プロフィールを作成',
    profileBody: '作者情報を設定してから、JDUアーカイブに作品を公開しましょう。',
    profileName: '表示名',
    profileRole: '役割',
    profileTrack: '分野 / カテゴリー',
    profileBio: '短い自己紹介',
    avatarPhoto: 'プロフィール写真',
    choosePhoto: '写真を選択',
    photoHint: 'JPG、PNG、WebP · 最大5MB',
    saveProfile: 'プロフィールを保存',
    maybeLater: '後で',
    finishProfileFirst: '作品を追加する前にプロフィールを完成してください。',
    profileSaved: 'プロフィールを保存しました。次に作品を公開できます。',
    projectLibrary: 'プロジェクトライブラリ',
    languageSet: '4つの言語',
    communityTools: '質問 + ボード',
    demoLinks: '実際のデモリンク',
    demoReady: 'デモリンク準備完了',
    addFirstProject: '自分の作品を追加',
    continueSetup: '設定を続ける',
    featured: '注目の作品',
    featuredTitle: '作品を見つけやすくする。',
    featuredBody: 'プロフィールを作り、作品を公開して、次の学生が始めやすい場所を作ります。',
    openProject: '作品を開く',
    readiness: '公開までのステップ',
    readinessBody: 'プロフィールから始め、作品を追加して分かりやすいケースに仕上げましょう。',
    guide: '公開する前に',
    guideBody: '授業の作品をケーススタディにするための短いチェックリスト。',
    readGuide: 'ガイドを見る',
    library: 'プロジェクトライブラリ',
    libraryBody: 'すべての作品を検索できます。',
    all: 'すべて',
    published: '公開済み',
    drafts: '下書き',
    search: '作品を検索',
    open: '開く',
    by: '作者',
    updated: '更新',
    projectDetails: '作品の詳細',
    overviewTab: '概要',
    questions: '質問',
    board: 'ボード',
    features: '主な機能',
    views: '閲覧数',
    demo: 'デモリンク',
    noDemo: '公開前にデモURLを追加してください',
    addTitle: '作品を追加',
    addBody: 'プロフィールにケーススタディを追加し、JDUアーカイブに公開します。下書きから始められます。',
    title: '作品名',
    owner: '作者 / チーム',
    category: 'カテゴリー',
    categoryStats: '作品',
    publishedStats: '公開済み',
    description: '短い説明',
    demoUrl: 'デモURL（任意）',
    coverImage: '作品カバー',
    coverHint: '作品を見つけやすくする4:3画像を追加します。',
    chooseCover: 'カバーを選択',
    photoUploadError: '画像をアップロードできませんでした。もう一度お試しください。',
    profileSavedWithoutPhoto: 'プロフィールを保存しました。写真は後で追加できます。',
    projectSavedWithoutPhoto: '作品を保存しました。カバーは後で追加できます。',
    save: '保存',
    close: '閉じる',
    added: '作品をワークスペースに追加しました。',
    noQuestions: '質問はまだありません。',
    ask: '質問する',
    post: '投稿',
    reviewReady: '4項目中3項目が準備済み',
    feedback: 'コミュニティの声',
    feedbackBody: '作品を見てコメントを残した人たちからの短いフィードバック。',
    averageScore: '平均評価',
    openFeedback: '質問を見る',
    reply: '作者の返信',
    leaveFeedback: 'フィードバックを書く',
    feedbackPlaceholder: 'この作品について気づいたことは？',
    saveFeedback: '投稿する',
    feedbackSaved: 'フィードバックを保存しました。',
    profileSaveError: 'プロフィールを保存できませんでした。もう一度お試しください。',
    projectUpdateError: '作品を更新できませんでした。もう一度お試しください。',
    projectDeleteError: '作品を削除できませんでした。もう一度お試しください。',
    projectUpdated: '作品を更新しました。',
    projectDeleted: '作品をワークスペースから削除しました。',
    publish: '公開する',
    moveToDraft: '下書きに戻す',
    edit: '作品を編集',
    delete: '削除',
    confirmDelete: '作品と質問、フィードバック、ボード項目を削除しますか？',
    statusDraft: '下書き',
    statusPublished: '公開済み',
    boardEmpty: 'ここにはまだタスクがありません。',
    boardAddTask: 'ボードにタスクを追加',
    boardTaskTitle: 'タスク名',
    boardTaskDetail: '短いメモ（任意）',
    boardTaskColumn: 'カラム',
    boardColumnTodo: '予定',
    boardColumnProgress: '進行中',
    boardColumnDone: '完了',
    boardAdd: 'タスクを追加',
    boardMove: '移動',
    boardLoading: 'ボードを読み込み中…',
    boardSaveError: 'タスクを保存できませんでした。もう一度お試しください。',
    boardAdded: 'タスクを作品ボードに追加しました。',
    manageOwnerOnly: '作品を編集できるのは作者だけです。',
    openDemo: 'デモを開く',
    guideMessage: 'ガイドは報告会の準備ができています。',
    projectStatus: '公開ステータス',
    editBody: 'ケーススタディを更新し、ステータスやカバーを変更できます。',
    latestFeedback: '最新のフィードバック',
    boardFallback: 'この作品は次のメモを受け取る準備ができています。',
  },
};

const categories = ['All', 'Learning systems', 'Community tools', 'Culture + code'];

const productCopy: Record<Language, Record<string, string>> = {
  EN: {
    brandLine: 'Student work, in one place', navExplore: 'Explore', navCategories: 'Categories', navHow: 'How it works',
    heroKicker: 'The student portfolio of JDU', heroTitle: 'Great student work deserves to be seen.',
    heroBody: 'Discover projects made at JDU, meet their creators, ask questions, and publish your own work in minutes.',
    heroPrimary: 'Explore projects', heroSecondary: 'Create your profile', featured: 'Featured project',
    discoverKicker: 'Discover', discoverTitle: 'Projects from the JDU community',
    discoverBody: 'Real student ideas across education, community, culture and technology.', searchPlaceholder: 'Search projects, people or topics…',
    allProjects: 'All projects', noMatch: 'No projects match your search yet.', creatorTitle: 'Ready to share your work?',
    creatorBody: 'Create a short creator profile, add a cover and publish your first project.', creatorReady: 'Your creator profile is ready',
    creatorReadyBody: 'Your next project can be added in a few minutes.', howKicker: 'For creators', howTitle: 'From student work to public portfolio',
    howBody: 'A clear three-step path. No dashboard maze and no complicated setup.', stepOneTitle: 'Create a profile', stepOneBody: 'Add your name, track, bio and photo.',
    stepTwoTitle: 'Publish a project', stepTwoBody: 'Show the problem, solution, visuals and demo link.', stepThreeTitle: 'Join the conversation',
    stepThreeBody: 'Receive questions and feedback from students and mentors.', communityKicker: 'Community', communityTitle: 'Feedback that helps projects grow',
    communityBody: 'Demo reviews and questions are clearly marked as sample content.', footer: 'A public archive of student-made work at JDU.',
    myProfile: 'My profile', publish: 'Publish project', projectsLabel: 'projects', creatorsLabel: 'creators', languagesLabel: 'languages',
  },
  RU: {
    brandLine: 'Студенческие работы в одном месте', navExplore: 'Проекты', navCategories: 'Категории', navHow: 'Как это работает',
    heroKicker: 'Студенческое портфолио JDU', heroTitle: 'Сильные студенческие проекты должны быть заметны.',
    heroBody: 'Смотри проекты студентов JDU, находи авторов, задавай вопросы и публикуй собственную работу за несколько минут.',
    heroPrimary: 'Смотреть проекты', heroSecondary: 'Создать профиль', featured: 'Проект недели',
    discoverKicker: 'Каталог', discoverTitle: 'Проекты сообщества JDU',
    discoverBody: 'Идеи студентов в образовании, культуре, технологиях и общественных сервисах.', searchPlaceholder: 'Найти проект, автора или тему…',
    allProjects: 'Все проекты', noMatch: 'По этому запросу проектов пока нет.', creatorTitle: 'Готов показать свою работу?',
    creatorBody: 'Создай короткий профиль автора, добавь обложку и опубликуй первый проект.', creatorReady: 'Профиль автора готов',
    creatorReadyBody: 'Теперь можно добавить следующий проект за несколько минут.', howKicker: 'Для авторов', howTitle: 'От учебной работы до публичного портфолио',
    howBody: 'Понятный путь из трёх шагов — без сложной панели и лишних настроек.', stepOneTitle: 'Создай профиль', stepOneBody: 'Добавь имя, направление, описание и фото.',
    stepTwoTitle: 'Опубликуй проект', stepTwoBody: 'Покажи задачу, решение, визуалы и ссылку на демо.', stepThreeTitle: 'Получи обратную связь',
    stepThreeBody: 'Отвечай на вопросы студентов и менторов.', communityKicker: 'Сообщество', communityTitle: 'Отзывы, которые помогают проектам расти',
    communityBody: 'Демонстрационные отзывы и вопросы отмечены как пример контента.', footer: 'Публичный архив студенческих проектов JDU.',
    myProfile: 'Мой профиль', publish: 'Добавить проект', projectsLabel: 'проектов', creatorsLabel: 'авторов', languagesLabel: 'языка',
  },
  UZ: {
    brandLine: 'Talabalar ishlari bir joyda', navExplore: 'Loyihalar', navCategories: 'Toifalar', navHow: 'Qanday ishlaydi',
    heroKicker: 'JDU talabalar portfoliosi', heroTitle: 'Kuchli talaba loyihalari ko‘rinishi kerak.',
    heroBody: 'JDU loyihalarini ko‘ring, mualliflar bilan tanishing, savol bering va o‘z ishingizni bir necha daqiqada joylang.',
    heroPrimary: 'Loyihalarni ko‘rish', heroSecondary: 'Profil yaratish', featured: 'Tanlangan loyiha',
    discoverKicker: 'Katalog', discoverTitle: 'JDU hamjamiyati loyihalari',
    discoverBody: 'Ta’lim, madaniyat, texnologiya va hamjamiyat uchun yaratilgan talaba g‘oyalari.', searchPlaceholder: 'Loyiha, muallif yoki mavzu qidiring…',
    allProjects: 'Barcha loyihalar', noMatch: 'Bu so‘rov bo‘yicha loyiha topilmadi.', creatorTitle: 'Ishingizni ulashishga tayyormisiz?',
    creatorBody: 'Muallif profilini yarating, muqova qo‘shing va birinchi loyihani e’lon qiling.', creatorReady: 'Muallif profilingiz tayyor',
    creatorReadyBody: 'Keyingi loyihani bir necha daqiqada qo‘shishingiz mumkin.', howKicker: 'Mualliflar uchun', howTitle: 'O‘quv ishidan ochiq portfoliogacha',
    howBody: 'Ortiqcha sozlamalarsiz uchta aniq qadam.', stepOneTitle: 'Profil yarating', stepOneBody: 'Ism, yo‘nalish, bio va rasm qo‘shing.',
    stepTwoTitle: 'Loyihani joylang', stepTwoBody: 'Muammo, yechim, tasvir va demo havolasini ko‘rsating.', stepThreeTitle: 'Fikr oling',
    stepThreeBody: 'Talabalar va mentorlardan savol hamda izohlar oling.', communityKicker: 'Hamjamiyat', communityTitle: 'Loyihani rivojlantiradigan fikrlar',
    communityBody: 'Namuna savollar va izohlar demo kontent sifatida ko‘rsatiladi.', footer: 'JDU talabalari yaratgan loyihalarning ochiq arxivi.',
    myProfile: 'Mening profilim', publish: 'Loyiha qo‘shish', projectsLabel: 'loyiha', creatorsLabel: 'muallif', languagesLabel: 'til',
  },
  JP: {
    brandLine: '学生作品をひとつの場所に', navExplore: '作品を見る', navCategories: 'カテゴリー', navHow: '使い方',
    heroKicker: 'JDU 学生ポートフォリオ', heroTitle: '優れた学生作品を、もっと多くの人へ。',
    heroBody: 'JDUの作品を見つけ、作者を知り、質問し、自分の作品も数分で公開できます。',
    heroPrimary: '作品を見る', heroSecondary: 'プロフィールを作成', featured: '注目の作品',
    discoverKicker: '作品一覧', discoverTitle: 'JDUコミュニティのプロジェクト',
    discoverBody: '教育、文化、テクノロジー、コミュニティから生まれた学生のアイデア。', searchPlaceholder: '作品、作者、テーマを検索…',
    allProjects: 'すべての作品', noMatch: '該当する作品はまだありません。', creatorTitle: '作品を公開しませんか？',
    creatorBody: '作者プロフィールを作成し、カバー画像を追加して最初の作品を公開しましょう。', creatorReady: '作者プロフィールは完成しています',
    creatorReadyBody: '次の作品を数分で追加できます。', howKicker: '作者向け', howTitle: '授業の成果を公開ポートフォリオへ',
    howBody: '迷わない、シンプルな3ステップです。', stepOneTitle: 'プロフィール作成', stepOneBody: '名前、分野、自己紹介、写真を追加。',
    stepTwoTitle: '作品を公開', stepTwoBody: '課題、解決策、ビジュアル、デモを紹介。', stepThreeTitle: 'フィードバック',
    stepThreeBody: '学生やメンターから質問と感想を受け取る。', communityKicker: 'コミュニティ', communityTitle: '作品を成長させるフィードバック',
    communityBody: 'サンプルのレビューと質問はデモコンテンツとして表示されます。', footer: 'JDU学生作品の公開アーカイブ。',
    myProfile: 'プロフィール', publish: '作品を追加', projectsLabel: '作品', creatorsLabel: '作者', languagesLabel: '言語',
  },
};

const projectCoverFallbacks: Record<string, string> = {
  '01': '/projects/nihongo-talk-trainer.jpg',
  '02': '/projects/osh-table.jpg',
  '03': '/projects/jdu-open-archive.jpg',
  '04': '/projects/quiet-city-index.jpg',
};

const clientImageTypes = new Set(['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp']);
const clientMaxImageBytes = 5 * 1024 * 1024;

function readImagePreview(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Preview unavailable'));
    reader.onerror = () => reject(new Error('Preview unavailable'));
    reader.readAsDataURL(file);
  });
}

async function uploadMedia(file: File, kind: 'profile' | 'project', projectId?: string) {
  const form = new FormData();
  form.set('kind', kind);
  form.set('file', file);
  if (projectId) form.set('projectId', projectId);
  const response = await fetch('/api/uploads', { method: 'POST', body: form });
  const data = await response.json().catch(() => ({})) as { url?: string };
  if (!response.ok || !data.url) throw new Error('Image upload failed');
  return data.url;
}

function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  const fallbackCover = projectCoverFallbacks[project.id];
  const requestedCover = project.coverUrl || fallbackCover;
  return (
    <div className={`project-visual project-visual--${project.accent} ${large ? 'project-visual--large' : ''}`}>
      {requestedCover ? <img className="project-cover-image" src={requestedCover} alt={`${project.title} project cover`} onError={(event) => {
        if (fallbackCover && event.currentTarget.getAttribute('src') !== fallbackCover) event.currentTarget.src = fallbackCover;
        else event.currentTarget.hidden = true;
      }} /> : <div className="project-cover-fallback"><span>JDU</span><b>{project.title}</b></div>}
      <span className="visual-label">{project.category}</span>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('EN');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [view, setView] = useState<View>('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState('Published');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [registrationChannel, setRegistrationChannel] = useState<RegistrationChannel>('email');
  const [registrationName, setRegistrationName] = useState('');
  const [registrationContact, setRegistrationContact] = useState('');
  const [registrationBusy, setRegistrationBusy] = useState(false);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [profileDraft, setProfileDraft] = useState<Profile>(initialProfile);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [projectCoverFile, setProjectCoverFile] = useState<File | null>(null);
  const [projectCoverPreview, setProjectCoverPreview] = useState('');
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<Record<string, Question[]>>(initialQuestions);
  const [reviews, setReviews] = useState<Review[]>(feedback);
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDetail, setBoardDetail] = useState('');
  const [boardColumn, setBoardColumn] = useState<BoardColumn>('todo');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState('5');
  const [toast, setToast] = useState('');
  const t = ui[language];
  const c = productCopy[language];

  useEffect(() => {
    let active = true;
    fetch('/api/portfolio', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Portfolio API unavailable');
        return response.json() as Promise<{ projects: Project[]; questions: Record<string, Question[]>; reviews: Review[] }>;
      })
      .then((data) => {
        if (!active) return;
        setProjects(data.projects);
        setQuestions(data.questions);
        setReviews(data.reviews);
      })
      .catch(() => {
        // The seed data keeps the first paint useful while a local backend is unavailable.
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    let cached: Partial<Profile> = {};
    try {
      const storedProfile = window.localStorage.getItem('jdu-profile');
      if (storedProfile) cached = JSON.parse(storedProfile) as Partial<Profile>;
    } catch {
      // Ignore an old or incomplete local cache. D1 remains the source of truth.
    }
    fetch('/api/profile', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Profile API unavailable');
        return response.json() as Promise<{ profile: (Omit<Profile, 'avatar' | 'avatarUrl'> & { avatarUrl?: string }) | null }>;
      })
      .then((data) => {
        if (!active) return;
        if (data.profile) {
          const initials = data.profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'JD';
          setProfile({ ...data.profile, avatar: initials, avatarUrl: data.profile.avatarUrl || cached.avatarUrl });
        } else if (cached.name) {
          setProfile((current) => ({ ...current, ...cached }));
        }
      })
      .catch(() => {
        if (active && cached.name) setProfile((current) => ({ ...current, ...cached }));
      });
    return () => { active = false; };
  }, []);

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const statusMatch = filter === 'All' || project.status === filter;
    const categoryMatch = category === 'All' || project.category === category;
    const text = `${project.title} ${project.owner} ${project.category} ${project.tags.join(' ')}`.toLowerCase();
    return statusMatch && categoryMatch && (!query.trim() || text.includes(query.trim().toLowerCase()));
  }), [category, filter, projects, query]);

  const profileComplete = Boolean(profile.name.trim() && profile.role.trim() && profile.track.trim() && profile.bio.trim());
  const creatorProject = projects.find((project) => project.owner === profile.name);
  const projectComplete = Boolean(creatorProject);
  const demoComplete = Boolean(creatorProject?.demoUrl);
  const canManageSelected = Boolean(selected && selected.owner === profile.name);
  const boardColumns: Array<{ key: BoardColumn; index: string; label: string }> = [
    { key: 'todo', index: '01', label: t.boardColumnTodo },
    { key: 'progress', index: '02', label: t.boardColumnProgress },
    { key: 'done', index: '03', label: t.boardColumnDone },
  ];

  function selectProject(project: Project) {
    setSelected(project);
    setDetailTab('overview');
    setQuestion('');
    setBoardItems([]);
    setBoardLoading(true);
    fetch(`/api/board?projectId=${encodeURIComponent(project.id)}`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Board API unavailable');
        return response.json() as Promise<{ items: BoardItem[] }>;
      })
      .then((data) => setBoardItems(data.items))
      .catch(() => setBoardItems([]))
      .finally(() => setBoardLoading(false));
  }

  function navigate(nextView: View) {
    setView(nextView);
    setSidebarOpen(false);
    const target = nextView === 'review' ? 'review' : nextView === 'projects' ? 'library' : nextView === 'categories' ? 'categories' : 'overview';
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  function openCategory(nextCategory: string) {
    setCategory(nextCategory);
    setFilter('All');
    setQuery('');
    navigate('projects');
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3600);
  }

  function openRegistration() {
    setRegistrationChannel('email');
    setRegistrationName(profile.name !== initialProfile.name ? profile.name : '');
    setRegistrationContact('');
    setShowJoin(true);
  }

  function closeRegistration() {
    setShowJoin(false);
    setRegistrationBusy(false);
  }

  function openProfile(prefillName?: string) {
    setProfileDraft(prefillName ? { ...profile, name: prefillName } : profile);
    setProfilePhotoFile(null);
    setProfilePhotoPreview('');
    setShowProfile(true);
  }

  function openCreatorEntry() {
    if (profileComplete) openProfile();
    else openRegistration();
  }

  function closeProfile() {
    setShowProfile(false);
    setProfilePhotoFile(null);
    setProfilePhotoPreview('');
  }

  function closeProjectComposer() {
    setShowAdd(false);
    setProjectCoverFile(null);
    setProjectCoverPreview('');
  }

  function openProjectEditor(project: Project) {
    if (project.owner !== profile.name) {
      notify(t.manageOwnerOnly);
      return;
    }
    setEditingProject(project);
    setProjectCoverFile(null);
    setProjectCoverPreview('');
    setShowEdit(true);
  }

  function closeProjectEditor() {
    setShowEdit(false);
    setEditingProject(null);
    setProjectCoverFile(null);
    setProjectCoverPreview('');
  }

  async function handleProfilePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!clientImageTypes.has(file.type) || file.size > clientMaxImageBytes) {
      notify(t.photoUploadError);
      event.currentTarget.value = '';
      return;
    }
    setProfilePhotoFile(file);
    try {
      setProfilePhotoPreview(await readImagePreview(file));
    } catch {
      notify(t.photoUploadError);
    }
  }

  async function handleProjectCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!clientImageTypes.has(file.type) || file.size > clientMaxImageBytes) {
      notify(t.photoUploadError);
      event.currentTarget.value = '';
      return;
    }
    setProjectCoverFile(file);
    try {
      setProjectCoverPreview(await readImagePreview(file));
    } catch {
      notify(t.photoUploadError);
    }
  }

  function openProjectComposer() {
    if (!profileComplete) {
      openRegistration();
      return;
    }
    setEditingProject(null);
    setProjectCoverFile(null);
    setProjectCoverPreview('');
    setShowAdd(true);
  }

  function continueSetup() {
    if (!profileComplete) {
      openRegistration();
      return;
    }
    if (!projectComplete) {
      setShowAdd(true);
      return;
    }
    if (creatorProject && !demoComplete) {
      selectProject(creatorProject);
      return;
    }
    navigate('review');
  }

  async function handleRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!registrationName.trim() || !registrationContact.trim() || registrationBusy) return;
    setRegistrationBusy(true);
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: registrationChannel, name: registrationName.trim(), contact: registrationContact.trim() }),
      });
      if (!response.ok) throw new Error('Registration could not be saved');
      const prefillName = registrationName.trim();
      closeRegistration();
      openProfile(prefillName);
      notify(t.joinSuccess);
    } catch {
      setRegistrationBusy(false);
      notify(t.joinError);
    }
  }

  async function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const role = String(form.get('role') || '').trim();
    const track = String(form.get('track') || '').trim();
    const bio = String(form.get('bio') || '').trim();
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'JD';
    const handle = `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'jdu-creator'}`;
    let avatarUrl = profileDraft.avatarUrl || profile.avatarUrl || '';
    let photoUploadFailed = false;
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, handle, role, track, bio }),
      });
      if (!response.ok) throw new Error('Profile could not be saved');
    } catch {
      notify(t.profileSaveError);
      return;
    }
    if (profilePhotoFile) {
      try {
        avatarUrl = await uploadMedia(profilePhotoFile, 'profile');
      } catch {
        photoUploadFailed = true;
        avatarUrl = profilePhotoPreview || avatarUrl;
      }
    }
    const nextProfile = { name, role, track, bio, avatar: initials, handle, avatarUrl };
    setProfile(nextProfile);
    setProfileDraft(nextProfile);
    window.localStorage.setItem('jdu-profile', JSON.stringify(nextProfile));
    closeProfile();
    setShowAdd(true);
    notify(photoUploadFailed ? t.profileSavedWithoutPhoto : t.profileSaved);
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const coverFile = form.get('cover');
    const payload = {
      title: String(form.get('title') || 'Untitled project'),
      owner: String(form.get('owner') || 'JDU student'),
      category: String(form.get('category') || 'Culture + code'),
      description: String(form.get('description') || 'A new project in the JDU portfolio workspace.'),
      demoUrl: String(form.get('demoUrl') || ''),
      status: form.get('status') === 'Published' ? 'Published' as const : 'Draft' as const,
    };
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Project could not be saved');
      let saved = await response.json() as Project;
      let coverUploadFailed = false;
      if (coverFile instanceof File && coverFile.size) {
        try {
          saved = { ...saved, coverUrl: await uploadMedia(coverFile, 'project', saved.id) };
        } catch {
          coverUploadFailed = true;
        }
      }
      setProjects((current) => [saved, ...current]);
      closeProjectComposer();
      event.currentTarget.reset();
      selectProject(saved);
      notify(coverUploadFailed ? t.projectSavedWithoutPhoto : t.added);
    } catch {
      notify(t.projectUpdateError);
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProject) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      projectId: editingProject.id,
      title: String(form.get('title') || '').trim(),
      owner: String(form.get('owner') || profile.name).trim(),
      category: String(form.get('category') || 'Culture + code').trim(),
      description: String(form.get('description') || '').trim(),
      demoUrl: String(form.get('demoUrl') || '').trim(),
      status: form.get('status') === 'Published' ? 'Published' as const : 'Draft' as const,
    };
    const coverFile = form.get('cover');
    try {
      const response = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Project could not be updated');
      let saved = await response.json() as Project;
      let coverUploadFailed = false;
      if (coverFile instanceof File && coverFile.size) {
        try {
          saved = { ...saved, coverUrl: await uploadMedia(coverFile, 'project', saved.id) };
        } catch {
          coverUploadFailed = true;
        }
      }
      setProjects((current) => current.map((project) => project.id === saved.id ? saved : project));
      setSelected((current) => current?.id === saved.id ? saved : current);
      closeProjectEditor();
      notify(coverUploadFailed ? t.projectSavedWithoutPhoto : t.projectUpdated);
    } catch {
      notify(t.projectUpdateError);
    }
  }

  async function toggleProjectStatus(project: Project) {
    if (project.owner !== profile.name) return;
    try {
      const response = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: project.title,
          owner: project.owner,
          category: project.category,
          description: project.description,
          demoUrl: project.demoUrl,
          status: project.status === 'Published' ? 'Draft' : 'Published',
        }),
      });
      if (!response.ok) throw new Error('Project status could not be updated');
      const saved = await response.json() as Project;
      setProjects((current) => current.map((item) => item.id === saved.id ? saved : item));
      setSelected((current) => current?.id === saved.id ? saved : current);
      notify(saved.status === 'Published' ? t.publish : t.moveToDraft);
    } catch {
      notify(t.projectUpdateError);
    }
  }

  async function removeProject(project: Project) {
    if (project.owner !== profile.name || !window.confirm(t.confirmDelete)) return;
    try {
      const response = await fetch(`/api/projects?projectId=${encodeURIComponent(project.id)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Project could not be deleted');
      setProjects((current) => current.filter((item) => item.id !== project.id));
      setSelected(null);
      notify(t.projectDeleted);
    } catch {
      notify(t.projectDeleteError);
    }
  }

  async function addBoardItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !canManageSelected || !boardTitle.trim()) return;
    try {
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selected.id, title: boardTitle.trim(), detail: boardDetail.trim(), column: boardColumn }),
      });
      if (!response.ok) throw new Error('Board item could not be saved');
      const saved = await response.json() as BoardItem;
      setBoardItems((current) => [...current, saved]);
      setBoardTitle('');
      setBoardDetail('');
      notify(t.boardAdded);
    } catch {
      notify(t.boardSaveError);
    }
  }

  async function moveBoardItem(item: BoardItem) {
    if (!canManageSelected) return;
    const nextColumn: Record<BoardColumn, BoardColumn | null> = { todo: 'progress', progress: 'done', done: null };
    const next = nextColumn[item.column];
    if (!next) return;
    try {
      const response = await fetch('/api/board', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, column: next }),
      });
      if (!response.ok) throw new Error('Board item could not be updated');
      const saved = await response.json() as BoardItem;
      setBoardItems((current) => current.map((currentItem) => currentItem.id === saved.id ? saved : currentItem));
    } catch {
      notify(t.boardSaveError);
    }
  }

  async function postQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !question.trim()) return;
    const projectId = selected.id;
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, text: question.trim() }),
      });
      if (!response.ok) throw new Error('Question could not be saved');
      const saved = await response.json() as Question;
      setQuestions((current) => ({ ...current, [projectId]: [...(current[projectId] || []), saved] }));
      setQuestion('');
      notify('Question added to the project board.');
    } catch {
      notify('The question could not be saved. Please try again.');
    }
  }

  async function postReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !reviewText.trim()) return;
    const projectId = selected.id;
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, rating: Number(reviewRating), text: reviewText.trim() }),
      });
      if (!response.ok) throw new Error('Feedback could not be saved');
      const saved = await response.json() as Review;
      setReviews((current) => [saved, ...current]);
      setReviewText('');
      setReviewRating('5');
      notify(t.feedbackSaved);
    } catch {
      notify('The feedback could not be saved. Please try again.');
    }
  }

  const selectedQuestions = selected ? questions[selected.id] || [] : [];
  const averageRating = reviews.length ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1) : '—';
  const publishedProjects = projects.filter((project) => project.status === 'Published');
  const creatorCount = new Set(projects.map((project) => project.owner)).size;
  const categoryCards = categories.slice(1).map((item, index) => ({
    name: item,
    projects: projects.filter((project) => project.category === item),
    accent: (['violet', 'orange', 'blue'] as Accent[])[index],
  }));

  return (
    <main className={`portfolio-site ${sidebarOpen ? 'is-nav-open' : ''}`} id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="JDU Portfolio home">
          <span className="brand-mark" aria-hidden="true"><b>J</b><i /></span>
          <span><b>JDU Portfolio</b><small>{c.brandLine}</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <button className={view === 'projects' ? 'is-active' : ''} type="button" onClick={() => navigate('projects')}>{c.navExplore}</button>
          <button className={view === 'categories' ? 'is-active' : ''} type="button" onClick={() => navigate('categories')}>{c.navCategories}</button>
          <button className={view === 'review' ? 'is-active' : ''} type="button" onClick={() => navigate('review')}>{c.navHow}</button>
        </nav>
        <div className="topbar-actions">
          <div className={`language-picker ${languageOpen ? 'is-open' : ''}`}>
            <button className="language-trigger" type="button" aria-expanded={languageOpen} aria-haspopup="listbox" aria-label="Language" onClick={() => setLanguageOpen((current) => !current)}>
              <span className="language-globe" aria-hidden="true">◎</span><b>{language}</b><span className="language-chevron" aria-hidden="true">⌄</span>
            </button>
            {languageOpen && <div className="language-menu" role="listbox" aria-label="Language">
              {(['EN', 'RU', 'UZ', 'JP'] as Language[]).map((item) => <button className={language === item ? 'is-active' : ''} key={item} type="button" role="option" aria-selected={language === item} onClick={() => { setLanguage(item); setLanguageOpen(false); }}>{item}<span>{language === item ? '✓' : ''}</span></button>)}
            </div>}
          </div>
          <button className="profile-button" type="button" onClick={openCreatorEntry}>
            <span className="profile-avatar">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : profileComplete ? profile.avatar : '+'}</span>
            <span>{profileComplete ? c.myProfile : t.join}</span>
          </button>
          <button className="primary-button topbar-publish" type="button" onClick={openProjectComposer}><span>＋</span>{c.publish}</button>
          <button className="mobile-nav-toggle" type="button" aria-label="Open navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((current) => !current)}><span /><span /></button>
        </div>
      </header>

      <div className="mobile-nav">
        <button type="button" onClick={() => navigate('projects')}>{c.navExplore}</button>
        <button type="button" onClick={() => navigate('categories')}>{c.navCategories}</button>
        <button type="button" onClick={() => navigate('review')}>{c.navHow}</button>
        <button type="button" onClick={openCreatorEntry}>{profileComplete ? c.myProfile : t.join}</button>
        <button className="primary-button" type="button" onClick={openProjectComposer}>{c.publish}</button>
      </div>

      <section className="portfolio-hero" id="overview">
        <div className="hero-copy">
          <p className="section-kicker"><span />{c.heroKicker}</p>
          <h1>{language === 'EN' ? <><span className="hero-word hero-word--great" tabIndex={0}>Great</span>{c.heroTitle.slice('Great'.length)}</> : c.heroTitle}</h1>
          <p className="hero-body">{c.heroBody}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate('projects')}>{c.heroPrimary}<span>↓</span></button>
            <button className="secondary-button" type="button" onClick={openCreatorEntry}>{profileComplete ? c.myProfile : t.join}</button>
          </div>
          <div className="hero-metrics" aria-label="Portfolio statistics">
            <span><b>{publishedProjects.length}</b><small>{c.projectsLabel}</small></span>
            <span><b>{creatorCount}</b><small>{c.creatorsLabel}</small></span>
            <span><b>4</b><small>{c.languagesLabel}</small></span>
          </div>
        </div>
      </section>

      <section className="discover-section" id="library">
        <div className="section-heading">
          <div><p className="section-kicker"><span />{c.discoverKicker}</p><h2>{c.discoverTitle}</h2><p>{c.discoverBody}</p></div>
          <button className="secondary-button" type="button" onClick={openProjectComposer}>＋ {c.publish}</button>
        </div>
        <div className="explore-toolbar">
          <label className="search-input"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.searchPlaceholder} aria-label={c.searchPlaceholder} /></label>
          <select className="category-select" aria-label={t.category} value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item === 'All' ? c.allProjects : item}</option>)}</select>
          <div className="status-tabs">{[['Published', t.published], ['All', t.all], ['Draft', t.drafts]].map(([key, label]) => <button className={filter === key ? 'is-active' : ''} key={key} type="button" onClick={() => setFilter(key)}>{label}</button>)}</div>
        </div>
        <div className="project-grid">
          {filteredProjects.map((project) => <article className="portfolio-card" key={project.id}>
            <button className="portfolio-card-main" type="button" onClick={() => selectProject(project)}>
              <ProjectVisual project={project} />
              <div className="portfolio-card-body">
                <p className="card-meta"><span>{project.category}</span><span>{project.updated}</span></p>
                <div className="portfolio-card-title"><h3>{project.title}</h3><span>↗</span></div>
                <p>{project.description}</p>
                <div className="tag-row">{project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
            </button>
            <div className="portfolio-card-footer"><span className="card-author"><i>{project.owner.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</i>{project.owner}</span><span className={`status-pill status-pill--${project.status.toLowerCase()}`}>{project.status === 'Published' ? t.statusPublished : t.statusDraft}</span></div>
          </article>)}
        </div>
        {filteredProjects.length === 0 && <div className="empty-library">{c.noMatch}</div>}
      </section>

      <section className="categories-section" id="categories">
        <div className="section-heading"><div><p className="section-kicker"><span />{c.navCategories}</p><h2>{t.categories}</h2><p>{c.discoverBody}</p></div></div>
        <div className="category-grid">{categoryCards.map((item, index) => {
          const publishedCount = item.projects.filter((project) => project.status === 'Published').length;
          return <button className={`category-card category-card--${item.accent}`} key={item.name} type="button" onClick={() => openCategory(item.name)}>
            <span className="category-number">0{index + 1}</span><span className="category-arrow">↗</span><h3>{item.name}</h3><p>{publishedCount} {c.projectsLabel}</p><span className="category-art"><i /><i /><i /></span>
          </button>;
        })}</div>
      </section>

      <section className="how-section" id="review">
        <div className="how-copy"><p className="section-kicker"><span />{c.howKicker}</p><h2>{c.howTitle}</h2><p>{c.howBody}</p><button className="primary-button" type="button" onClick={continueSetup}>{profileComplete ? c.publish : c.heroSecondary}<span>↗</span></button></div>
        <div className="how-steps">
          <article><span>01</span><div><h3>{c.stepOneTitle}</h3><p>{c.stepOneBody}</p></div></article>
          <article><span>02</span><div><h3>{c.stepTwoTitle}</h3><p>{c.stepTwoBody}</p></div></article>
          <article><span>03</span><div><h3>{c.stepThreeTitle}</h3><p>{c.stepThreeBody}</p></div></article>
        </div>
      </section>

      <section className="feedback-section" id="feedback">
        <div className="section-heading feedback-heading"><div><p className="section-kicker"><span />{c.communityKicker}</p><h2>{c.communityTitle}</h2><p>{c.communityBody}</p></div><div className="feedback-score"><b>{averageRating}</b><span>★★★★★</span><small>DEMO AVERAGE</small></div></div>
        <div className="feedback-grid">{reviews.slice(0, 3).map((item) => <button className="feedback-card" type="button" key={item.id} onClick={() => { const project = projects.find((candidate) => candidate.id === item.projectId); if (project) { selectProject(project); setDetailTab('questions'); } }}><span className="demo-label">DEMO</span><div className="feedback-card-top"><span className="feedback-avatar">{item.initials}</span><span className="feedback-meta"><b>{item.author}</b><small>{item.role}</small></span><span className="feedback-stars">{'★'.repeat(item.rating)}<i>{'★'.repeat(5 - item.rating)}</i></span></div><p>“{item.text}”</p><span className="feedback-project">{item.project}<span>↗</span></span></button>)}</div>
      </section>

      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark" aria-hidden="true"><b>J</b><i /></span><span><b>JDU Portfolio</b><small>{c.footer}</small></span></a><div><button type="button" onClick={() => navigate('projects')}>{c.navExplore}</button><button type="button" onClick={() => navigate('categories')}>{c.navCategories}</button><button type="button" onClick={openProjectComposer}>{c.publish}</button></div><small>© 2026 JDU · Demo content is marked</small></footer>

      {selected && <div className="drawer-backdrop" role="presentation" onClick={() => setSelected(null)}>
        <aside className="project-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" onClick={(event) => event.stopPropagation()}>
          <div className="drawer-top"><span className="eyebrow">{t.projectDetails} / {selected.id}</span><button className="close-button" type="button" aria-label={t.close} onClick={() => setSelected(null)}>×</button></div>
          <ProjectVisual project={selected} large />
          <div className="drawer-content">
            <div className="drawer-title-row"><div><p className="eyebrow">{selected.category}</p><h2 id="drawer-title">{selected.title}</h2><p className="drawer-owner">{t.by} {selected.owner} · {selected.updated}</p></div><span className={`status-pill status-pill--${selected.status.toLowerCase()}`}>{selected.status === 'Published' ? t.statusPublished : t.statusDraft}</span></div>
            <div className="detail-tabs">{([['overview', t.overviewTab], ['questions', t.questions], ['board', t.board]] as [DetailTab, string][]).map(([key, label]) => <button className={detailTab === key ? 'is-active' : ''} key={key} type="button" onClick={() => setDetailTab(key)}>{label}</button>)}</div>
            {detailTab === 'overview' && <div className="detail-panel"><p className="detail-description">{selected.description}</p><div className="detail-stats"><span><b>{selected.views}</b><small>{t.views}</small></span><span><b>{selected.features.length.toString().padStart(2, '0')}</b><small>{t.features}</small></span><span><b>{selected.demoUrl ? '01' : '—'}</b><small>{t.demo}</small></span></div><h3>{t.features}</h3><ul className="feature-list">{selected.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul><div className="tag-row">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{selected.demoUrl ? <a className="primary-button" href={selected.demoUrl} target="_blank" rel="noreferrer">{t.openDemo} <span>↗</span></a> : <button className="secondary-button" type="button" onClick={() => notify(t.noDemo)}>{t.noDemo}</button>}{canManageSelected && <div className="project-manage-actions"><button className="secondary-button" type="button" onClick={() => openProjectEditor(selected)}>{t.edit}</button><button className="secondary-button" type="button" onClick={() => toggleProjectStatus(selected)}>{selected.status === 'Published' ? t.moveToDraft : t.publish}</button><button className="danger-button" type="button" onClick={() => removeProject(selected)}>{t.delete}</button></div>}</div>}
            {detailTab === 'questions' && <div className="detail-panel"><div className="question-list">{selectedQuestions.length === 0 ? <p className="empty-detail">{t.noQuestions}</p> : selectedQuestions.map((item) => <div className="question-item" key={item.id}><span className="question-avatar">{item.initials}</span><div className="question-copy"><div className="question-meta"><b>{item.author}</b><small>{item.role} · {item.time}</small></div><p>{item.text}</p>{item.answer && <div className="question-answer"><span className="answer-avatar">{item.answer.initials}</span><div><div className="question-meta"><b>{item.answer.author}</b><small>{t.reply}</small></div><p>{item.answer.text}</p></div></div>}</div></div>)}</div><form className="question-form" onSubmit={postQuestion}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t.ask} aria-label={t.ask} /><button className="primary-button" type="submit">{t.post}</button></form><form className="review-form" onSubmit={postReview}><div className="review-form-heading"><div><b>{t.leaveFeedback}</b><small>{t.feedbackPlaceholder}</small></div><span>{reviewRating} / 5</span></div><div className="review-form-row"><div className="star-rating" role="group" aria-label={t.averageScore}>{[1, 2, 3, 4, 5].map((rating) => <button className={rating <= Number(reviewRating) ? 'is-active' : ''} key={rating} type="button" aria-label={`${rating} / 5`} aria-pressed={Number(reviewRating) === rating} onClick={() => setReviewRating(String(rating))}>★</button>)}</div><input value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder={t.feedbackPlaceholder} aria-label={t.feedbackPlaceholder} /><button className="primary-button" type="submit">{t.saveFeedback}</button></div></form></div>}
            {detailTab === 'board' && <div className="detail-panel"><div className="board-grid board-grid--interactive">{boardColumns.map((column) => <section className="board-column" key={column.key}><div className="board-column-heading"><span>{column.index} / {column.label}</span><b>{boardItems.filter((item) => item.column === column.key).length}</b></div><div className="board-items">{boardLoading ? <p className="empty-detail">{t.boardLoading}</p> : boardItems.filter((item) => item.column === column.key).map((item) => <article className="board-item" key={item.id}><b>{item.title}</b><i>{item.detail}</i>{canManageSelected && column.key !== 'done' && <button type="button" onClick={() => moveBoardItem(item)}>{t.boardMove} →</button>}</article>)}{!boardLoading && boardItems.filter((item) => item.column === column.key).length === 0 && <p className="empty-detail">{t.boardEmpty}</p>}</div></section>)}</div>{canManageSelected && <form className="board-form" onSubmit={addBoardItem}><b>{t.boardAddTask}</b><input value={boardTitle} onChange={(event) => setBoardTitle(event.target.value)} placeholder={t.boardTaskTitle} aria-label={t.boardTaskTitle} required /><input value={boardDetail} onChange={(event) => setBoardDetail(event.target.value)} placeholder={t.boardTaskDetail} aria-label={t.boardTaskDetail} /><select value={boardColumn} onChange={(event) => setBoardColumn(event.target.value as BoardColumn)} aria-label={t.boardTaskColumn}><option value="todo">{t.boardColumnTodo}</option><option value="progress">{t.boardColumnProgress}</option><option value="done">{t.boardColumnDone}</option></select><button className="primary-button" type="submit">{t.boardAdd}</button></form>}<div className="board-review"><span className="board-review-mark">✦</span><div><b>{t.latestFeedback}</b><p>{reviews.find((item) => item.projectId === selected.id)?.text || t.boardFallback}</p></div></div></div>}
          </div>
        </aside>
      </div>}

      {showAdd && <div className="drawer-backdrop" role="presentation" onClick={closeProjectComposer}><form className="add-drawer" role="dialog" aria-modal="true" aria-labelledby="add-drawer-title" onSubmit={handleAdd} onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">PUBLISH / 02</span><button className="close-button" type="button" aria-label={t.close} onClick={closeProjectComposer}>×</button></div><h2 id="add-drawer-title">{t.addTitle}</h2><p>{t.addBody}</p><div className="drawer-callout"><span className="profile-avatar">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : profile.avatar}</span><p><b>{profile.name}</b><small>{profile.handle} · {profile.track || t.createProfile}</small></p></div><label>{t.title}<input name="title" required placeholder="JDU / ..." /></label><label>{t.owner}<input name="owner" required defaultValue={profile.name} placeholder="Your name" /></label><label>{t.category}<select name="category" defaultValue={profile.track || 'Culture + code'}><option>Learning systems</option><option>Community tools</option><option>Culture + code</option></select></label><label>{t.description}<textarea name="description" required placeholder="What does this project make possible?" rows={4} /></label><label>{t.demoUrl}<input name="demoUrl" type="url" placeholder="https://..." /></label><label>{t.projectStatus}<select name="status" defaultValue="Draft"><option value="Draft">{t.statusDraft}</option><option value="Published">{t.statusPublished}</option></select></label><label className="media-picker"><span className={`media-picker-preview ${projectCoverPreview ? 'has-image' : ''}`}>{projectCoverPreview ? <img src={projectCoverPreview} alt="" /> : <span className="media-picker-plus">＋</span>}</span><span className="media-picker-copy"><b>{t.coverImage}</b><small>{projectCoverFile?.name || t.coverHint}</small></span><span className="media-picker-arrow">↗</span><input name="cover" type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" onChange={handleProjectCoverChange} /></label><button className="primary-button" type="submit">{t.save}<span>↗</span></button></form></div>}

      {showEdit && editingProject && <div className="drawer-backdrop" role="presentation" onClick={closeProjectEditor}><form className="add-drawer" role="dialog" aria-modal="true" aria-labelledby="edit-drawer-title" onSubmit={handleEdit} onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">EDIT / {editingProject.id}</span><button className="close-button" type="button" aria-label={t.close} onClick={closeProjectEditor}>×</button></div><h2 id="edit-drawer-title">{t.edit}</h2><p>{t.editBody}</p><label>{t.title}<input name="title" required defaultValue={editingProject.title} /></label><label>{t.owner}<input name="owner" required defaultValue={editingProject.owner} /></label><label>{t.category}<select name="category" defaultValue={editingProject.category}><option>Learning systems</option><option>Community tools</option><option>Culture + code</option></select></label><label>{t.description}<textarea name="description" required defaultValue={editingProject.description} rows={4} /></label><label>{t.demoUrl}<input name="demoUrl" type="url" defaultValue={editingProject.demoUrl} placeholder="https://..." /></label><label>{t.projectStatus}<select name="status" defaultValue={editingProject.status}><option value="Draft">{t.statusDraft}</option><option value="Published">{t.statusPublished}</option></select></label><label className="media-picker"><span className={`media-picker-preview ${projectCoverPreview ? 'has-image' : ''}`}>{projectCoverPreview ? <img src={projectCoverPreview} alt="" /> : <span className="media-picker-plus">＋</span>}</span><span className="media-picker-copy"><b>{t.coverImage}</b><small>{projectCoverFile?.name || t.coverHint}</small></span><span className="media-picker-arrow">↗</span><input name="cover" type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" onChange={handleProjectCoverChange} /></label><button className="primary-button" type="submit">{t.save}<span>↗</span></button></form></div>}

      {showJoin && <div className="drawer-backdrop" role="presentation" onClick={closeRegistration}><form className="join-drawer" role="dialog" aria-modal="true" aria-labelledby="join-drawer-title" onSubmit={handleRegistration} onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">JOIN JDU</span><button className="close-button" type="button" aria-label={t.close} onClick={closeRegistration}>×</button></div><div className="join-heading"><span className="join-mark" aria-hidden="true"><b>J</b><i /></span><div><h2 id="join-drawer-title">{t.joinTitle}</h2><p>{t.joinBody}</p></div></div><div className="join-methods" role="tablist" aria-label={t.join}><button className={registrationChannel === 'email' ? 'is-active' : ''} type="button" role="tab" aria-selected={registrationChannel === 'email'} onClick={() => { setRegistrationChannel('email'); setRegistrationContact(''); }}><span>✉</span>{t.emailTab}</button><button className={registrationChannel === 'telegram' ? 'is-active' : ''} type="button" role="tab" aria-selected={registrationChannel === 'telegram'} onClick={() => { setRegistrationChannel('telegram'); setRegistrationContact(''); }}><span>◉</span>{t.telegramTab}</button></div><div className="join-form"><label>{t.joinName}<input value={registrationName} onChange={(event) => setRegistrationName(event.target.value)} required autoComplete="name" /></label><label>{registrationChannel === 'email' ? t.emailAddress : t.telegramUsername}<input value={registrationContact} onChange={(event) => setRegistrationContact(event.target.value)} required type={registrationChannel === 'email' ? 'email' : 'text'} inputMode={registrationChannel === 'email' ? 'email' : 'text'} placeholder={registrationChannel === 'email' ? 'name@example.com' : '@username'} autoComplete={registrationChannel === 'email' ? 'email' : 'username'} /></label></div><p className="join-note"><span>i</span>{t.joinNote}</p><button className="primary-button join-submit" type="submit" disabled={registrationBusy}>{registrationBusy ? '...' : t.joinSubmit}<span>↗</span></button></form></div>}

      {showProfile && <div className="drawer-backdrop" role="presentation" onClick={closeProfile}><form className="profile-drawer" role="dialog" aria-modal="true" aria-labelledby="profile-drawer-title" onSubmit={handleProfileSave} onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">CREATOR PROFILE</span><button className="close-button" type="button" aria-label={t.close} onClick={closeProfile}>×</button></div><div className="profile-heading"><div><h2 id="profile-drawer-title">{profileComplete ? t.editProfile : t.profileTitle}</h2><p>{profileComplete ? t.profileEditBody : t.profileBody}</p></div><span className="profile-status"><i />{profileComplete ? t.profileReady : t.createProfile}</span></div><div className="profile-photo-section"><label className="profile-avatar-picker"><span className="profile-avatar-image">{profilePhotoPreview || profileDraft.avatarUrl ? <img src={profilePhotoPreview || profileDraft.avatarUrl} alt="" /> : profileDraft.avatar}</span><span className="profile-avatar-overlay"><b>＋</b><small>{t.choosePhoto}</small></span><input className="visually-hidden" name="avatar" type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" onChange={handleProfilePhotoChange} /></label><div className="profile-photo-copy"><b>{t.avatarPhoto}</b><span>{profilePhotoFile?.name || t.photoHint}</span><small>{profileDraft.handle}</small></div></div><div className="profile-form-grid"><label>{t.profileName}<input name="name" required defaultValue={profileDraft.name} placeholder="Your name" /></label><label>{t.profileRole}<input name="role" required defaultValue={profileDraft.role} placeholder="Student creator" /></label><label className="profile-field-wide">{t.profileTrack}<select name="track" required defaultValue={profileDraft.track}><option value="" disabled>Select a track</option><option>Learning systems</option><option>Community tools</option><option>Culture + code</option></select></label><label className="profile-field-wide">{t.profileBio}<textarea name="bio" required defaultValue={profileDraft.bio} placeholder="What do you make, research, or care about?" rows={4} /></label></div><div className="drawer-actions profile-actions"><button className="primary-button" type="submit">{t.saveProfile}<span>↗</span></button><button className="secondary-button" type="button" onClick={closeProfile}>{t.maybeLater}</button></div></form></div>}

      {toast && <div className="toast" role="status">{toast}<button type="button" onClick={() => setToast('')}>×</button></div>}
    </main>
  );
}
