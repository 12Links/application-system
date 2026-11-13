import { Job, Application, CodingQuestion, User } from './types';

// Clean state: No mock jobs or applicants (All vacancies are created by administrators via the Admin Console)
export const INITIAL_JOBS: Job[] = [];
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
