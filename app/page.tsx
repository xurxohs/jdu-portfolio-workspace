'use client';

import { FormEvent, useMemo, useState } from 'react';

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

const ui: Record<Language, Record<string, string>> = {
  EN: {
    workspace: 'JDU portfolio workspace',
    overview: 'Overview',
    projects: 'Projects',
    categories: 'Categories',
    review: 'Portfolio review',
    status: 'Open archive',
    add: 'Add project',
    featured: 'Featured project',
    featuredTitle: 'Make work easy to find.',
    featuredBody: 'One focused home for student systems, stories, and prototypes — ready for the next person to open.',
    openProject: 'Open project',
    readiness: 'Portfolio readiness',
    readinessBody: 'The structure is ready. Add your real work, links, and story to make it yours.',
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
    addBody: 'Create a project card now. We can connect the real database and file uploads next.',
    title: 'Project name',
    owner: 'Creator / team',
    category: 'Category',
    description: 'Short description',
    demoUrl: 'Demo URL (optional)',
    save: 'Save project',
    close: 'Close',
    added: 'Project added to this workspace.',
    noQuestions: 'No questions yet. Start the conversation.',
    ask: 'Ask a question',
    post: 'Post',
    reviewReady: '3 of 4 essentials ready',
  },
  RU: {
    workspace: 'рабочее пространство JDU',
    overview: 'Обзор',
    projects: 'Проекты',
    categories: 'Категории',
    review: 'Проверка портфолио',
    status: 'Открытый архив',
    add: 'Добавить проект',
    featured: 'Избранный проект',
    featuredTitle: 'Пусть работу легко найти.',
    featuredBody: 'Одно место для систем, историй и прототипов студентов — чтобы следующий человек мог их открыть.',
    openProject: 'Открыть проект',
    readiness: 'Готовность портфолио',
    readinessBody: 'Структура готова. Добавь реальные проекты, ссылки и историю — и портфолио станет твоим.',
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
    addBody: 'Создай карточку проекта. Позже подключим настоящую базу и загрузку файлов.',
    title: 'Название проекта',
    owner: 'Автор / команда',
    category: 'Категория',
    description: 'Краткое описание',
    demoUrl: 'URL демо (необязательно)',
    save: 'Сохранить проект',
    close: 'Закрыть',
    added: 'Проект добавлен в это рабочее пространство.',
    noQuestions: 'Вопросов пока нет. Начни обсуждение.',
    ask: 'Задать вопрос',
    post: 'Опубликовать',
    reviewReady: '3 из 4 пунктов готово',
  },
  UZ: {
    workspace: 'JDU portfolio ish maydoni',
    overview: 'Umumiy',
    projects: 'Loyihalar',
    categories: 'Kategoriyalar',
    review: 'Portfolio tekshiruvi',
    status: 'Ochiq arxiv',
    add: 'Loyiha qo‘shish',
    featured: 'Tanlangan loyiha',
    featuredTitle: 'Ishni topishni oson qiling.',
    featuredBody: 'Talabalar tizimlari, hikoyalari va prototiplari uchun bitta joy.',
    openProject: 'Loyihani ochish',
    readiness: 'Portfolio tayyorligi',
    readinessBody: 'Tuzilma tayyor. Haqiqiy ishlar, havolalar va hikoyalarni qo‘shing.',
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
    addBody: 'Hozir loyiha kartasini yarating. Keyin haqiqiy baza va fayl yuklashni ulaymiz.',
    title: 'Loyiha nomi',
    owner: 'Muallif / jamoa',
    category: 'Kategoriya',
    description: 'Qisqa tavsif',
    demoUrl: 'Demo URL (ixtiyoriy)',
    save: 'Loyihani saqlash',
    close: 'Yopish',
    added: 'Loyiha ish maydoniga qo‘shildi.',
    noQuestions: 'Hali savollar yo‘q. Suhbatni boshlang.',
    ask: 'Savol berish',
    post: 'Joylash',
    reviewReady: '4 dan 3 tasi tayyor',
  },
  JP: {
    workspace: 'JDU ポートフォリオワークスペース',
    overview: '概要',
    projects: 'プロジェクト',
    categories: 'カテゴリー',
    review: 'ポートフォリオ確認',
    status: '公開アーカイブ',
    add: '作品を追加',
    featured: '注目の作品',
    featuredTitle: '作品を見つけやすくする。',
    featuredBody: '学生のシステム、物語、プロトタイプをひとつの場所に。',
    openProject: '作品を開く',
    readiness: 'ポートフォリオ準備度',
    readinessBody: '構成は準備できました。作品、リンク、ストーリーを追加してください。',
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
    addBody: '作品カードを作成します。次にデータベースとファイルを接続できます。',
    title: '作品名',
    owner: '作者 / チーム',
    category: 'カテゴリー',
    description: '短い説明',
    demoUrl: 'デモURL（任意）',
    save: '保存',
    close: '閉じる',
    added: '作品をワークスペースに追加しました。',
    noQuestions: '質問はまだありません。',
    ask: '質問する',
    post: '投稿',
    reviewReady: '4項目中3項目が準備済み',
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
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<Record<string, string[]>>({});
  const [toast, setToast] = useState('');
  const t = ui[language];
  const featured = projects[0];

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const statusMatch = filter === 'All' || project.status === filter;
    const categoryMatch = category === 'All' || project.category === category;
    const text = `${project.title} ${project.owner} ${project.category} ${project.tags.join(' ')}`.toLowerCase();
    return statusMatch && categoryMatch && (!query.trim() || text.includes(query.trim().toLowerCase()));
  }), [category, filter, projects, query]);

  function selectProject(project: Project) {
    setSelected(project);
    setDetailTab('overview');
    setQuestion('');
  }

  function navigate(nextView: View) {
    setView(nextView);
    setSidebarOpen(false);
    const target = nextView === 'review' ? 'review' : nextView === 'projects' ? 'library' : 'top';
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3600);
  }

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newProject: Project = {
      id: String(projects.length + 1).padStart(2, '0'),
      title: String(form.get('title') || 'Untitled project'),
      owner: String(form.get('owner') || 'JDU student'),
      category: String(form.get('category') || 'Culture + code'),
      status: 'Draft',
      description: String(form.get('description') || 'A new project in the JDU portfolio workspace.'),
      tags: ['New', 'JDU', 'Draft'],
      accent: 'pink',
      updated: 'Just now',
      views: '—',
      features: ['Project story', 'External link', 'Questions + board'],
      demoUrl: String(form.get('demoUrl') || ''),
    };
    setProjects((current) => [newProject, ...current]);
    setShowAdd(false);
    notify(t.added);
    event.currentTarget.reset();
  }

  function postQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !question.trim()) return;
    setQuestions((current) => ({ ...current, [selected.id]: [...(current[selected.id] || []), question.trim()] }));
    setQuestion('');
    notify('Question added to the project board.');
  }

  const viewTitle = view === 'review' ? t.review : view === 'categories' ? t.categories : view === 'overview' ? t.overview : t.projects;
  const selectedQuestions = selected ? questions[selected.id] || [] : [];

  return (
    <main className={`dashboard ${sidebarCollapsed ? 'dashboard--collapsed' : ''} ${sidebarOpen ? 'dashboard--mobile-open' : ''}`}>
      <button className="mobile-scrim" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
      <aside className="sidebar">
        <div className="sidebar-header"><a className="workspace-logo" href="#top"><span className="workspace-logo-mark">J</span><span className="sidebar-copy">JDU <b>Portfolio</b></span></a><button className="sidebar-close" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>×</button></div>
        <div className="profile-row"><span className="profile-avatar">JD</span><span className="sidebar-copy"><b>JDU Creative Lab</b><small><i /> {t.status}</small></span></div>
        <nav className="sidebar-nav" aria-label="Portfolio navigation">
          {([['overview', t.overview, 'home'], ['projects', t.projects, 'projects'], ['categories', t.categories, 'categories'], ['review', t.review, 'review']] as [View, string, string][]).map(([key, label, icon]) => <button className={view === key ? 'is-active' : ''} key={key} type="button" onClick={() => navigate(key)}><NavIcon type={icon} /><span className="sidebar-copy">{label}</span>{key === 'projects' && <span className="nav-count">{projects.length}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom sidebar-copy"><div className="sidebar-rule" /><p>PORTFOLIO STATUS</p><div className="mini-progress"><span style={{ width: '76%' }} /></div><div className="mini-progress-row"><span>{t.reviewReady}</span><b>76%</b></div><button type="button" onClick={() => navigate('review')}>Open review <span>↗</span></button></div>
        <button className="logout-button" type="button" onClick={() => notify('This is a portfolio demo workspace.') }><NavIcon type="exit" /><span className="sidebar-copy">Workspace settings</span></button>
      </aside>

      <section className="main-panel" id="top">
        <header className="main-header"><div className="header-left"><button className="sidebar-toggle" type="button" aria-label="Toggle sidebar" onClick={() => { setSidebarCollapsed((current) => !current); setSidebarOpen(true); }}><span /><span /><span /></button><div><p>{t.workspace}</p><h1>{viewTitle}</h1></div></div><div className="header-actions"><div className="language-switcher">{(['EN', 'RU', 'UZ', 'JP'] as Language[]).map((item) => <button className={language === item ? 'is-active' : ''} key={item} type="button" onClick={() => setLanguage(item)} aria-pressed={language === item}>{item}</button>)}</div><button className="header-add" type="button" onClick={() => setShowAdd(true)}><span>+</span>{t.add}</button><span className="header-avatar">JD</span></div></header>

        <div className="content-area">
          <section className="hero-grid" id="overview">
            <article className="welcome-card"><div className="welcome-copy"><p className="eyebrow">JDU / PORTFOLIO 2026</p><h2>{t.featuredTitle}</h2><p>{t.featuredBody}</p><div className="welcome-stats"><span><b>{projects.length.toString().padStart(2, '0')}</b><small>PROJECTS</small></span><span><b>04</b><small>LANGUAGES</small></span><span><b>01</b><small>ARCHIVE</small></span></div><button className="primary-button" type="button" onClick={() => selectProject(featured)}>{t.openProject}<span>↗</span></button></div><div className="welcome-visual"><ProjectVisual project={featured} large /><div className="visual-caption"><span>{t.featured}</span><b>{featured.title}</b></div></div></article>
            <aside className="readiness-card"><div className="card-heading"><div><p className="eyebrow">02 / CHECKLIST</p><h2>{t.readiness}</h2></div><span className="more-button">•••</span></div><div className="readiness-ring"><span><b>76</b><small>% ready</small></span></div><p className="readiness-copy">{t.readinessBody}</p><ul className="checklist"><li className="done"><span>✓</span> Project library</li><li className="done"><span>✓</span> Four languages</li><li className="done"><span>✓</span> Questions + board</li><li><span>○</span> Real demo links</li></ul><button className="soft-button" type="button" onClick={() => navigate('review')}>{t.review} <span>↗</span></button></aside>
          </section>

          <section className="guide-card"><div className="guide-preview"><span className="guide-icon">JDU</span><span className="guide-play">▶</span></div><div className="guide-copy"><p className="eyebrow">START HERE · 03 MIN</p><h2>{t.guide}</h2><p>{t.guideBody}</p></div><button className="guide-button" type="button" onClick={() => notify('Guide mode will open once the portfolio content is connected.')}>{t.readGuide}<span>↗</span></button></section>

          <section className="library-section" id="library"><div className="section-heading"><div><p className="eyebrow">03 / LIBRARY</p><h2>{t.library}</h2><p>{t.libraryBody}</p></div><button className="outline-button" type="button" onClick={() => setShowAdd(true)}>+ {t.add}</button></div><div className="library-toolbar"><div className="status-tabs">{[['All', t.all], ['Published', t.published], ['Draft', t.drafts]].map(([key, label]) => <button className={filter === key ? 'is-active' : ''} key={key} type="button" onClick={() => setFilter(key)}>{label}</button>)}</div><div className="category-selects"><select aria-label={t.category} value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item === 'All' ? t.all : item}</option>)}</select><label className="search-input"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /></label></div></div><div className="project-grid">{filteredProjects.map((project) => <article className="portfolio-card" key={project.id}><button className="portfolio-card-main" type="button" onClick={() => selectProject(project)}><ProjectVisual project={project} /><div className="portfolio-card-body"><div className="portfolio-card-title"><h3>{project.title}</h3><span>↗</span></div><p>{project.description}</p></div></button><div className="portfolio-card-footer"><span>{project.category}</span><span className={`status-pill status-pill--${project.status.toLowerCase()}`}>{project.status}</span></div></article>)}</div>{filteredProjects.length === 0 && <div className="empty-library">No projects match this filter.</div>}</section>

          <section className="review-strip" id="review"><div><p className="eyebrow">04 / READY TO SHARE</p><h2>Every project deserves a clear story.</h2><p>Before the report meeting, make sure the viewer can understand the problem, the solution, and where to try it.</p></div><div className="review-items"><span><b>01</b> Explain the problem</span><span><b>02</b> Show the flow</span><span><b>03</b> Link the demo</span></div></section>
        </div>
      </section>

      {selected && <div className="drawer-backdrop" role="presentation" onClick={() => setSelected(null)}><aside className="project-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">{t.projectDetails} / {selected.id}</span><button className="close-button" type="button" aria-label={t.close} onClick={() => setSelected(null)}>×</button></div><ProjectVisual project={selected} large /><div className="drawer-content"><div className="drawer-title-row"><div><p className="eyebrow">{selected.category}</p><h2 id="drawer-title">{selected.title}</h2><p className="drawer-owner">{t.by} {selected.owner} · {selected.updated}</p></div><span className={`status-pill status-pill--${selected.status.toLowerCase()}`}>{selected.status}</span></div><div className="detail-tabs">{([['overview', t.overviewTab], ['questions', t.questions], ['board', t.board]] as [DetailTab, string][]).map(([key, label]) => <button className={detailTab === key ? 'is-active' : ''} key={key} type="button" onClick={() => setDetailTab(key)}>{label}</button>)}</div>{detailTab === 'overview' && <div className="detail-panel"><p className="detail-description">{selected.description}</p><div className="detail-stats"><span><b>{selected.views}</b><small>{t.views}</small></span><span><b>{selected.features.length.toString().padStart(2, '0')}</b><small>{t.features}</small></span><span><b>{selected.demoUrl ? '01' : '—'}</b><small>{t.demo}</small></span></div><h3>{t.features}</h3><ul className="feature-list">{selected.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul><div className="tag-row">{selected.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>{selected.demoUrl ? <a className="primary-button" href={selected.demoUrl} target="_blank" rel="noreferrer">Open demo <span>↗</span></a> : <button className="soft-button" type="button" onClick={() => notify(t.noDemo)}>{t.noDemo} <span>↗</span></button>}</div>}{detailTab === 'questions' && <div className="detail-panel"><div className="question-list">{selectedQuestions.length === 0 ? <p className="empty-detail">{t.noQuestions}</p> : selectedQuestions.map((item, index) => <div className="question-item" key={`${item}-${index}`}><span>JD</span><p>{item}</p></div>)}</div><form className="question-form" onSubmit={postQuestion}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t.ask} aria-label={t.ask} /><button className="primary-button" type="submit">{t.post} <span>↗</span></button></form></div>}{detailTab === 'board' && <div className="detail-panel"><div className="board-grid"><div><span>01 / TODO</span><b>Shape the story</b><i>Problem statement</i><i>Audience notes</i></div><div><span>02 / IN PROGRESS</span><b>Build the flow</b><i>Core interaction</i><i>Responsive pass</i></div><div><span>03 / DONE</span><b>Show the work</b><i>Project concept</i><i>Visual direction</i></div></div></div>}</div></aside></div>}

      {showAdd && <div className="drawer-backdrop" role="presentation" onClick={() => setShowAdd(false)}><form className="add-drawer" onSubmit={handleAdd} onClick={(event) => event.stopPropagation()}><div className="drawer-top"><span className="eyebrow">PROJECT INTAKE / 001</span><button className="close-button" type="button" aria-label={t.close} onClick={() => setShowAdd(false)}>×</button></div><h2>{t.addTitle}</h2><p>{t.addBody}</p><label>{t.title}<input name="title" required placeholder="JDU / ..." /></label><label>{t.owner}<input name="owner" required placeholder="Your name" /></label><label>{t.category}<select name="category" defaultValue="Culture + code"><option>Learning systems</option><option>Community tools</option><option>Culture + code</option></select></label><label>{t.description}<textarea name="description" required placeholder="What does this project make possible?" rows={4} /></label><label>{t.demoUrl}<input name="demoUrl" type="url" placeholder="https://..." /></label><button className="primary-button" type="submit">{t.save}<span>↗</span></button></form></div>}
      {toast && <div className="toast" role="status">{toast}<button type="button" onClick={() => setToast('')}>×</button></div>}
    </main>
  );
}
