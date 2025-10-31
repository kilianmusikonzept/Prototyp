export enum Tag {
  Panikattacke = "panikattacke",
  Exposition = "exposition",
  Atemtraining = "atemtraining",
  Vermeidung = "vermeidung",
  SUDS = "suds",
  Schlaf = "schlaf",
  Koerperfokus = "körperfokus",
}

export enum Context {
  Morgen = "morgen",
  Unterwegs = "unterwegs",
  Abend = "abend",
  Akut = "akut",
}

export enum TimeWindow {
  Three = 3,
  Seven = 7,
  Fifteen = 15,
}

export enum ToolCategory {
  Beruhigen = "Beruhigen",
  Fokussieren = "Fokussieren",
  Staerken = "Stärken",
  Verstehen = "Verstehen",
}

export interface Soundscape {
  id: string;
  name: string;
  icon: string;
  src: string;
}

export interface Tool {
  id: string;
  title: string; // User-centric title, e.g., "Ich brauche jetzt Ruhe"
  subtitle: string; // Clinical title, e.g., "3-Minuten-Atemanker"
  description: string;
  category: ToolCategory;
  duration: TimeWindow;
  tags: Tag[];
  contexts: Context[];
  steps?: string[];
  component: 'Breathing' | 'Instructions' | 'AudioPlayer';
  audioSrc?: string;
  soundscapes?: Soundscape[];
}

export interface SessionLog {
  id: string;
  date: Date;
  toolId: string;
  toolTitle: string;
  preSuds: number;
  postSuds: number;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'balance';
    type: 'text' | 'options';
    content: any;
}

export enum View {
    Dashboard = 'dashboard',
    Tools = 'tools',
    ToolDetail = 'toolDetail',
    Emergency = 'emergency',
    Knowledge = 'knowledge',
    Courses = 'courses',
    Tagebuch = 'tagebuch',
    Therapy = 'therapy',
    Webinars = 'webinars',
    ProfileCompletion = 'profileCompletion'
}

export interface Course {
    id:string;
    title: string;
    description: string;
    author: string;
    price: string;
    imageUrl: string;
}

export interface Therapist {
    id: string;
    name: string;
    specialty: string;
    bio: string;
    price: string;
    imageUrl: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-5
  notes: string;
  hadAnxietySymptoms: boolean;
  hadPanicAttack: boolean | null; // null if hadAnxietySymptoms is false
  panicSymptoms: string[];
  panicSymptomComment: string;
  plannedExercises: string[]; // array of tool IDs or custom exercise titles set during planning
  completedExercises: string[]; // array of tool IDs or custom exercise titles marked as completed
}

export interface CustomExercise {
  id: string;
  title: string;
}

export interface Webinar {
    id: string;
    title: string;
    speaker: string;
    speakerImage: string;
    date: string; // ISO format string
    description: string;
    isLive: boolean; // To distinguish the upcoming one
    recordingUrl?: string; // For past webinars
}

// Defines the full structure of the user data object in localStorage
export interface UserData {
    disorder?: string;
    name?: string;
    age?: string;
    gender?: string;
    country?: string;
    symptomDuration?: string;
    symptoms?: string[];
    customSymptoms?: string[]; // Lernfähige Symptome
    symptomComment?: string;
    avoidedSituations?: string;
    safetyBehaviors?: string;
    anxietyAmplifiers?: string[];
    avgSleep?: string;
    triggersComment?: string;
    medicalCardio?: string;
    medicalThyroid?: string;
    medicalRespiratory?: string;
    medicalNeuro?: string;
    medicalSubstances?: string;
    medicalTherapy?: string;
    medicalReportName?: string;
    hiddenToolIds?: string[];
}

export type KnowledgeChatMode = 'general' | 'quick_help';
