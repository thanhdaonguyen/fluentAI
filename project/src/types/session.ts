export interface SessionData {
  stutteredWords: string[];
  totalWords: number;
  stutterCount: number;
  sessionDuration: number;
  finalScore: number;
  timestamp?: string;
}

export interface Exercise {
  id: number;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  description: string;
  progress: number;
  locked: boolean;
  favorite: boolean;
}

export interface PracticeActivity {
  time: string;
  activity: string;
  duration: string;
  completed: boolean;
  type: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  createdAt: string;
  totalSessions: number;
  averageScore: number;
}