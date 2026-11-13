import { Job, Application, ApplicationStage, CodingQuestion, User, Notification } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-101',
    title: 'Senior Full-Stack Engineer (React & Python)',
    department: 'Engineering',
    location: 'Pretoria, South Africa (Hybrid)',
    type: 'Full-time',
    salary: 'R 85,000 - R 115,000 / month',
    experience: '4+ Years',
    status: 'Active',
    featured: true,
    createdAt: '2026-07-01',
    description:
      'We are seeking a senior full-stack engineer to drive the core architecture of our next-generation software platforms. You will design resilient React frontends, scalable FastAPI / PostgreSQL services, and modern cloud deployment pipelines.',
    responsibilities: [
      'Architect and build full-stack features using React 19, TypeScript, and FastAPI.',
      'Design robust database schemas and high-performance queries with PostgreSQL.',
      'Lead code reviews, enforce engineering standards, and mentor junior developers.',
      'Collaborate with product designers to ship responsive, accessible, and high-impact web apps.',
      'Contribute to our CI/CD pipelines, automated testing suites, and observability stack.'
    ],
    requirements: [
      '4+ years of professional full-stack development experience.',
      'Proficiency in React, TypeScript, and modern state management.',
      'Solid experience building RESTful or GraphQL APIs with Python (FastAPI/Django) or Node.js.',
      'Strong relational database experience (PostgreSQL, indexing, migrations).',
      'Familiarity with Docker, cloud infrastructure (AWS/GCP), and modern CI/CD.'
    ],
    benefits: [
      'Flexible hybrid working schedule (2 days office in Pretoria, 3 days remote).',
      'Generous hardware allowance (MacBook Pro / high-end Linux workstation).',
      'Comprehensive medical aid subsidy & wellness benefits.',
      'Annual R 25,000 learning & certification stipend.',
      'Performance-based annual bonus and stock option potential.'
    ]
  },
  {
    id: 'job-102',
    title: 'Lead AI & LLM Systems Engineer',
    department: 'AI & Innovations',
    location: 'Remote (South Africa / Global)',
    type: 'Full-time',
    salary: 'R 95,000 - R 130,000 / month',
    experience: '3+ Years',
    status: 'Active',
    featured: true,
    createdAt: '2026-07-03',
    description:
      'Join our AI research and applications team to design, fine-tune, and deploy agentic AI workflows, RAG knowledge engines, and multimodal LLM integrations for enterprise clients across Africa and globally.',
    responsibilities: [
      'Design and deploy intelligent agentic workflows using Google Gemini, Claude, and open-source models.',
      'Develop retrieval-augmented generation (RAG) pipelines with vector stores and semantic search.',
      'Build evaluation frameworks and safety guardrails for production AI agents.',
      'Integrate AI services seamlessly into existing business applications and APIs.'
    ],
    requirements: [
      'Proven hands-on experience building applications powered by LLMs and generative AI.',
      'Expertise in Python, asynchronous frameworks, and modern AI SDKs.',
      'Experience with vector databases (Pinecone, pgvector, Qdrant) and embeddings.',
      'Understanding of prompt engineering, model evaluation, and latency optimization.'
    ],
    benefits: [
      '100% remote working flexibility from anywhere.',
      'Access to state-of-the-art AI compute and API credits.',
      'Attendance at top global AI & tech conferences (sponsored).',
      'Flexible working hours with core collaboration windows.'
    ]
  },
  {
    id: 'job-103',
    title: 'Frontend UI/UX Developer',
    department: 'Product & Design',
    location: 'Pretoria, South Africa',
    type: 'Full-time',
    salary: 'R 55,000 - R 75,000 / month',
    experience: '2+ Years',
    status: 'Active',
    featured: false,
    createdAt: '2026-07-05',
    description:
      'We are looking for a craft-focused Frontend Developer who loves crafting polished, ultra-smooth user interfaces, design systems, and delightful web animations.',
    responsibilities: [
      'Translate Figma design mockups into pixel-perfect, accessible React components.',
      'Maintain and expand our core design system and Tailwind CSS component library.',
      'Optimize web performance, Core Web Vitals, and responsive cross-browser experiences.',
      'Work closely with product managers to test and refine interactive prototypes.'
    ],
    requirements: [
      '2+ years experience building modern web applications with React & TypeScript.',
      'Deep knowledge of Tailwind CSS, CSS Grid/Flexbox, and motion libraries (Motion/Framer).',
      'Eye for aesthetic typography, micro-interactions, spacing, and design hierarchy.',
      'Strong understanding of web accessibility standards (WCAG 2.1 AA).'
    ],
    benefits: [
      'High-spec 4K dual monitor setup and ergonomic workstation.',
      'Flexible working hours & casual office culture in Pretoria East.',
      'Company-sponsored gym membership.',
      'Continuous mentorship and career acceleration pathways.'
    ]
  },
  {
    id: 'job-104',
    title: 'Cloud Infrastructure & DevOps Engineer',
    department: 'Platform Operations',
    location: 'Remote / Pretoria',
    type: 'Full-time',
    salary: 'R 80,000 - R 110,000 / month',
    experience: '4+ Years',
    status: 'Active',
    featured: false,
    createdAt: '2026-07-08',
    description:
      'Help build and maintain our high-availability cloud infrastructure, Kubernetes clusters, automated zero-downtime deployment pipelines, and observability telemetry.',
    responsibilities: [
      'Manage multi-region cloud infrastructure using Infrastructure as Code (Terraform / Pulumi).',
      'Maintain Kubernetes clusters, ingress controllers, and container registries.',
      'Implement zero-trust security postures, automated secret rotation, and compliance scans.',
      'Set up comprehensive logging, metrics, and alerting with Prometheus, Grafana, and OpenTelemetry.'
    ],
    requirements: [
      '4+ years of hands-on DevOps / Site Reliability Engineering experience.',
      'Deep knowledge of Linux, Docker, Kubernetes, and Cloud providers (AWS/GCP/Azure).',
      'Proficiency in Terraform or Ansible and scripting in Bash or Python.',
      'Proven track record implementing automated CI/CD pipelines (GitHub Actions).'
    ],
    benefits: [
      'Remote-first flexibility with home office setup budget.',
      'Cell phone & fiber internet allowance.',
      'Comprehensive health cover for you and dependents.',
      '25 paid vacation days per year.'
    ]
  },
  {
    id: 'job-105',
    title: 'Technical Product Manager',
    department: 'Product',
    location: 'Pretoria (Hybrid)',
    type: 'Full-time',
    salary: 'R 75,000 - R 100,000 / month',
    experience: '3+ Years',
    status: 'Active',
    featured: false,
    createdAt: '2026-07-10',
    description:
      'Bridge the gap between business vision, engineering capabilities, and customer needs to define product roadmaps and guide high-velocity cross-functional teams.',
    responsibilities: [
      'Collaborate with executive stakeholders to translate company vision into product roadmaps.',
      'Write clear technical specs, user stories, and acceptance criteria for engineering teams.',
      'Track product metrics, user engagement analytics, and conversion funnels.',
      'Facilitate agile sprint planning, backlog grooming, and release retrospectives.'
    ],
    requirements: [
      '3+ years experience as a Product Manager in high-growth software companies.',
      'Technical background (degree in Computer Science or past software engineering experience).',
      'Strong analytical capabilities and data-driven decision making.',
      'Superb communication and cross-functional leadership skills.'
    ],
    benefits: [
      'Hybrid working model with flexible core hours.',
      'Generous travel allowance for client & partner site visits.',
      'Professional coaching and executive leadership training.',
      'Comprehensive wellness program.'
    ]
  }
];

export const INITIAL_QUESTIONS: CodingQuestion[] = [
  {
    id: 'q-two-sum',
    title: 'Two Sum Target Finder',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.

### Example 1:
- **Input:** \`nums = [2, 7, 11, 15], target = 9\`
- **Output:** \`[0, 1]\`
- **Explanation:** Because \`nums[0] + nums[1] == 9\`, we return \`[0, 1]\`.

### Example 2:
- **Input:** \`nums = [3, 2, 4], target = 6\`
- **Output:** \`[1, 2]\`

### Example 3:
- **Input:** \`nums = [3, 3], target = 6\`
- **Output:** \`[0, 1]\``,
    starterTemplates: {
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`
    },
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]', description: 'Basic consecutive elements' },
      { input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]', description: 'Non-consecutive elements' },
      { input: 'nums = [3, 3], target = 6', expected: '[0, 1]', description: 'Identical value elements' }
    ]
  },
  {
    id: 'q-object-flattener',
    title: 'Nested Object Deep Flattener',
    difficulty: 'Medium',
    description: `Write a function that takes a deeply nested object/dictionary and returns a **flattened single-depth object** where keys are dot-delimited paths to the nested values.

### Example:
\`\`\`json
{
  "user": {
    "name": "Alex",
    "location": {
      "city": "Pretoria",
      "country": "South Africa"
    }
  },
  "active": true
}
\`\`\`

**Flattened Output:**
\`\`\`json
{
  "user.name": "Alex",
  "user.location.city": "Pretoria",
  "user.location.country": "South Africa",
  "active": true
}
\`\`\``,
    starterTemplates: {
      typescript: `function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  let result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? \`\${prefix}.\${key}\` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], fullKey));
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
}`,
      javascript: `function flattenObject(obj, prefix = '') {
  let result = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? prefix + '.' + key : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], fullKey));
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
}`,
      python: `def flatten_dict(d: dict, prefix: str = '') -> dict:
    result = {}
    for key, val in d.items():
        new_key = f"{prefix}.{key}" if prefix else key
        if isinstance(val, dict):
            result.update(flatten_dict(val, new_key))
        else:
            result[new_key] = val
    return result`
    },
    testCases: [
      { input: '{"a": {"b": 1}}', expected: '{"a.b": 1}', description: 'Single level nesting' },
      { input: '{"user": {"address": {"city": "Pretoria"}}}', expected: '{"user.address.city": "Pretoria"}', description: 'Deep 3-level nesting' },
      { input: '{"status": 200, "meta": {"valid": true}}', expected: '{"status": 200, "meta.valid": true}', description: 'Mixed scalar and nested values' }
    ]
  },
  {
    id: 'q-rate-limiter',
    title: 'Token Bucket Rate Limiter',
    difficulty: 'Hard',
    description: `Implement a simple in-memory **Token Bucket Rate Limiter**.
The rate limiter should maintain a token count up to \`capacity\`. Tokens refill at \`refillRate\` tokens per second.

Each \`allowRequest()\` call consumes 1 token if available (returning \`true\`), or returns \`false\` if the bucket is exhausted.`,
    starterTemplates: {
      typescript: `class TokenBucket {
  private capacity: number;
  private refillRate: number; // tokens per second
  private tokens: number;
  private lastRefill: number;

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allowRequest(): boolean {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillRate);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}`,
      javascript: `class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allowRequest() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillRate);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}`,
      python: `import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_refill = time.time()

    def allow_request(self) -> bool:
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(float(self.capacity), self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

        if self.tokens >= 1.0:
            self.tokens -= 1.0
            return True
        return False`
    },
    testCases: [
      { input: 'capacity=5, request 1', expected: 'true', description: 'Immediate request with fresh bucket' },
      { input: 'capacity=1, request 2 back-to-back', expected: 'false (2nd request)', description: 'Rate limit exhaustion' },
      { input: 'capacity=2, wait 2 sec, refill', expected: 'true', description: 'Token replenishment after timeout' }
    ]
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'APP-801',
    jobId: 'job-101',
    jobTitle: 'Senior Full-Stack Engineer (React & Python)',
    applicantName: 'Thabo Mokoena',
    applicantEmail: 'thabo.mokoena@example.com',
    applicantPhone: '+27 82 456 7890',
    portfolioUrl: 'https://thabomokoena.dev',
    githubUrl: 'https://github.com/thabom-dev',
    linkedinUrl: 'https://linkedin.com/in/thabomokoena',
    experienceYears: '5 Years',
    coverLetter: 'I have been building full-stack web applications for 5 years with React and Python. I love the innovative work 12 Links is doing in automated systems and I would be thrilled to join the team.',
    appliedAt: '2026-07-06T09:30:00Z',
    currentStage: ApplicationStage.Interview,
    stageHistory: [
      {
        stage: ApplicationStage.Applied,
        updatedAt: '2026-07-06T09:30:00Z',
        notes: 'Application submitted via 12 Links Careers portal.'
      },
      {
        stage: ApplicationStage.TechnicalScreening,
        updatedAt: '2026-07-07T14:15:00Z',
        notes: 'Portfolio and GitHub verified. Strong React & Python foundations.'
      },
      {
        stage: ApplicationStage.CodingAssessment,
        updatedAt: '2026-07-08T10:00:00Z',
        notes: 'Coding challenge unlocked.'
      },
      {
        stage: ApplicationStage.Interview,
        updatedAt: '2026-07-09T16:00:00Z',
        notes: 'Passed coding challenge with 92% score. Auto-advanced to live technical interview.'
      }
    ],
    interviewDate: '2026-07-16',
    interviewTimeSlot: '11:00 AM - 12:00 PM',
    interviewNotes: 'Live technical interview confirmed. Architecture & system design focus.',
    codingSubmission: {
      code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      language: 'typescript',
      submittedAt: '2026-07-09T15:45:00Z',
      score: 92,
      testCasesPassed: 3,
      testCasesTotal: 3,
      feedback: 'Clean O(n) hashmap solution. Optimal time and space complexity with well-typed variables.'
    }
  },
  {
    id: 'APP-802',
    jobId: 'job-103',
    jobTitle: 'Frontend UI/UX Developer',
    applicantName: 'Jessica Vance',
    applicantEmail: 'jessica.v@example.com',
    applicantPhone: '+27 71 234 5678',
    portfolioUrl: 'https://jessicavance.design',
    githubUrl: 'https://github.com/jess-vance-ui',
    linkedinUrl: 'https://linkedin.com/in/jessicavance',
    experienceYears: '3 Years',
    coverLetter: 'Passionate about crafting ultra-clean, accessible interfaces with Tailwind CSS and React. Looking to elevate user experiences at 12 Links.',
    appliedAt: '2026-07-08T11:20:00Z',
    currentStage: ApplicationStage.CodingAssessment,
    stageHistory: [
      {
        stage: ApplicationStage.Applied,
        updatedAt: '2026-07-08T11:20:00Z',
        notes: 'Application submitted.'
      },
      {
        stage: ApplicationStage.TechnicalScreening,
        updatedAt: '2026-07-09T09:00:00Z',
        notes: 'Portfolio review: outstanding UI design skills and Figma component libraries.'
      },
      {
        stage: ApplicationStage.CodingAssessment,
        updatedAt: '2026-07-10T08:30:00Z',
        notes: 'Advanced to Coding Assessment. Awaiting candidate submission.'
      }
    ]
  },
  {
    id: 'APP-803',
    jobId: 'job-102',
    jobTitle: 'Lead AI & LLM Systems Engineer',
    applicantName: 'Sipho Ndlovu',
    applicantEmail: 'sipho.n@example.com',
    applicantPhone: '+27 83 987 6543',
    portfolioUrl: 'https://siphondlovu.ai',
    githubUrl: 'https://github.com/siphondlovu-ai',
    linkedinUrl: 'https://linkedin.com/in/siphondlovu',
    experienceYears: '4 Years',
    coverLetter: 'Specialist in LangChain, LangGraph, multimodal models, and vector database retrieval. Excited to scale autonomous systems at 12 Links.',
    appliedAt: '2026-07-10T14:40:00Z',
    currentStage: ApplicationStage.TechnicalScreening,
    stageHistory: [
      {
        stage: ApplicationStage.Applied,
        updatedAt: '2026-07-10T14:40:00Z',
        notes: 'Application submitted.'
      },
      {
        stage: ApplicationStage.TechnicalScreening,
        updatedAt: '2026-07-11T10:00:00Z',
        notes: 'Under review by AI Engineering Team Lead.'
      }
    ]
  },
  {
    id: 'APP-804',
    jobId: 'job-104',
    jobTitle: 'Cloud Infrastructure & DevOps Engineer',
    applicantName: "Liam O'Connor",
    applicantEmail: 'liam.oc@example.com',
    applicantPhone: '+27 72 345 6789',
    githubUrl: 'https://github.com/liam-infra',
    linkedinUrl: 'https://linkedin.com/in/liamoconnor-cloud',
    experienceYears: '5 Years',
    coverLetter: 'Certified Kubernetes Administrator (CKA) with 5 years managing AWS & GCP production clusters. Eager to optimize cloud efficiency.',
    appliedAt: '2026-07-12T08:15:00Z',
    currentStage: ApplicationStage.Applied,
    stageHistory: [
      {
        stage: ApplicationStage.Applied,
        updatedAt: '2026-07-12T08:15:00Z',
        notes: 'New application received via career board.'
      }
    ]
  },
  {
    id: 'APP-805',
    jobId: 'job-105',
    jobTitle: 'Technical Product Manager',
    applicantName: 'Lerato Khumalo',
    applicantEmail: 'lerato.k@example.com',
    applicantPhone: '+27 84 567 8901',
    portfolioUrl: 'https://leratokhumalo.co.za',
    linkedinUrl: 'https://linkedin.com/in/leratokhumalo',
    experienceYears: '6 Years',
    coverLetter: 'Track record delivering high-throughput enterprise SaaS products. Looking forward to driving product strategy at 12 Links.',
    appliedAt: '2026-07-02T10:00:00Z',
    currentStage: ApplicationStage.Offered,
    stageHistory: [
      {
        stage: ApplicationStage.Applied,
        updatedAt: '2026-07-02T10:00:00Z',
        notes: 'Application received.'
      },
      {
        stage: ApplicationStage.TechnicalScreening,
        updatedAt: '2026-07-03T11:00:00Z',
        notes: 'Screening passed.'
      },
      {
        stage: ApplicationStage.Interview,
        updatedAt: '2026-07-05T15:00:00Z',
        notes: 'Technical & cultural interviews completed with exceptional marks.'
      },
      {
        stage: ApplicationStage.Offered,
        updatedAt: '2026-07-09T17:00:00Z',
        notes: 'Official job offer extended. Contract generated and awaiting signature.'
      }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-demo-1',
    name: 'Thabo Mokoena',
    email: 'thabo.mokoena@example.com',
    phone: '+27 82 456 7890',
    portfolioUrl: 'https://thabomokoena.dev',
    githubUrl: 'https://github.com/thabom-dev',
    linkedinUrl: 'https://linkedin.com/in/thabomokoena',
    password: 'password'
  },
  {
    id: 'user-demo-2',
    name: 'Jessica Vance',
    email: 'jessica.v@example.com',
    phone: '+27 71 234 5678',
    portfolioUrl: 'https://jessicavance.design',
    githubUrl: 'https://github.com/jess-vance-ui',
    linkedinUrl: 'https://linkedin.com/in/jessicavance',
    password: 'password'
  }
];
