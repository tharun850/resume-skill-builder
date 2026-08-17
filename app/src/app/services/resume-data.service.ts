import { Injectable, signal } from '@angular/core';
import { ResumeData } from '../models/resume.model';

const STORAGE_KEY = 'skill-resume-builder:custom-resume';

export const BASE_RESUME: ResumeData = {
  name: 'THARUN KUMAR DODDI',
  title: 'Senior Java Full-Stack Engineer | Spring Boot, Angular, Microservices, Kafka',
  location: 'Hyderabad, India',
  phone: '+91 7416186364',
  email: 'tharunkumar850@gmail.com',
  linkedin: 'https://linkedin.com/in/tharun-full-stack-developer/',
  portfolio: 'https://tharun-portfolio-rho.vercel.app/',
  summary:
    'Full-Stack Software Engineer with 4+ years of hands-on experience engineering distributed enterprise systems across healthcare (ComPsych) and financial services (Citi Bank). Specialized in Java 21, Spring Boot microservices, Angular Signals, Apache Kafka event streaming, and Apache Ignite caching with a proven track record of reducing critical path latency by 70%.',
  experience: [
    {
      title: 'Senior Java Full Stack Developer',
      company: 'IntouchCX',
      period: 'Jan 2025 - Present',
      location: 'Hyderabad, India',
      client: 'ComPsych',
      bullets: [
        'Engineered responsive full-stack modules using Angular Signals and Spring Boot, establishing modular RESTful contracts and securing OAuth2/JWT workflows.',
        'Secured web applications with OAuth2 and custom Angular HTTP interceptors for transparent JWT rotation; designed JPA data layers on MS SQL Server with optimized indexing.',
        'Built complex workflows with Angular Reactive Forms and Signals, using Route Resolvers to preload domain models and minimize UI flicker.',
        'Led the migration from legacy SOAP WebServices to high-performance REST APIs, eliminating XML overhead and standardizing payload schemas.',
        'Re-architected distributed caching with Apache Ignite for high-read reference data and session persistence, improving pipeline throughput.',
        'Upgraded enterprise runtime infrastructure from JBoss 7 / Java 11 to JBoss 8 / Java 21 with zero system downtime during cutover.',
        'Automated CI/CD build pipelines using Docker and Jenkins with comprehensive Karma, Jasmine, and Selenium automated test suites.',
        'Conducted peer code reviews, established API contract standards, and collaborated with cross-functional product teams in agile sprints.',
      ],
    },
    {
      title: 'Full Stack Developer',
      company: 'Virtusa Consulting Services',
      period: 'Jun 2022 - Jan 2025',
      location: 'Hyderabad, India',
      client: 'Citi Bank',
      bullets: [
        'Built real-time Kafka event streaming pipelines to decouple loan-origination ingestion from risk calculation engines, slashing processing latency by 70%.',
        'Implemented high-throughput data aggregation pipelines using Java Stream API and Apache Commons Diff-Builder to reconcile multi-source banking feeds.',
        'Created custom reflection-based entity mapping utilities to dynamically bind non-standard legacy database formats to Spring domain models.',
        'Standardized a reusable validation framework using custom Java annotations, adopted across 4 engineering teams to enforce uniform business rules.',
        'Designed resilient Spring Boot microservices with Spring Cloud Gateway and Eureka service discovery, reliably handling peak loan volumes.',
        'Authored AWS Lambda triggers to auto-scale compute instances during intraday traffic spikes, optimizing cloud resource costs.',
      ],
    },
  ],
  projects: [
    {
      name: 'Resume Skill Matcher & ATS Optimizer',
      techStack: 'Angular 19, TypeScript, OpenAI Vision API, GenAI Integration, jsPDF',
      link: 'https://github.com/tharun850/resume-skill-builder',
      bullet: 'Engineered a GenAI application integrating OpenAI Vision API and Signals to extract missing job portal skills from screenshots and generate single-page vector PDFs.',
    },
    {
      name: 'Full-Stack Portfolio Application',
      techStack: 'Angular, Node.js, Cloudflare Turnstile, Resend API, Vercel Serverless',
      link: 'https://github.com/tharun850/tharun-portfolio',
      bullet: 'Architected a responsive portfolio integrating Cloudflare Turnstile anti-bot verification, Resend transactional email API, and Vercel Edge Serverless functions.',
    },
    {
      name: 'Llama Edge AI Control Center',
      techStack: 'Python, Llama LLM, FastAPI, Docker, IoT Edge, PyTorch',
      link: 'https://github.com/tharun850/llama-pi-control-center',
      bullet: 'Built an Edge AI control center running quantized local Llama LLMs with FastAPI for private offline inference, device automation, and real-time telemetry.',
    },
  ],
  skills: [
    'Java 21', 'JavaScript', 'TypeScript', 'Python',
    'Angular', 'Reactive Forms', 'Angular Signals', 'Route Resolvers', 'HTTP Interceptors',
    'Spring Boot', 'Spring Cloud', 'Spring Security', 'Spring Data JPA', 'RESTful APIs', 'JWT', 'OAuth2',
    'Microservices', 'Event-Driven Architecture', 'Distributed Caching', 'SOAP-to-REST Migration',
    'Apache Kafka', 'Apache Ignite', 'MS SQL Server', 'MySQL', 'Oracle PL/SQL',
    'JUnit', 'Mockito', 'Karma', 'Jasmine', 'Selenium',
    'Docker', 'Jenkins', 'CI/CD', 'Git', 'AWS',
  ],
  education: [
    {
      degree: 'B.Tech, Engineering',
      school: 'JNTUK, University College of Engineering, Narasaraopet',
      detail: 'GPA: 7.25 / 10.0 | Jun 2018 - Jun 2022',
    },
  ],
  certifications: [
    { name: 'Oracle Certified Associate, Java SE 8 Programmer', detail: 'Nov 2022' },
  ],
};

@Injectable({ providedIn: 'root' })
export class ResumeDataService {
  readonly resume = signal<ResumeData>(this.loadFromStorage());

  private loadFromStorage(): ResumeData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name && Array.isArray(parsed.skills)) {
          if (!parsed.projects || parsed.projects.length === 0) {
            parsed.projects = structuredClone(BASE_RESUME.projects);
          }
          return parsed;
        }
      }
    } catch {
    }
    return structuredClone(BASE_RESUME);
  }

  private persist(data: ResumeData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
    }
  }

  saveResume(updatedData: ResumeData): void {
    const clone = structuredClone(updatedData);
    this.resume.set(clone);
    this.persist(clone);
  }

  resetToBase(): void {
    const baseline = structuredClone(BASE_RESUME);
    this.resume.set(baseline);
    this.persist(baseline);
  }

  allSkillsLower(): Set<string> {
    return new Set(this.resume().skills.map((s) => s.toLowerCase().trim()));
  }

  addSkills(newSkills: string[]): void {
    this.resume.update((r) => {
      const clone = structuredClone(r);
      const existingLower = new Set(clone.skills.map((s: string) => s.toLowerCase().trim()));
      for (const raw of newSkills) {
        const skill = raw.trim();
        if (skill && !existingLower.has(skill.toLowerCase())) {
          clone.skills.push(skill);
          existingLower.add(skill.toLowerCase());
        }
      }
      this.persist(clone);
      return clone;
    });
  }

  addSkill(skillName: string): boolean {
    const trimmed = skillName.trim();
    if (!trimmed) return false;
    const existing = this.allSkillsLower();
    if (existing.has(trimmed.toLowerCase())) return false;

    this.addSkills([trimmed]);
    return true;
  }

  removeSkill(skillToRemove: string): void {
    this.resume.update((r) => {
      const clone = structuredClone(r);
      clone.skills = clone.skills.filter((s: string) => s.toLowerCase() !== skillToRemove.toLowerCase());
      this.persist(clone);
      return clone;
    });
  }

  exportJson(): string {
    return JSON.stringify(this.resume(), null, 2);
  }

  importJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.name === 'string' && Array.isArray(parsed.skills)) {
        this.saveResume(parsed);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }
}
