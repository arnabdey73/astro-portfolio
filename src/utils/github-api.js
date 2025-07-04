// GitHub API service to fetch real data
const GITHUB_API_BASE = 'https://api.github.com';

// GitHub username from the profile data
const GITHUB_USERNAME = 'arnabdey73';

/**
 * Fetches user's basic GitHub profile information
 */
export async function fetchGitHubProfile() {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return null;
  }
}

/**
 * Fetches user's public repositories with pagination
 */
export async function fetchGitHubRepositories(page = 1, perPage = 100) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?page=${page}&per_page=${perPage}&sort=updated&type=public`
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
}

/**
 * Fetches user's contribution activity (simplified version)
 */
export async function fetchGitHubEvents() {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=100`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub events:', error);
    return [];
  }
}

/**
 * Calculates GitHub statistics from repositories and profile data
 */
export function calculateGitHubStats(profile, repositories, events) {
  if (!profile || !repositories) {
    return {
      repositoryCount: 0,
      contributionCount: 0,
      issuesPRsCount: 0,
      stars: 0,
      followers: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }

  // Calculate total stars across all repositories
  const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

  // Count recent contribution events (last 90 days)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const recentContributions = events.filter(event => {
    const eventDate = new Date(event.created_at);
    return eventDate > threeMonthsAgo && [
      'PushEvent',
      'CreateEvent',
      'IssuesEvent',
      'PullRequestEvent',
      'IssueCommentEvent',
      'PullRequestReviewEvent'
    ].includes(event.type);
  }).length;

  // Count issues and PRs from events
  const issuesPRsCount = events.filter(event => 
    ['IssuesEvent', 'PullRequestEvent'].includes(event.type)
  ).length;

  return {
    repositoryCount: profile.public_repos || 0,
    contributionCount: recentContributions,
    issuesPRsCount: issuesPRsCount,
    stars: totalStars,
    followers: profile.followers || 0,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}

/**
 * Categorizes repositories based on their language, topics, and description
 */
export function categorizeRepositories(repositories) {
  const categories = {
    'iac': [],
    'azure': [],
    'devops': [],
    'kubernetes': [],
    'automation': [],
    'monitoring': [],
    'web': [],
    'other': []
  };

  repositories.forEach(repo => {
    const description = (repo.description || '').toLowerCase();
    const topics = repo.topics || [];
    const language = (repo.language || '').toLowerCase();
    
    let categorized = false;

    // Infrastructure as Code
    if (language.includes('hcl') || 
        topics.some(t => ['terraform', 'bicep', 'cloudformation', 'pulumi'].includes(t)) ||
        description.includes('terraform') || description.includes('infrastructure')) {
      categories.iac.push(repo);
      categorized = true;
    }

    // Azure
    if (topics.some(t => t.includes('azure')) || 
        description.includes('azure') || 
        repo.name.toLowerCase().includes('azure')) {
      categories.azure.push(repo);
      categorized = true;
    }

    // DevOps
    if (topics.some(t => ['devops', 'ci-cd', 'jenkins', 'github-actions'].includes(t)) ||
        description.includes('devops') || description.includes('ci/cd')) {
      categories.devops.push(repo);
      categorized = true;
    }

    // Kubernetes
    if (topics.some(t => ['kubernetes', 'k8s', 'helm', 'docker'].includes(t)) ||
        description.includes('kubernetes') || description.includes('docker')) {
      categories.kubernetes.push(repo);
      categorized = true;
    }

    // Automation
    if (language.includes('python') || language.includes('bash') ||
        topics.some(t => ['automation', 'scripting', 'python'].includes(t)) ||
        description.includes('automation') || description.includes('script')) {
      categories.automation.push(repo);
      categorized = true;
    }

    // Monitoring
    if (topics.some(t => ['monitoring', 'grafana', 'prometheus', 'observability'].includes(t)) ||
        description.includes('monitoring') || description.includes('grafana')) {
      categories.monitoring.push(repo);
      categorized = true;
    }

    // Web development
    if (['javascript', 'typescript', 'html', 'css', 'vue', 'react', 'astro'].includes(language) ||
        topics.some(t => ['web', 'frontend', 'backend', 'fullstack'].includes(t))) {
      categories.web.push(repo);
      categorized = true;
    }

    // If not categorized, put in other
    if (!categorized) {
      categories.other.push(repo);
    }
  });

  return categories;
}

/**
 * Formats repository data for display
 */
export function formatRepositoryForDisplay(repo) {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description || 'No description available',
    html_url: repo.html_url,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    topics: repo.topics || [],
    updated_at: repo.updated_at,
    created_at: repo.created_at,
    size: repo.size,
    default_branch: repo.default_branch,
    is_fork: repo.fork,
    archived: repo.archived
  };
}
