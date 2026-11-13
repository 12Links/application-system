import { Job, Application, CodingQuestion, User } from './types';

// Production engineering job openings at 12 Links Future Technologies (Pretoria Hub)
export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-101',
    title: 'Junior Full-Stack Software Engineer',
    department: 'Engineering',
    location: 'Pretoria, South Africa (Hybrid)',
    type: 'Full-time',
    salary: 'R420,000 - R580,000 / year',
    experience: '1-3 Years',
    description: 'Join 12 Links Future Technologies to build modern web applications, scalable client portals, and cloud microservices using TypeScript, React/Next.js, Tailwind CSS, and PostgreSQL.',
    requirements: [
      'Solid proficiency in TypeScript, React, and modern Next.js App Router',
      'Understanding of REST APIs, database queries, and asynchronous state management',
      'Experience with Git version control, pull request workflows, and automated testing',
      'Based in Pretoria or willing to work hybrid at our Pretoria engineering office'
    ],
    responsibilities: [
      'Develop clean, responsive user interfaces and robust server components',
      'Collaborate on system architecture, database schema design, and API contracts',
      'Participate in sprint planning, code reviews, and quality assurance'
    ],
    benefits: [
      'Flexible hybrid schedule (2-3 days in Pretoria office, remainder remote)',
      'Continuous professional development and learning stipend',
      'High-spec developer workstation and tooling setup'
    ],
    status: 'Active',
    featured: true,
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'job-102',
    title: 'Python & AI Systems Engineer',
    department: 'Engineering',
    location: 'Pretoria, South Africa (On-site / Hybrid)',
    type: 'Full-time',
    salary: 'R550,000 - R780,000 / year',
    experience: '2-4 Years',
    description: 'Architect backend services, data ingestion pipelines, and agentic AI tooling using Python 3.11+, FastAPI, PostgreSQL, and modern vector storage.',
    requirements: [
      'Strong backend programming experience with Python, FastAPI, and Pydantic',
      'Hands-on experience designing relational database schemas in PostgreSQL',
      'Familiarity with containerized deployments (Docker), background workers, and Redis',
      'Interest in agentic LLM orchestration, structured tool use, and vector search'
    ],
    responsibilities: [
      'Design, benchmark, and deploy low-latency REST APIs and asynchronous workers',
      'Integrate authentication, role-based access control, and telemetry subsystems',
      'Optimize database queries and cloud infrastructure for scalability'
    ],
    benefits: [
      'Opportunity to build foundational systems software and AI tooling',
      'Flexible hours and hybrid working arrangement',
      'Conference sponsorships and certification support'
    ],
    status: 'Active',
    featured: true,
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'job-103',
    title: 'Graduate Software Developer (Class of 2024 / 2025)',
    department: 'Engineering',
    location: 'Pretoria, South Africa (On-site)',
    type: 'Internship / Graduate',
    salary: 'R20,000 - R28,000 / month',
    experience: '0-1 Years',
    description: 'Accelerate your software engineering career with mentorship from senior leads. Work directly on production web applications, database systems, and internal tooling.',
    requirements: [
      'BSc / BEng in Computer Science, Software Engineering, Multimedia, or related degree',
      'Sound understanding of data structures, algorithms, and web fundamentals (HTTP, DOM, SQL)',
      'Personal coding projects, open-source contributions, or a GitHub repository showcasing your code',
      'Strong problem-solving capability and enthusiasm for learning modern stacks'
    ],
    responsibilities: [
      'Ship production features alongside senior engineers across the full stack',
      'Implement unit and integration tests for critical user workflows',
      'Engage in design discussions and technical retrospective sessions'
    ],
    benefits: [
      'Dedicated senior engineer mentorship and structured onboarding roadmap',
      'Fast-track promotion pathway to Full-Stack Engineer upon completion',
      'Modern collaborative campus environment in Pretoria'
    ],
    status: 'Active',
    featured: false,
    createdAt: new Date().toISOString().split('T')[0]
  }
];
export const INITIAL_APPLICATIONS: Application[] = [];
export const INITIAL_USERS: User[] = [];

// Clean standard technical evaluation challenges
export const INITIAL_QUESTIONS: CodingQuestion[] = [
  {
    id: 'q-two-sum',
    title: 'Two Sum Identifier',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

Each input has exactly one solution, and you may not use the same element twice.`,
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
      { input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]', description: 'Non-consecutive elements' }
    ]
  }
];
