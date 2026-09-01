import { Injectable, signal } from '@angular/core';
import { ResumeData } from '../models/resume.model';

const STORAGE_KEY = 'skill-resume-builder:custom-resume';

export const BASE_RESUME: ResumeData = {
  name: 'THARUN KUMAR DODDI',
  title: 'FULL STACK DEVELOPER — JAVA | SPRING BOOT | ANGULAR',
  location: 'Hyderabad, India',
  phone: '+91 7416186364',
  email: 'tharunkumar850@gmail.com',
  linkedin: 'https://linkedin.com/in/tharun-full-stack-developer',
  portfolio: 'https://tharun-portfolio-rho.vercel.app',
  summary:
    'Full Stack Developer with 4.5+ years of experience building enterprise-grade distributed systems and web applications using Java, Spring Boot, and Angular. Skilled in microservices, Docker/Kubernetes, distributed caching (Redis, Apache Ignite), resilient transaction workflows (Saga, CQRS), event-driven architecture with Apache Kafka, and secure authentication (OAuth 2.0, JWT, SSO). Proven record modernizing legacy REST/SOAP systems, leading zero-downtime Java 11–21 migrations, and driving measurable gains in throughput, latency, and test coverage.',
  experience: [
    {
      title: 'Senior Full Stack Developer',
      company: 'IntouchCX',
      period: 'Jan 2025 – Present',
      location: 'Hyderabad, India',
      client: 'ComPsych',
      bullets: [
        'Implemented Single Sign-On (SSO) within the application alongside Google OAuth 2.0, including On-Behalf-Of delegation and Angular HTTP interceptors for silent JWT token refresh, removing manual re-authentication interruptions for end users.',
        'Integrated Cloudflare Turnstile at login entry points, delivering a significant reduction in automated bot traffic and credential-stuffing attempts against authentication endpoints.',
        'Built Spring AOP aspects to profile latency on REST add/update operations, surfacing slow downstream service calls and database procedures, and enforcing optimistic concurrency via createdOn/modifiedOn validation.',
        'Modernized legacy services by migrating SOAP APIs to REST, upgrading JBoss EAP 7 to 8, and moving the core runtime from Java 11 to Java 21; improved system throughput by 30% using Java virtual thread pools for concurrent processing.',
        'Improved REST-layer performance with Apache Ignite distributed caching, significantly cutting redundant database hits and reducing response times under concurrent load.',
        'Developed dynamic Angular reactive forms using Signals, Route Resolvers, Route Guards, HTTP Interceptors, and the Decorator pattern to power responsive enterprise workflows.',
        'Implemented API and authentication versioning to migrate legacy container-based login flows to a decoupled service-based architecture, validating changes through production-environment testing to avoid downtime.',
        'Established Jenkins CI/CD pipelines with SonarQube quality gates and nglint pre-commit checks, sustaining 85% unit test coverage using Karma and Jasmine.',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Virtusa',
      period: 'Jun 2022 – Jan 2025',
      location: 'Hyderabad, India',
      client: 'Citi Bank',
      bullets: [
        'Built a multi-tenant Spring Boot platform on Docker and Kubernetes routing APAC, EMEA, and NAM traffic across isolated databases with Redis caching and GraphQL-based JWT validation; implemented Resilience4j circuit breakers and fallbacks to sustain service availability during upstream multi-region failures.',
        'Applied Saga, CQRS, and CAP principles to distributed transaction workflows, using Hibernate L1/L2 caching to optimize persistence performance and consistency.',
        'Developed enterprise loan-processing workflows enforcing Maker-Checker dual-control authorization, ensuring 100% of incoming loan applications passed compliance and auditability checks before approval.',
        'Reconciled DEV, SIT, UAT, and Production baselines through artifact analysis, regression testing, and automated branch-merging workflows, cutting reconciliation effort from 2 hours to 10 minutes per cycle.',
        'Built an enterprise loan version-comparison framework with Apache Commons DiffBuilder and an interactive review UI, saving employees 5+ minutes per review by eliminating manual cross-referencing across multiple tabs.',
        'Engineered a custom annotation-driven ORM, validation, and derivation framework using the Java Reflection API for a five-environment legacy monolith without Hibernate, reducing boilerplate code by 60% and increasing mapping speed by 30%.',
        'Built a Kafka-based event streaming pipeline for asynchronous loan-application processing, implementing producer/consumer flows with 7-day message retention and At-Least-Once delivery semantics backed by idempotent consumer checks against the distributed cache to prevent duplicate processing.',
        'Supported a large-scale multi-tenant platform across APAC, EMEA, and NAM regions, managing transaction volume exceeding 40,000 transactions and $2 billion in value, ensuring financial integrity and system stability.',
      ],
    },
  ],
  projects: [],
  skills: [
    'Java 8', 'Java 11', 'Java 17', 'Java 21', 'TypeScript', 'JavaScript', 'SQL', 'HTML5', 'CSS3',
    'Spring Boot', 'Spring MVC', 'Spring AOP', 'Spring Security', 'Hibernate/JPA', 'Angular', 'RxJS',
    'Microservices', 'Saga Pattern', 'CQRS', 'CAP Theorem', 'REST & SOAP APIs', 'GraphQL',
    'Maker-Checker', 'Optimistic Locking', 'SOLID', 'Design Patterns',
    'Docker', 'Kubernetes', 'Jenkins CI/CD', 'SonarQube', 'Git', 'Maven', 'HAProxy', 'JBoss EAP 7/8',
    'PostgreSQL', 'Redis', 'Apache Ignite', 'Apache Kafka', 'Hibernate L1/L2 Caching',
    'SSO Implementation', 'OAuth 2.0', 'JWT', 'Cloudflare Turnstile', 'JUnit', 'Mockito',
    'Testcontainers', 'WireMock', 'Karma', 'Jasmine', 'Resilience4j',
  ],
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech), Computer Science',
      school: 'Jawaharlal Nehru Technological University Kakinada (JNTUK)',
      detail: 'CGPA: 7.5 / 10 • 2018 – 2022',
    },
  ],
  certifications: [
    { name: 'Oracle Certified Professional — Java SE 8 Programmer', detail: '' },
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
          if (
            parsed.email === 'tonitharun@gmail.com' ||
            !parsed.summary?.includes('4.5+')
          ) {
            return structuredClone(BASE_RESUME);
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
