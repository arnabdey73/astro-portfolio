// GitHub API service to fetch real data
const GITHUB_API_BASE = 'https://api.github.com';

// GitHub username from the profile data
const GITHUB_USERNAME = 'arnabdey73';

// Fallback data for when GitHub API is unavailable
const FALLBACK_PROFILE = {
  login: 'arnabdey73',
  name: 'Arnab Dey',
  bio: 'DevOps Engineer & Cloud Architect',
  public_repos: 25,
  followers: 15,
  following: 10,
  created_at: '2020-01-01T00:00:00Z',
  updated_at: new Date().toISOString(),
  html_url: 'https://github.com/arnabdey73',
  avatar_url: 'https://github.com/arnabdey73.png'
};

const FALLBACK_REPOS = [
  {
    id: 1,
    name: 'astro-portfolio',
    full_name: 'arnabdey73/astro-portfolio',
    description: 'Personal portfolio built with Astro, showcasing projects and skills',
    html_url: 'https://github.com/arnabdey73/astro-portfolio',
    stargazers_count: 5,
    forks_count: 2,
    language: 'Astro',
    topics: ['astro', 'portfolio', 'typescript', 'tailwindcss'],
    updated_at: '2024-12-01T12:00:00Z',
    created_at: '2024-11-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'devops-scripts',
    full_name: 'arnabdey73/devops-scripts',
    description: 'Collection of DevOps automation scripts and tools',
    html_url: 'https://github.com/arnabdey73/devops-scripts',
    stargazers_count: 8,
    forks_count: 3,
    language: 'Shell',
    topics: ['devops', 'automation', 'scripts', 'bash'],
    updated_at: '2024-11-15T14:30:00Z',
    created_at: '2024-09-01T09:00:00Z'
  }
];

/**
 * Fetches user's basic GitHub profile information
 */
export async function fetchGitHubProfile() {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'astro-portfolio/1.0'
      }
    });
    
    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded, using fallback data');
        return FALLBACK_PROFILE;
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    console.log('Using fallback profile data');
    return FALLBACK_PROFILE;
  }
}

/**
 * Fetches user's public repositories with pagination
 */
export async function fetchGitHubRepositories(page = 1, perPage = 100) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?page=${page}&per_page=${perPage}&sort=updated&type=public`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'astro-portfolio/1.0'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded, using fallback repository data');
        return FALLBACK_REPOS;
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    console.log('Using fallback repository data');
    return FALLBACK_REPOS;
  }
}

/**
 * Fetches user's contribution activity (simplified version)
 */
export async function fetchGitHubEvents() {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'astro-portfolio/1.0'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded, using fallback activity data');
        return generateFallbackEvents();
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub events:', error);
    console.log('Using fallback activity data');
    return generateFallbackEvents();
  }
}

/**
 * Generates fallback activity data when GitHub API is unavailable
 */
function generateFallbackEvents() {
  const events = [];
  const eventTypes = ['PushEvent', 'CreateEvent', 'ForkEvent', 'WatchEvent'];
  const repos = ['astro-portfolio', 'devops-scripts', 'kubernetes-configs'];
  
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    events.push({
      id: `fallback_${i}`,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      actor: {
        login: GITHUB_USERNAME,
        avatar_url: 'https://github.com/arnabdey73.png'
      },
      repo: {
        name: `${GITHUB_USERNAME}/${repos[Math.floor(Math.random() * repos.length)]}`
      },
      created_at: date.toISOString(),
      payload: {
        commits: Math.floor(Math.random() * 5) + 1
      }
    });
  }
  
  return events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
