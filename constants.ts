import { Tool, Tag, Context, TimeWindow, Course, Therapist, ToolCategory, Webinar } from './types';

export const CRISIS_KEYWORDS: string[] = ["suizid", "umbringen", "nicht mehr leben", "kann nicht mehr", "schlimm", "selbstmord", "sterben"];

export const MOTIVATIONAL_QUOTES: string[] = [
    "Jeder ruhige Atemzug ist ein Sieg. 🧘",
    "Du bist stärker, als du denkst. Gib dir Zeit. 💪",
    "Fortschritt, nicht Perfektion, ist das Ziel. 🌱",
    "Gefühle sind wie Wolken – sie ziehen vorüber. ☁️",
    "Sei heute besonders nachsichtig mit dir selbst. ❤️",
    "Ein kleiner Schritt heute ist ein großer Erfolg für morgen. ✨",
    "Du hast alles, was du brauchst, um diesen Moment zu meistern. 🕊️",
    "Akzeptiere, was du nicht ändern kannst. Ändere, was du kannst. 🙏",
    "Auch der längste Weg beginnt mit einem einzigen Schritt. 👣"
];

export const SYMPTOM_OPTIONS = [
    'Herzklopfen / Herzrasen', 'Atemnot / Engegefühl', 'Schwindel / Benommenheit', 'Zittern / Schwitzen',
    'Übelkeit / Magenprobleme', 'Kribbeln / Taubheitsgefühl', 'Hitze- oder Kältegefühle', 'Angst vor Kontrollverlust'
];

export const MOOD_OPTIONS = [
    { value: 1, label: 'Sehr schlecht', icon: '😞' },
    { value: 2, label: 'Schlecht', icon: '😕' },
    { value: 3, label: 'Okay', icon: '😐' },
    { value: 4, label: 'Gut', icon: '🙂' },
    { value: 5, label: 'Sehr gut', icon: '😄' },
];

export const TOOLS: Tool[] = [
  {
    id: "atem_3",
    category: ToolCategory.Beruhigen,
    title: "Du möchtest dich in kurzer Zeit beruhigen und im Moment ankommen.",
    subtitle: "3-Minuten-Atemanker",
    description: "Eine schnelle Atemübung, um dich im Hier und Jetzt zu verankern und dein Nervensystem zu beruhigen.",
    duration: TimeWindow.Three,
    tags: [Tag.Atemtraining, Tag.Panikattacke, Tag.SUDS],
    contexts: [Context.Akut, Context.Unterwegs, Context.Morgen, Context.Abend],
    steps: [
      "Finde eine bequeme Position, sitzend oder stehend.",
      "Atme 4 Sekunden lang tief durch die Nase ein.",
      "Halte den Atem für 4 Sekunden an.",
      "Atme 6 Sekunden lang langsam durch den Mund aus.",
      "Wiederhole dies, bis der Timer abgelaufen ist."
    ],
    component: "Breathing",
  },
  {
    id: "body_scan_7",
    category: ToolCategory.Beruhigen,
    title: "Du möchtest deinen Körper spüren und zur Ruhe finden.",
    subtitle: "7-Minuten-Körperscan",
    description: "Lasse dich von einer beruhigenden Stimme durch deinen Körper führen und finde tiefe Entspannung.",
    duration: TimeWindow.Seven,
    tags: [Tag.Koerperfokus, Tag.Schlaf],
    contexts: [Context.Abend, Context.Morgen],
    component: "AudioPlayer",
    audioSrc: "https://cdn.pixabay.com/download/audio/2024/05/21/audio_1c27a20c93.mp3?filename=body-scan-meditation-for-deep-relaxation-guided-meditation-389367.mp3",
    soundscapes: [
      { id: 'rain', name: 'Regen', icon: '💧', src: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_365a6d21b7.mp3?filename=rain-and-thunder-115252.mp3' },
      { id: 'forest', name: 'Wald', icon: '🌲', src: 'https://cdn.pixabay.com/download/audio/2022/04/28/audio_01b84c6328.mp3?filename=birds-singing-in-the-morning-calm-forest-ambience-40-min-109012.mp3' },
      { id: 'ocean', name: 'Meer', icon: '🌊', src: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_98553f1a9a.mp3?filename=gentle-ocean-waves-1-14332.mp3' },
    ],
  },
  {
    id: "54321_7",
    category: ToolCategory.Fokussieren,
    title: "Du möchtest dich von deinen Gedanken lösen und deine Sinne schärfen.",
    subtitle: "5-4-3-2-1-Technik",
    description: "Eine intensive Erdungsübung, die deine Sinne aktiviert und dich stark in die Gegenwart zurückholt.",
    duration: TimeWindow.Seven,
    tags: [Tag.Panikattacke, Tag.Koerperfokus],
    contexts: [Context.Akut, Context.Unterwegs],
    steps: [
      "Schau dich um und benenne laut 5 Dinge, die du sehen kannst.",
      "Nimm nun 4 Dinge wahr, die du fühlen kannst.",
      "Lausche aufmerksam und identifiziere 3 Geräusche in deiner Umgebung.",
      "Finde 2 Dinge, die du riechen kannst.",
      "Nimm 1 Sache wahr, die du schmecken kannst.",
    ],
    component: "Instructions",
  },
  {
    id: "gedanken_stopp_3",
    category: ToolCategory.Fokussieren,
    title: "Du möchtest aus dem Grübelkreislauf aussteigen.",
    subtitle: "3-Minuten-Gedankenstopp",
    description: "Eine kurze Technik, um Grübelschleifen zu unterbrechen und den Fokus neu auszurichten.",
    duration: TimeWindow.Three,
    tags: [Tag.Vermeidung],
    contexts: [Context.Akut, Context.Unterwegs],
    steps: [
      "Sage innerlich oder leise laut: 'STOPP!'.",
      "Visualisiere ein rotes Stoppschild.",
      "Richte deine Aufmerksamkeit sofort auf etwas Konkretes in deiner Umgebung.",
    ],
    component: "Instructions",
  },
  {
    id: "progressive_muskelentspannung_15",
    category: ToolCategory.Beruhigen,
    title: "Du möchtest körperlich und mental loslassen.",
    subtitle: "15-Minuten-Progressive Muskelentspannung",
    description: "Lerne durch An- und Entspannung, Muskelverspannungen zu lösen und tiefe körperliche Ruhe zu finden.",
    duration: TimeWindow.Fifteen,
    tags: [Tag.Koerperfokus, Tag.Schlaf],
    contexts: [Context.Abend],
    steps: [
      "Lege dich bequem hin.",
      "Beginne mit deiner rechten Hand. Balle sie zur Faust, halte die Spannung, und löse sie wieder.",
      "Fahre so fort mit anderen Muskelgruppen: Arme, Gesicht, Schultern, Bauch, Beine und Füße.",
    ],
    component: "Instructions",
  },
  {
    id: "weicher_bauch",
    category: ToolCategory.Beruhigen,
    title: "Du möchtest dich innerlich weicher und entspannter fühlen.",
    subtitle: "Weicher-Bauch-Übung",
    description: "Eine sanfte Atemübung, die hilft, Anspannung im Bauchraum zu lösen und das Zwerchfell zu entspannen.",
    duration: TimeWindow.Three,
    tags: [Tag.Atemtraining, Tag.Koerperfokus],
    contexts: [Context.Abend, Context.Morgen, Context.Akut],
    component: "Breathing",
    steps: [
        "Lege eine Hand auf deinen Bauch.",
        "Atme tief in den Bauch ein, sodass sich deine Hand hebt.",
        "Atme langsam aus und lasse den Bauch ganz weich werden.",
    ]
  },
  {
    id: "5_finger",
    category: ToolCategory.Fokussieren,
    title: "Du möchtest dich wieder sicher und geerdet fühlen.",
    subtitle: "5-Finger-Übung",
    description: "Eine einfache und diskrete Übung, die deine Sinne nutzt, um dich schnell zu erden und zu beruhigen.",
    duration: TimeWindow.Three,
    tags: [Tag.Panikattacke, Tag.Koerperfokus],
    contexts: [Context.Akut, Context.Unterwegs],
    component: "Instructions",
    steps: [
        "Strecke eine Hand aus.",
        "Fahre mit dem Zeigefinger der anderen Hand langsam deinen Daumen entlang, während du einatmest.",
        "Fahre beim Ausatmen wieder hinunter.",
        "Wiederhole dies für jeden Finger.",
    ]
  },
  {
    id: "handschalen",
    category: ToolCategory.Beruhigen,
    title: "Du brauchst sofort Hilfe bei starker Anspannung oder Panik.",
    subtitle: "Handschalenübung (Notfall-Atemhilfe)",
    description: "Eine Notfalltechnik, die den Vagusnerv stimuliert und bei akuter Anspannung oder Panik schnell beruhigt.",
    duration: TimeWindow.Three,
    tags: [Tag.Atemtraining, Tag.Panikattacke],
    contexts: [Context.Akut],
    component: "Instructions",
    steps: [
        "Forme deine Hände zu einer Schale.",
        "Lege die Schale über Mund und Nase, sodass sie abschließt.",
        "Atme ruhig in deine Hände hinein und wieder aus.",
        "Dies verlangsamt deine Atmung und hilft deinem Nervensystem, sich zu regulieren.",
    ]
  },
];


export const COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Grundlagen der Angstbewältigung',
        author: 'Dr. Anna Freud',
        description: 'Verstehe die Mechanismen von Angst und lerne erste, effektive Strategien für den Alltag.',
        price: '49,99 €',
        imageUrl: 'https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    },
    {
        id: 'c2',
        title: 'Panikattacken verstehen & stoppen',
        author: 'Prof. Dr. Carl Rogers',
        description: 'Ein Intensivkurs, der dir zeigt, wie du die Kontrolle während einer Panikattacke zurückgewinnst.',
        price: '79,99 €',
        imageUrl: 'https://images.unsplash.com/photo-1599422552425-91f4813f1e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    },
    {
        id: 'c3',
        title: 'Besser Schlafen trotz Sorgen',
        author: 'Dr. Eva Skinner',
        description: 'Finde zurück zu erholsamem Schlaf mit Techniken aus der kognitiven Verhaltenstherapie.',
        price: '59,99 €',
        imageUrl: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    }
];

export const THERAPISTS: Therapist[] = [
    {
        id: 't1',
        name: 'Dr. Michael Wolf',
        specialty: 'Spezialist für Panikstörungen',
        bio: 'Mit über 15 Jahren Erfahrung helfe ich Klienten, den Kreislauf der Panik zu durchbrechen. Mein Ansatz ist lösungsorientiert und basiert auf der Verhaltenstherapie.',
        price: '120 € / 50 Min.',
        imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 't2',
        name: 'Sabine Huber',
        specialty: 'Expertin für soziale Ängste',
        bio: 'Ich unterstütze Sie dabei, wieder selbstsicher und angstfrei auf andere Menschen zuzugehen. Gemeinsam erarbeiten wir alltagstaugliche Strategien.',
        price: '105 € / 50 Min.',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
    }
];

export const WEBINARS: Webinar[] = [
    {
        id: 'w-live-1',
        title: 'Den Panik-Kreislauf durchbrechen',
        speaker: 'Dr. Katharina Schmidt',
        speakerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15, 19, 0).toISOString(), // Next month, 15th, 7 PM
        description: 'Verstehen Sie, wie Panikattacken entstehen und lernen Sie praxiserprobte Sofort-Strategien, um die Kontrolle zurückzugewinnen und den Teufelskreis der Angst zu durchbrechen.',
        isLive: true,
    },
    {
        id: 'w-past-2',
        title: 'Der Einfluss von Schlaf auf die Angst',
        speaker: 'Prof. Dr. David Bauer',
        speakerImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 20, 19, 0).toISOString(),
        description: 'Erfahren Sie, wie Schlafhygiene und Entspannungstechniken Ihnen helfen können, Sorgen loszulassen und erholsamen Schlaf zu finden.',
        isLive: false,
        recordingUrl: '#',
    },
    {
        id: 'w-past-1',
        title: 'Ernährung und psychische Gesundheit',
        speaker: 'Dr. Lena Vogel',
        speakerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        date: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 18, 19, 0).toISOString(),
        description: 'Entdecken Sie den Zusammenhang zwischen dem, was Sie essen, und wie Sie sich fühlen. Einfache Tipps für eine angstlösende Ernährung.',
        isLive: false,
        recordingUrl: '#',
    }
];