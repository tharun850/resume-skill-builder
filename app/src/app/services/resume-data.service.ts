import { Injectable, signal } from '@angular/core';
import { ResumeData } from '../models/resume.model';

const STORAGE_KEY = 'skill-resume-builder:custom-resume';

export const BASE_RESUME: ResumeData = {
  name: 'THARUN KUMAR DODDI',
  title: 'Full Stack Developer • Java | Spring Boot | Angular',
  location: 'Hyderabad, India',
  phone: '+91 7416186364',
  email: 'tharunkumar850@gmail.com',
  linkedin: 'https://linkedin.com/in/tharun-full-stack-developer',
  portfolio: 'https://tharun-portfolio-rho.vercel.app/',
  summary:
    'Full Stack Developer with 4.4 years of experience building enterprise-grade distributed systems and web applications using Java, Spring Boot, and Angular. Experienced in microservices, Kubernetes/Docker, distributed caching with Redis and Apache Ignite, resilient transaction workflows using Saga and CQRS, and secure authentication with SAML 2.0, OAuth 2.0, and JWT. Strong background in REST/SOAP modernization, Java 11–21 migrations, Angular Signals, CI/CD, automated testing, and AI integrations using Model Context Protocol (MCP) and LLM APIs.',
  experience: [
    {
      title: 'Senior Full Stack Developer',
      company: 'InTouchCX',
      period: 'Jan 2025 – Present',
      location: 'Hyderabad, India',
      client: 'ComPsych',
      bullets: [
        'Implemented enterprise SAML 2.0 SSO with Okta, Google OAuth 2.0, and On-Behalf-Of delegation, with Angular HTTP interceptors supporting silent JWT token refresh.',
        'Strengthened authentication workflows by integrating Cloudflare Turnstile to protect login entry points against automated bots and credential-stuffing attacks.',
        'Built Spring AOP aspects for REST add/update operations to profile latency and enforce optimistic concurrency through createdOn/modifiedOn timestamp validation.',
        'Exposed backend REST capabilities to LLMs through Model Context Protocol (MCP), integrating an enterprise AI chatbot within strict firewall execution boundaries.',
        'Modernized legacy services by migrating SOAP APIs to REST, upgrading JBoss EAP 7 to 8, and moving the core runtime from Java 11 to Java 21.',
        'Improved REST-layer data access with Apache Ignite distributed caching, reducing repeated database access and supporting higher concurrent throughput.',
        'Developed dynamic Angular reactive forms using Signals, Route Resolvers, Route Guards, HTTP Interceptors, and Decorator patterns for responsive enterprise workflows.',
        'Established Jenkins CI/CD and SonarQube quality gates with nglint pre-commit checks, maintaining 85% unit test coverage using Karma and Jasmine.',
        'Implemented API and authentication versioning to transition legacy container-based login flows to a decoupled service-based authentication architecture.',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Virtusa',
      period: 'Jun 2022 – Jan 2025',
      location: 'Hyderabad, India',
      client: 'Citibank',
      bullets: [
        'Built a multi-tenant Spring Boot platform on Docker and Kubernetes, routing APAC, EMEA, and NAM traffic with isolated databases, Redis caching, and JWT validation.',
        'Implemented Resilience4j circuit breakers and fallbacks to improve service availability and provide graceful degradation during upstream multi-region failures.',
        'Applied Saga, CQRS, and CAP principles to distributed workflows and transaction propagation, with Hibernate L1/L2 caching for persistence optimization.',
        'Developed enterprise loan-processing workflows using Maker-Checker authorization to enforce dual-control compliance and auditability.',
        'Reconciled DEV, SIT, UAT, and Production baselines through production artifact analysis, regression testing, and automated branch-merging workflows.',
        'Built an enterprise loan version-comparison framework with Apache Commons DiffBuilder and an interactive UI for reviewing historical application differences.',
        'Engineered a custom annotation-driven ORM, validation, and derivation framework using Java Reflection API for legacy systems without Hibernate; configured Kafka for asynchronous batch processing.',
        'Optimized SQL queries, views, stored procedures, and functions; configured HAProxy load balancing and built integration tests with Mockito, MockMvc, Testcontainers, and WireMock.',
      ],
    },
  ],
  projects: [],
  skills: [
    'Java', 'Spring Boot', 'Spring MVC', 'Spring AOP', 'Spring Security', 'Microservices', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Java 8', 'Java 11', 'Java 17', 'Java 21', 'Docker', 'Kubernetes (K8s)', 'Redis', 'Apache Kafka', 'Apache Ignite', 'Hibernate / JPA (L1 & L2 Caching)', 'Transaction Propagation', 'RESTful APIs', 'SOAP Web Services', 'PostgreSQL', 'SQL (Views, Stored Procedures, Functions)', 'Resilience4j', 'SAML 2.0 (Okta SSO)', 'Google OAuth 2.0', 'Cloudflare Turnstile', 'JWT', 'Model Context Protocol (MCP)', 'LLM API Integration', 'Enterprise AI Chatbots', 'Reactive Forms', 'Angular Signals', 'RxJS', 'Route Resolvers', 'Route Guards', 'HTTP Interceptors', 'Saga Pattern', 'CQRS', 'CAP Theorem', 'SOLID Principles', 'Design Patterns (Decorator, Factory)', 'Maker-Checker Architecture', 'Optimistic Locking', 'Multithreading', 'SonarQube', 'nglint', 'HAProxy', 'JBoss EAP 7/8', 'Testcontainers', 'WireMock', 'Mockito (MockMvc)', 'JUnit', 'Karma', 'Jasmine', 'Jenkins CI/CD', 'Git', 'Maven', 'Java Reflection API', 'Apache DiffBuilder', 'API Versioning'
  ],
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech)',
      school: 'Jawaharlal Nehru Technological University Kakinada (JNTUK)',
      detail: '2018 – 2022 • CGPA: 7.5 / 10',
    },
  ],
  certifications: [
    { name: 'Oracle Certified Professional: Java SE 8 Programmer', detail: 'Nov 2022 • No Expiry' },
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
          if (parsed.email === 'tonitharun@gmail.com' || !parsed.experience?.[0]?.bullets?.some((b: string) => b.includes('SAML 2.0'))) {
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
