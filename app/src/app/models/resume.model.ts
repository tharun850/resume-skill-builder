export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  location: string;
  client?: string;
  bullets: string[];
}

export interface TechProjectEntry {
  name: string;
  techStack: string;
  link?: string;
  bullet: string;
}

export interface EducationEntry {
  degree: string;
  school: string;
  detail: string;
}

export interface CertificationEntry {
  name: string;
  detail: string;
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  portfolio?: string;
  summary: string;
  experience: ExperienceEntry[];
  projects?: TechProjectEntry[];
  skills: string[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
}



