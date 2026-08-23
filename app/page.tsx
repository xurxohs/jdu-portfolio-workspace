'use client';

import { FormEvent, useMemo, useState } from 'react';

type Language = 'EN' | 'RU' | 'UZ' | 'JP';

type Project = {
  id: string;
  title: string;
  creator: string;
  track: string;
  year: string;
  status: string;
  blurb: string;
  tags: string[];
  accent: 'lime' | 'blue' | 'violet' | 'orange';
  description: string;
  features: string[];
  metric: string;
  metricLabel: string;
};

const seedProjects: Project[] = [
  {
    id: '01',
    title: 'Nihongo / Talk',
    creator: 'A. Karimova',
    track: 'Learning systems',
    year: '26',
    status: 'Live experiment',
    blurb: 'A conversation lab for people learning Japanese between two worlds.',
    tags: ['Voice', 'Practice', 'JP'],
    accent: 'lime',
    description: 'Nihongo / Talk turns everyday situations into tiny, repeatable conversation loops: hear it, say it, remember it.',
    features: ['Scenario-based practice', 'Pronunciation feedback', 'Learning history'],
    metric: '04',
    metricLabel: 'language modes',
  },
  {
    id: '02',
    title: 'Osh / Table',
    creator: 'M. Rakhimov',
    track: 'Community tools',
    year: '26',
    status: 'Field study',
    blurb: 'A human map of places worth staying for one more cup of tea.',
    tags: ['Map', 'Reviews', 'Local'],
    accent: 'orange',
    description: 'Osh / Table is a multilingual restaurant archive built from local voices, not anonymous star ratings.',
    features: ['Place profiles', 'Community reviews', 'Photo + map context'],
    metric: '12',
    metricLabel: 'neighborhoods',
  },
  {
    id: '03',
    title: 'JDU / Open',
    creator: 'S. Yusupov',
    track: 'Culture + code',
    year: '26',
    status: 'Prototype',
    blurb: 'A living index of student work, ideas, and the next version of Tashkent.',
    tags: ['Archive', 'Search', 'Multi'],
    accent: 'blue',
    description: 'JDU / Open makes student work discoverable: a project can be read, remixed, questioned, and carried forward.',
    features: ['Project stories', 'Questions + board', 'Four-language index'],
    metric: '03',
    metricLabel: 'languages live',
  },
];

const copy: Record<Language, Record<string, string>> = {
  EN: {
    eyebrow: 'JDU digital portfolio · Tashkent',
    heroLineOne: "We don't store projects.",
    heroLineTwo: 'We transmit them.',
    heroBody: 'A living archive of student-made systems, places, and ideas — built to be opened, questioned, and remembered.',
    explore: 'Explore the archive',
    submit: 'Register a project',
    index: 'Index',
    manifesto: 'Manifesto',
    archiveTitle: 'Frequencies worth following.',
    archiveBody: 'Not a shelf. A signal map. Every project is a starting point for someone else.',
    all: 'All signals',
    curation: 'Curation / 01',
    curationTitle: 'Good work leaves a trace.',
    curationBody: 'We document the thinking behind the interface: the problem, the decisions, and the moment the prototype became real.',
    submitTitle: 'Put your signal on the map.',
    submitBody: 'Have a project, system, or wild prototype? Give it a name and let the archive make room.',
    name: 'Project name',
    creator: 'Creator / team',
    track: 'Track',
    add: 'Add to the archive',
    close: 'Close',
    featured: 'Featured signal',
    open: 'Open signal',
    registered: 'Signal registered locally — ready for the real archive.',
  },
  RU: {
    eyebrow: 'цифровое портфолио JDU · Ташкент',
    heroLineOne: 'Мы не храним проекты.',
    heroLineTwo: 'Мы передаём их дальше.',
    heroBody: 'Живой архив студенческих систем, мест и идей — чтобы их открывали, обсуждали и запоминали.',
    explore: 'Открыть архив',
    submit: 'Добавить проект',
    index: 'Архив',
    manifesto: 'Манифест',
    archiveTitle: 'Сигналы, за которыми стоит следить.',
    archiveBody: 'Не полка. Карта сигналов. Каждый проект становится стартом для кого-то ещё.',
    all: 'Все сигналы',
    curation: 'Кураторство / 01',
    curationTitle: 'Хорошая работа оставляет след.',
    curationBody: 'Мы показываем не только интерфейс: проблему, решения и момент, когда прототип стал настоящим.',
    submitTitle: 'Добавь свой сигнал на карту.',
    submitBody: 'Есть проект, система или смелый прототип? Дай ему имя — архив найдёт место.',
    name: 'Название проекта',
    creator: 'Автор / команда',
    track: 'Направление',
    add: 'Добавить в архив',
    close: 'Закрыть',
    featured: 'Избранный сигнал',
    open: 'Открыть сигнал',
    registered: 'Сигнал добавлен локально — готов к настоящему архиву.',
  },
  UZ: {
    eyebrow: 'JDU raqamli portfeli · Toshkent',
    heroLineOne: 'Biz loyihalarni saqlamaymiz.',
    heroLineTwo: 'Ularni uzatamiz.',
    heroBody: 'Talabalar yaratgan tizimlar, joylar va g‘oyalar arxivi — ochish, muhokama qilish va eslab qolish uchun.',
    explore: 'Arxivni ochish',
    submit: 'Loyiha qo‘shish',
    index: 'Arxiv',
    manifesto: 'Manifest',
    archiveTitle: 'Kuzatishga arziydigan signallar.',
    archiveBody: 'Bu oddiy javon emas. Bu signal xaritasi.',
    all: 'Barcha signallar',
    curation: 'Kuratorlik / 01',
    curationTitle: 'Yaxshi ish iz qoldiradi.',
    curationBody: 'Biz interfeys ortidagi fikrni ham ko‘rsatamiz: muammo, qarorlar va prototipning haqiqiy bo‘lgan lahzasi.',
    submitTitle: 'Signalingizni xaritaga qo‘shing.',
    submitBody: 'Loyiha yoki prototipingiz bormi? Unga nom bering.',
    name: 'Loyiha nomi',
    creator: 'Muallif / jamoa',
    track: 'Yo‘nalish',
    add: 'Arxivga qo‘shish',
    close: 'Yopish',
    featured: 'Tanlangan signal',
    open: 'Signalni ochish',
    registered: 'Signal lokal qo‘shildi — haqiqiy arxivga tayyor.',
  },
  JP: {
    eyebrow: 'JDU デジタルポートフォリオ · タシケント',
    heroLineOne: '作品を保存するだけではない。',
    heroLineTwo: '次へ伝えていく。',
    heroBody: '学生がつくったシステム、場所、アイデアの生きたアーカイブ。',
    explore: 'アーカイブを見る',
    submit: '作品を登録する',
    index: 'アーカイブ',
    manifesto: 'マニフェスト',
    archiveTitle: '追いかけたいシグナル。',
    archiveBody: '棚ではなく、次の人へつながる地図。',
    all: 'すべてのシグナル',
    curation: 'キュレーション / 01',
    curationTitle: '良い仕事は跡を残す。',
    curationBody: '画面だけでなく、問題と決断、プロトタイプが現実になった瞬間を記録する。',
    submitTitle: 'あなたのシグナルを地図に。',
    submitBody: '作品やプロトタイプがありますか。名前をつけて登録してください。',
    name: '作品名',
    creator: '作者 / チーム',
    track: '分野',
    add: 'アーカイブに追加',
    close: '閉じる',
    featured: '注目のシグナル',
    open: 'シグナルを開く',
    registered: 'ローカルに登録しました。',
  },
};

const tracks = ['All', 'Culture + code', 'Community tools', 'Learning systems'];

function SignalGlyph({ accent }: { accent: Project['accent'] }) {
  return (
    <span aria-hidden="true" className={`signal-glyph signal-glyph--${accent}`}>
      <span />
      <span />
      <span />
    </span>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('EN');
  const [activeTrack, setActiveTrack] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [notice, setNotice] = useState('');
  const [projects, setProjects] = useState(seedProjects);
  const t = copy[language];

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesTrack = activeTrack === 'All' || project.track === activeTrack;
      const haystack = `${project.title} ${project.creator} ${project.track} ${project.tags.join(' ')}`.toLowerCase();
      return matchesTrack && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeTrack, projects, query]);

  function scrollToArchive() {
    document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') || 'Untitled signal');
    const creator = String(form.get('creator') || 'JDU student');
    const track = String(form.get('track') || 'Culture + code');
    const newProject: Project = {
      id: String(projects.length + 1).padStart(2, '0'),
      title,
      creator,
      track,
      year: '26',
      status: 'New signal',
      blurb: 'A new piece of the JDU story, ready to be explored.',
      tags: ['New', 'JDU', 'Open'],
      accent: 'violet',
      description: 'This signal was just registered in the local prototype archive.',
      features: ['Project story', 'External link', 'Questions + board'],
      metric: '01',
      metricLabel: 'new signal',
    };
    setProjects((current) => [newProject, ...current]);
    setShowRegister(false);
    setNotice(t.registered);
    window.setTimeout(() => setNotice(''), 4200);
    event.currentTarget.reset();
  }

  return (
    <main className="site-shell">
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="JDU Signal Archive home">
          <span className="brand-mark">JDU</span>
          <span className="brand-name">Signal<br />Archive</span>
        </a>
        <nav className="topnav" aria-label="Primary navigation">
          <a href="#archive">{t.index}</a>
          <a href="#manifesto">{t.manifesto}</a>
          <button type="button" onClick={() => setShowRegister(true)}>{t.submit} <span>↗</span></button>
        </nav>
        <div className="language-switcher" aria-label="Language selector">
          {(['EN', 'RU', 'UZ', 'JP'] as Language[]).map((item) => (
            <button className={language === item ? 'is-active' : ''} key={item} type="button" onClick={() => setLanguage(item)} aria-pressed={language === item}>
              {item === 'JP' ? '日本' : item}
            </button>
          ))}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> {t.eyebrow}</p>
          <h1>{t.heroLineOne}<br /><span>{t.heroLineTwo}</span></h1>
          <p className="hero-body">{t.heroBody}</p>
          <div className="hero-actions">
            <button className="button button--solid" type="button" onClick={scrollToArchive}>{t.explore} <span>↘</span></button>
            <button className="text-button" type="button" onClick={() => setShowRegister(true)}>{t.submit} <span>+</span></button>
          </div>
        </div>

        <div className="hero-signal" aria-label="JDU signal visual" role="img">
          <div className="signal-radar signal-radar--outer" />
          <div className="signal-radar signal-radar--inner" />
          <div className="radar-line radar-line--one" />
          <div className="radar-line radar-line--two" />
          <div className="signal-core"><span>JDU</span><small>OPEN / 26</small></div>
          <div className="signal-tag signal-tag--top">TASHKENT / 41.31°N</div>
          <div className="signal-tag signal-tag--right">ARCHIVE ONLINE</div>
          <div className="signal-tag signal-tag--bottom">MADE TO BE FOUND</div>
          <div className="signal-pulse signal-pulse--one" />
          <div className="signal-pulse signal-pulse--two" />
        </div>

        <div className="hero-footer"><span>SCROLL TO DISCOVER</span><span className="hero-scroll-line" /><span>03 / 04 SIGNALS</span></div>
      </section>

      <div className="ticker" aria-hidden="true"><div className="ticker-track">STUDENT MADE <i>✦</i> OPEN BY DEFAULT <i>✦</i> BUILT IN TASHKENT <i>✦</i> STUDENT MADE <i>✦</i> OPEN BY DEFAULT <i>✦</i> BUILT IN TASHKENT <i>✦</i></div></div>

      <section className="archive-section" id="archive">
        <div className="section-intro">
          <div><p className="section-kicker">02 / {t.index.toUpperCase()}</p><h2>{t.archiveTitle}</h2></div>
          <p className="section-description">{t.archiveBody}</p>
        </div>

        <div className="archive-controls">
          <div className="track-filters" aria-label="Project filters">
            {tracks.map((track) => <button className={activeTrack === track ? 'is-active' : ''} key={track} type="button" onClick={() => setActiveTrack(track)}>{track === 'All' ? t.all : track}</button>)}
          </div>
          <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search signals" aria-label="Search signals" /><kbd>/</kbd></label>
        </div>

        <div className="archive-grid">
          {filteredProjects.map((project, index) => (
            <button className={`project-card project-card--${project.accent}`} key={project.id} type="button" onClick={() => setSelected(project)}>
              <div className="card-topline"><span>{project.id} / {project.status}</span><span>↗</span></div>
              <div className="card-art"><SignalGlyph accent={project.accent} /><span className="card-coordinate">{String(index + 1).padStart(2, '0')}° / JDU</span></div>
              <div className="card-content"><p className="card-track">{project.track} <span>·</span> {project.year}</p><h3>{project.title}</h3><p>{project.blurb}</p><div className="card-bottom"><span>{project.creator}</span><span>{t.open} ↘</span></div></div>
            </button>
          ))}
        </div>
        {filteredProjects.length === 0 && <div className="empty-state">No signal found. Try another frequency.</div>}
      </section>

      <section className="manifesto-section" id="manifesto">
        <div className="manifesto-index"><span>03</span><span>MANIFESTO</span></div>
        <div className="manifesto-content"><p className="section-kicker">{t.curation}</p><h2>{t.curationTitle}</h2><p>{t.curationBody}</p><div className="manifesto-rule"><span /> <b>THE ARCHIVE IS A LAUNCHPAD</b></div></div>
        <div className="manifesto-stamp" aria-hidden="true"><span>JDU</span><small>STUDENT<br />SIGNALS<br />26</small></div>
      </section>

      <section className="submit-section"><div><p className="section-kicker">04 / INTAKE</p><h2>{t.submitTitle}</h2></div><div className="submit-panel"><p>{t.submitBody}</p><button className="button button--acid" type="button" onClick={() => setShowRegister(true)}>{t.submit} <span>↗</span></button></div></section>

      <footer className="site-footer"><span>JDU / SIGNAL ARCHIVE</span><span>JAPAN DIGITAL UNIVERSITY · TASHKENT</span><span>© 2026</span></footer>

      {notice && <div className="toast" role="status">{notice}<button type="button" onClick={() => setNotice('')}>×</button></div>}

      {selected && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <article className={`project-modal project-modal--${selected.accent}`} role="dialog" aria-modal="true" aria-labelledby="project-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label={t.close}>×</button>
            <div className="modal-art"><SignalGlyph accent={selected.accent} /><span>{t.featured}</span></div>
            <div className="modal-body"><p className="section-kicker">{selected.id} / {selected.track}</p><h2 id="project-title">{selected.title}</h2><p className="modal-description">{selected.description}</p><div className="modal-meta"><span>BY {selected.creator.toUpperCase()}</span><span>{selected.year} / JDU</span><span>{selected.metric} {selected.metricLabel}</span></div><div className="feature-list">{selected.features.map((feature) => <span key={feature}>↳ {feature}</span>)}</div><div className="tag-list">{selected.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div>
          </article>
        </div>
      )}

      {showRegister && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowRegister(false)}>
          <form className="register-modal" onSubmit={handleRegister} onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowRegister(false)} aria-label={t.close}>×</button><p className="section-kicker">SIGNAL INTAKE / 001</p><h2>{t.submitTitle}</h2><p>{t.submitBody}</p><label>{t.name}<input name="title" required placeholder="JDU / ..." /></label><label>{t.creator}<input name="creator" required placeholder="Your name" /></label><label>{t.track}<select name="track" defaultValue="Culture + code"><option>Culture + code</option><option>Community tools</option><option>Learning systems</option></select></label><button className="button button--solid" type="submit">{t.add} <span>↗</span></button></form>
        </div>
      )}
    </main>
  );
}
