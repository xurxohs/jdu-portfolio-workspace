'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Language = 'EN' | 'RU' | 'UZ' | 'JP';
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
};

type Profile = {
  name: string;
  handle: string;
  role: string;
  track: string;
  bio: string;
  avatar: string;
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
    completeProfile: 'Complete profile',
    profileTitle: 'Create your profile',
    profileBody: 'Set up your creator identity before you publish a project to the JDU archive.',
    profileName: 'Display name',
    profileRole: 'Role',
    profileTrack: 'Track / category',
    profileBio: 'Short bio',
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
    completeProfile: 'Заполнить профиль',
    profileTitle: 'Создай свой профиль',
    profileBody: 'Сначала укажи информацию о себе — затем опубликуй проект в архиве JDU.',
    profileName: 'Имя или название',
    profileRole: 'Роль',
    profileTrack: 'Направление / категория',
    profileBio: 'Коротко о себе',
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
    completeProfile: 'Profilni to‘ldirish',
    profileTitle: 'Profilingizni yarating',
    profileBody: 'Avval ijodkor ma’lumotlarini kiriting, keyin loyihani JDU arxiviga joylang.',
    profileName: 'Ism yoki nom',
    profileRole: 'Rol',
    profileTrack: 'Yo‘nalish / kategoriya',
    profileBio: 'Qisqa bio',
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
    completeProfile: 'プロフィールを完成',
    profileTitle: 'プロフィールを作成',
    profileBody: '作者情報を設定してから、JDUアーカイブに作品を公開しましょう。',
    profileName: '表示名',
    profileRole: '役割',
    profileTrack: '分野 / カテゴリー',
    profileBio: '短い自己紹介',
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
  },
};

const categories = ['All', 'Learning systems', 'Community tools', 'Culture + code'];

function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <div className={`project-visual project-visual--${project.accent} ${large ? 'project-visual--large' : ''}`}>
      <div className="visual-grid" />
      <div className="visual-window">
        <div className="visual-window-top"><span /><span /><span /><b>{project.id} / JDU</b></div>
        <div className="visual-window-body"><div className="visual-sidebar"><i /><i /><i /><i /></div><div className="visual-canvas"><span className="visual-chip">{project.category}</span><strong>{project.title.split(' ')[0]}</strong><em>{project.id}</em><div className="visual-bars"><i /><i /><i /></div></div></div>
      </div>
      <span className="visual-orb" />
      <span className="visual-label">JDU / {project.id}</span>
    </div>
  );
}

function NavIcon({ type }: { type: string }) {
  return <span aria-hidden="true" className={`nav-icon nav-icon--${type}`}><i /><i /><i /></span>;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('EN');
  const [view, setView] = useState<View>('projects');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [showAdd, setShowAdd] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [profileDraft, setProfileDraft] = useState<Profile>(initialProfile);
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<Record<string, Question[]>>(initialQuestions);
  const [reviews, setReviews] = useState<Review[]>(feedback);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState('5');
  const [toast, setToast] = useState('');
  const t = ui[language];
  const featured = projects[0];

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
    const timer = window.setTimeout(() => {
      const storedProfile = window.localStorage.getItem('jdu-profile');
      if (!storedProfile) return;
      try {
        const saved = JSON.parse(storedProfile) as Partial<Profile>;
        setProfile((current) => ({ ...current, ...saved }));
      } catch {
        // Ignore an old or incomplete local profile and keep the demo profile visible.
      }
    }, 0);
    return () => window.clearTimeout(timer);
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
  const setupPercent = !profileComplete ? (profile.track.trim() || profile.bio.trim() ? 44 : 38) : !projectComplete ? 58 : !demoComplete ? 82 : 100;
  const setupLabel = !profileComplete ? t.completeProfile : !projectComplete ? t.addFirstProject : !demoComplete ? t.demoLinks : t.profileReady;

  function selectProject(project: Project) {
    setSelected(project);
    setDetailTab('overview');
    setQuestion('');
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

  function openProfile() {
    setProfileDraft(profile);
    setShowProfile(true);
  }

  function openProjectComposer() {
    if (!profileComplete) {
      openProfile();
      notify(t.finishProfileFirst);
      return;
    }
    setShowAdd(true);
  }

  function continueSetup() {
    if (!profileComplete) {
      openProfile();
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

  function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const role = String(form.get('role') || '').trim();
    const track = String(form.get('track') || '').trim();
    const bio = String(form.get('bio') || '').trim();
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'JD';
    const handle = `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'jdu-creator'}`;
    const nextProfile = { name, role, track, bio, avatar: initials, handle };
    setProfile(nextProfile);
    setProfileDraft(nextProfile);
    window.localStorage.setItem('jdu-profile', JSON.stringify(nextProfile));
    setShowProfile(false);
    setShowAdd(true);
    notify(t.profileSaved);
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get('title') || 'Untitled project'),
      owner: String(form.get('owner') || 'JDU student'),
      category: String(form.get('category') || 'Culture + code'),
      description: String(form.get('description') || 'A new project in the JDU portfolio workspace.'),
      demoUrl: String(form.get('demoUrl') || ''),
    };
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Project could not be saved');
      const saved = await response.json() as Project;
      setProjects((current) => [saved, ...current]);
      setShowAdd(false);
      notify(t.added);
      event.currentTarget.reset();
    } catch {
      notify('The project could not be saved. Please try again.');
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

  const viewTitle = view === 'review' ? t.review : view === 'categories' ? t.categories : view === 'overview' ? t.overview : t.projects;
  const selectedQuestions = selected ? questions[selected.id] || [] : [];
  const averageRating = reviews.length ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1) : '—';
  const categoryCards = categories.slice(1).map((item, index) => ({
    name: item,
    projects: projects.filter((project) => project.category === item),
    accent: (['violet', 'orange', 'blue'] as Accent[])[index],
  }));

  return (
    <main className={`dashboard ${sidebarCollapsed ? 'dashboard--collapsed' : ''} ${sidebarOpen ? 'dashboard--mobile-open' : ''}`}>
      <button className="mobile-scrim" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
      <aside className="sidebar">
        <div className="sidebar-header"><a className="workspace-logo" href="#top"><span className="workspace-logo-mark">J</span><span className="sidebar-copy">JDU <b>Portfolio</b></span></a><button className="sidebar-close" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>×</button></div>
        <button className="profile-row" type="button" onClick={openProfile} aria-label={t.profile} title={t.profile}><span className="profile-avatar">{profile.avatar}</span><span className="sidebar-copy"><b>{profile.name}</b><small><i className={profileComplete ? 'is-ready' : 'is-pending'} /> {profileComplete ? t.profileReady : t.completeProfile}</small></span><span className="profile-chevron" aria-hidden="true">↗</span></button>
        <nav className="sidebar-nav" aria-label="Portfolio navigation">
          {([['overview', t.overview, 'home'], ['projects', t.projects, 'projects'], ['categories', t.categories, 'categories'], ['review', t.review, 'review']] as [View, string, string][]).map(([key, label, icon]) => <button className={view === key ? 'is-active' : ''} key={key} type="button" onClick={() => navigate(key)}><NavIcon type={icon} /><span className="sidebar-copy">{label}</span>{key === 'projects' && <span className="nav-count">{projects.length}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom sidebar-copy"><div className="sidebar-rule" /><p>{profileComplete ? 'PUBLISHING PATH' : 'SETUP / 03'}</p><div className="mini-progress"><span style={{ width: `${setupPercent}%` }} /></div><div className="mini-progress-row"><span>{setupLabel}</span><b>{setupPercent}%</b></div><button type="button" onClick={continueSetup}>{t.continueSetup} <span>↗</span></button></div>
        <button className="logout-button" type="button" onClick={() => notify('This is a portfolio demo workspace.') }><NavIcon type="exit" /><span className="sidebar-copy">Workspace settings</span></button>
      </aside>

      <section className="main-panel" id="top">
        <header className="main-header"><div className="header-left"><button className="sidebar-toggle" type="button" aria-label="Toggle sidebar" onClick={() => { setSidebarCollapsed((current) => !current); setSidebarOpen(true); }}><span /><span /><span /></button><div><p>{t.workspace}</p><h1>{viewTitle}</h1></div></div><div className="header-actions"><div className="language-switcher" aria-label="Language"><span className="language-label">LANG</span>{(['EN', 'RU', 'UZ', 'JP'] as Language[]).map((item) => <button className={language === item ? 'is-active' : ''} key={item} type="button" onClick={() => setLanguage(item)} aria-pressed={language === item} title={item}>{item}</button>)}</div><button className="header-add" type="button" onClick={openProjectComposer}><span>+</span>{t.add}</button><button className="header-avatar" type="button" onClick={openProfile} aria-label={t.profile}>{profile.avatar}</button></div></header>

        <div className="content-area">
          <section className="hero-grid" id="overview">
            <article className="welcome-card"><div className="welcome-copy"><p className="eyebrow">JDU / PORTFOLIO 2026</p><h2>{t.featuredTitle}</h2><p>{t.featuredBody}</p><div className="welcome-stats"><span><b>{projects.length.toString().padStart(2, '0')}</b><small>PROJECTS</small></span><span><b>04</b><small>LANGUAGES</small></span><span><b>01</b><small>ARCHIVE</small></span></div><button className="primary-button" type="button" onClick={() => selectProject(featured)}>{t.openProject}<span>↗</span></button></div><div className="welcome-visual"><ProjectVisual project={featured} large /><div className="visual-caption"><span>{t.featured}</span><b>{featured.title}</b></div></div></article>
            <aside className="readiness-card"><div className="card-heading"><div><p className="eyebrow">02 / SETUP PATH</p><h2>{t.readiness}</h2></div><span className="more-button">•••</span></div><div className="readiness-ring"><span><b>{setupPercent}</b><small>% ready</small></span></div><p className="readiness-copy">{t.readinessBody}</p><ul className="checklist"><li className={profileComplete ? 'done' : ''}><span>{profileComplete ? '✓' : '01'}</span> {profileComplete ? t.profileReady : t.createProfile}</li><li className={projectComplete ? 'done' : ''}><span>{projectComplete ? '✓' : '02'}</span> {projectComplete ? t.projectLibrary : t.addFirstProject}</li><li className="done"><span>✓</span> {t.languageSet}</li><li className="done"><span>✓</span> {t.communityTools}</li><li className={demoComplete ? 'done' : ''}><span>{demoComplete ? '✓' : '03'}</span> {demoComplete ? t.demoReady : t.demoLinks}</li></ul><button className="soft-button" type="button" onClick={continueSetup}>{t.continueSetup} <span>↗</span></button></aside>
          </section>

          <section className="guide-card"><div className="guide-preview"><span className="guide-icon">JDU</span><span className="guide-play">▶</span></div><div className="guide-copy"><p className="eyebrow">START HERE · 03 MIN</p><h2>{t.guide}</h2><p>{t.guideBody}</p></div><button className="guide-button" type="button" onClick={() => notify('Guide mode will open once the portfolio content is connected.')}>{t.readGuide}<span>↗</span></button></section>

          <section className="library-section" id="library"><div className="section-heading"><div><p className="eyebrow">03 / LIBRARY</p><h2>{t.library}</h2><p>{t.libraryBody}</p></div><button className="outline-button" type="button" onClick={openProjectComposer}>+ {t.add}</button></div><div className="library-toolbar"><div className="status-tabs">{[['All', t.all], ['Published', t.published], ['Draft', t.drafts]].map(([key, label]) => <button className={filter === key ? 'is-active' : ''} key={key} type="button" onClick={() => setFilter(key)}>{label}</button>)}</div><div className="category-selects"><select aria-label={t.category} value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item === 'All' ? t.all : item}</option>)}</select><label className="search-input"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /></label></div></div><div className="project-grid">{filteredProjects.map((project) => <article className="portfolio-card" key={project.id}><button className="portfolio-card-main" type="button" onClick={() => selectProject(project)}><ProjectVisual project={project} /><div className="portfolio-card-body"><div className="portfolio-card-title"><h3>{project.title}</h3><span>↗</span></div><p>{project.description}</p></div></button><div className="portfolio-card-footer"><span>{project.category}</span><span className={`status-pill status-pill--${project.status.toLowerCase()}`}>{project.status}</span></div></article>)}</div>{filteredProjects.length === 0 && <div className="empty-library">No projects match this filter.</div>}</section>

          <section className="categories-section" id="categories"><div className="section-heading"><div><p className="eyebrow">04 / CATEGORIES</p><h2>{t.categories}</h2><p>{t.libraryBody}</p></div><button className="outline-button" type="button" onClick={() => navigate('projects')}>{t.projects} <span>↗</span></button></div><div className="category-grid">{categoryCards.map((item, index) => { const publishedCount = item.projects.filter((project) => project.status === 'Published').length; return <button className={`category-card category-card--${item.accent}`} key={item.name} type="button" onClick={() => openCategory(item.name)}><div className="category-card-top"><span className="category-index">{String(index + 1).padStart(2, '0')} / JDU</span><span className="category-signal" aria-hidden="true" /></div><h3>{item.name}</h3><p>{t.categoryStats}: {item.projects.length} · {t.publishedStats}: {publishedCount}</p><span className="category-card-footer">{t.open} <span>↗</span></span></button>; })}</div></section>

          <section className="review-strip" id="review"><div><p className="eyebrow">05 / READY TO SHARE</p><h2>Every project deserves a clear story.</h2><p>Before the report meeting, make sure the viewer can understand the problem, the solution, and where to try it.</p></div><div className="review-items"><span><b>01</b> Explain the problem</span><span><b>02</b> Show the flow</span><span><b>03</b> Link the demo</span></div></section>

          <section className="feedback-section" id="feedback"><div className="section-heading feedback-heading"><div><p className="eyebrow">06 / COMMUNITY PULSE</p><h2>{t.feedback}</h2><p>{t.feedbackBody}</p></div><div className="feedback-score"><b>{averageRating}</b><span>★★★★★</span><small>{t.averageScore}</small></div></div><div className="feedback-grid">{reviews.map((item) => <button className="feedback-card" type="button" key={item.id} onClick={() => { const project = projects.find((candidate) => candidate.id === item.projectId); if (project) { selectProject(project); setDetailTab('questions'); } }}><div className="feedback-card-top"><span className="feedback-avatar">{item.initials}</span><span className="feedback-meta"><b>{item.author}</b><small>{item.role}</small></span><span className="feedback-stars">{'★'.repeat(item.rating)}<i>{'★'.repeat(5 - item.rating)}</i></span></div><p>“{item.text}”</p><span className="feedback-project">{item.project}<span>↗</span></span></button>)}</div></section>
        </div>
      </section>

      {selected && <div className="drawer-backdrop" role="presentation" onClick={() => setSelected(null)}><aside className="project-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">{t.projectDetails} / {selected.id}</span><button className="close-button" type="button" aria-label={t.close} onClick={() => setSelected(null)}>×</button></div><ProjectVisual project={selected} large /><div className="drawer-content"><div className="drawer-title-row"><div><p className="eyebrow">{selected.category}</p><h2 id="drawer-title">{selected.title}</h2><p className="drawer-owner">{t.by} {selected.owner} · {selected.updated}</p></div><span className={`status-pill status-pill--${selected.status.toLowerCase()}`}>{selected.status}</span></div><div className="detail-tabs">{([['overview', t.overviewTab], ['questions', t.questions], ['board', t.board]] as [DetailTab, string][]).map(([key, label]) => <button className={detailTab === key ? 'is-active' : ''} key={key} type="button" onClick={() => setDetailTab(key)}>{label}</button>)}</div>{detailTab === 'overview' && <div className="detail-panel"><p className="detail-description">{selected.description}</p><div className="detail-stats"><span><b>{selected.views}</b><small>{t.views}</small></span><span><b>{selected.features.length.toString().padStart(2, '0')}</b><small>{t.features}</small></span><span><b>{selected.demoUrl ? '01' : '—'}</b><small>{t.demo}</small></span></div><h3>{t.features}</h3><ul className="feature-list">{selected.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul><div className="tag-row">{selected.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>{selected.demoUrl ? <a className="primary-button" href={selected.demoUrl} target="_blank" rel="noreferrer">Open demo <span>↗</span></a> : <button className="soft-button" type="button" onClick={() => notify(t.noDemo)}>{t.noDemo} <span>↗</span></button>}</div>}{detailTab === 'questions' && <div className="detail-panel"><div className="question-list">{selectedQuestions.length === 0 ? <p className="empty-detail">{t.noQuestions}</p> : selectedQuestions.map((item) => <div className="question-item" key={item.id}><span className="question-avatar">{item.initials}</span><div className="question-copy"><div className="question-meta"><b>{item.author}</b><small>{item.role} · {item.time}</small></div><p>{item.text}</p>{item.answer && <div className="question-answer"><span className="answer-avatar">{item.answer.initials}</span><div><div className="question-meta"><b>{item.answer.author}</b><small>{t.reply}</small></div><p>{item.answer.text}</p></div></div>}</div></div>)}</div><form className="question-form" onSubmit={postQuestion}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t.ask} aria-label={t.ask} /><button className="primary-button" type="submit">{t.post} <span>↗</span></button></form><form className="review-form" onSubmit={postReview}><div className="review-form-heading"><b>{t.leaveFeedback}</b><span>1–5</span></div><div className="review-form-row"><select aria-label={t.averageScore} value={reviewRating} onChange={(event) => setReviewRating(event.target.value)}><option value="5">★★★★★</option><option value="4">★★★★☆</option><option value="3">★★★☆☆</option><option value="2">★★☆☆☆</option><option value="1">★☆☆☆☆</option></select><input value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder={t.feedbackPlaceholder} aria-label={t.feedbackPlaceholder} /><button className="primary-button" type="submit">{t.saveFeedback} <span>↗</span></button></div></form></div>}{detailTab === 'board' && <div className="detail-panel"><div className="board-grid"><div><span>01 / TODO</span><b>Shape the story</b><i>Problem statement</i><i>Audience notes</i></div><div><span>02 / IN PROGRESS</span><b>Build the flow</b><i>Core interaction</i><i>Responsive pass</i></div><div><span>03 / DONE</span><b>Show the work</b><i>Project concept</i><i>Visual direction</i></div></div><div className="board-review"><span className="board-review-mark">✦</span><div><b>Latest feedback</b><p>{reviews.find((item) => item.projectId === selected.id)?.text || 'The project is ready for another round of notes.'}</p></div></div></div>}</div></aside></div>}

      {showAdd && <div className="drawer-backdrop" role="presentation" onClick={() => setShowAdd(false)}><form className="add-drawer" role="dialog" aria-modal="true" aria-labelledby="add-drawer-title" onSubmit={handleAdd} onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">PUBLISH / 02</span><button className="close-button" type="button" aria-label={t.close} onClick={() => setShowAdd(false)}>×</button></div><h2 id="add-drawer-title">{t.addTitle}</h2><p>{t.addBody}</p><div className="drawer-callout"><span>✦</span><p><b>{profile.name}</b><small>{profile.handle} · {profile.track || t.createProfile}</small></p></div><label>{t.title}<input name="title" required placeholder="JDU / ..." /></label><label>{t.owner}<input name="owner" required defaultValue={profile.name} placeholder="Your name" /></label><label>{t.category}<select name="category" defaultValue={profile.track || 'Culture + code'}><option>Learning systems</option><option>Community tools</option><option>Culture + code</option></select></label><label>{t.description}<textarea name="description" required placeholder="What does this project make possible?" rows={4} /></label><label>{t.demoUrl}<input name="demoUrl" type="url" placeholder="https://..." /></label><button className="primary-button" type="submit">{t.save}<span>↗</span></button></form></div>}
      {showProfile && <div className="drawer-backdrop" role="presentation" onClick={() => setShowProfile(false)}><form className="profile-drawer" role="dialog" aria-modal="true" aria-labelledby="profile-drawer-title" onSubmit={handleProfileSave} onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">PROFILE / 01</span><button className="close-button" type="button" aria-label={t.close} onClick={() => setShowProfile(false)}>×</button></div><div className="profile-steps" aria-label={t.profile}><span className="is-active">01 {t.profile}</span><span>02 {t.add}</span><span>03 {t.demo}</span></div><h2 id="profile-drawer-title">{t.profileTitle}</h2><p>{t.profileBody}</p><div className="profile-preview"><span className="profile-avatar">{profileDraft.avatar}</span><div><b>{profileDraft.name}</b><small>{profileDraft.handle}</small></div></div><label>{t.profileName}<input name="name" required defaultValue={profileDraft.name} placeholder="Your name" /></label><label>{t.profileRole}<input name="role" required defaultValue={profileDraft.role} placeholder="Student creator" /></label><label>{t.profileTrack}<select name="track" required defaultValue={profileDraft.track}><option value="" disabled>Select a track</option><option>Learning systems</option><option>Community tools</option><option>Culture + code</option></select></label><label>{t.profileBio}<textarea name="bio" required defaultValue={profileDraft.bio} placeholder="What do you make, research, or care about?" rows={4} /></label><div className="drawer-actions"><button className="primary-button" type="submit">{t.saveProfile}<span>↗</span></button><button className="secondary-button" type="button" onClick={() => setShowProfile(false)}>{t.maybeLater}</button></div></form></div>}
      {toast && <div className="toast" role="status">{toast}<button type="button" onClick={() => setToast('')}>×</button></div>}
    </main>
  );
}
