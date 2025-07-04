import type { APIRoute } from 'astro';
import { 
  fetchGitHubProfile, 
  fetchGitHubRepositories, 
  fetchGitHubEvents,
  calculateGitHubStats,
  categorizeRepositories,
  formatRepositoryForDisplay
} from '../../utils/github-api.js';

// Simple in-memory cache with 1-hour expiration
let cache = {
  data: null,
  timestamp: 0,
  expiration: 60 * 60 * 1000 // 1 hour in milliseconds
};

export const GET: APIRoute = async () => {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (cache.data && (now - cache.timestamp) < cache.expiration) {
      console.log('Serving GitHub data from cache');
      return new Response(JSON.stringify({
        success: true,
        data: cache.data,
        cached: true,
        cache_age: Math.floor((now - cache.timestamp) / 1000)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Fetching fresh GitHub data...');

    // Fetch data from GitHub API
    const [profile, repositories, events] = await Promise.all([
      fetchGitHubProfile(),
      fetchGitHubRepositories(),
      fetchGitHubEvents()
    ]);

    if (!profile) {
      throw new Error('Failed to fetch GitHub profile');
    }

    // Calculate statistics
    const githubStats = calculateGitHubStats(profile, repositories, events);

    // Categorize repositories
    const categorizedRepos = categorizeRepositories(repositories);

    // Format repositories for display (limit to most recent/popular ones)
    const formattedRepositories = repositories
      .filter(repo => !repo.fork && !repo.archived) // Exclude forks and archived repos
      .sort((a, b) => {
        // Sort by stars first, then by update date
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      })
      .slice(0, 12) // Limit to top 12 repositories
      .map(formatRepositoryForDisplay);

    // Create categories with repository counts
    const categories = [
      {
        name: "Infrastructure as Code",
        slug: "iac",
        icon: "devicon-terraform-plain colored",
        count: categorizedRepos.iac.length,
        repositories: categorizedRepos.iac.slice(0, 6).map(formatRepositoryForDisplay)
      },
      {
        name: "Azure Cloud",
        slug: "azure",
        icon: "devicon-azure-plain colored",
        count: categorizedRepos.azure.length,
        repositories: categorizedRepos.azure.slice(0, 6).map(formatRepositoryForDisplay)
      },
      {
        name: "DevOps",
        slug: "devops",
        icon: "devicon-jenkins-plain colored",
        count: categorizedRepos.devops.length,
        repositories: categorizedRepos.devops.slice(0, 6).map(formatRepositoryForDisplay)
      },
      {
        name: "Kubernetes",
        slug: "kubernetes",
        icon: "devicon-kubernetes-plain colored",
        count: categorizedRepos.kubernetes.length,
        repositories: categorizedRepos.kubernetes.slice(0, 6).map(formatRepositoryForDisplay)
      },
      {
        name: "Automation",
        slug: "automation",
        icon: "devicon-python-plain colored",
        count: categorizedRepos.automation.length,
        repositories: categorizedRepos.automation.slice(0, 6).map(formatRepositoryForDisplay)
      },
      {
        name: "Monitoring",
        slug: "monitoring",
        icon: "devicon-grafana-original colored",
        count: categorizedRepos.monitoring.length,
        repositories: categorizedRepos.monitoring.slice(0, 6).map(formatRepositoryForDisplay)
      },
      {
        name: "Web Development",
        slug: "web",
        icon: "devicon-html5-plain colored",
        count: categorizedRepos.web.length,
        repositories: categorizedRepos.web.slice(0, 6).map(formatRepositoryForDisplay)
      }
    ].filter(category => category.count > 0); // Only include categories with repositories

    // Generate some recent contributions based on events
    const contributions = events
      .filter(event => ['PushEvent', 'CreateEvent', 'IssuesEvent', 'PullRequestEvent'].includes(event.type))
      .slice(0, 10)
      .map(event => {
        let action = 'Contributed to';
        let category = 'other';
        
        switch (event.type) {
          case 'PushEvent':
            action = 'Pushed code to';
            break;
          case 'CreateEvent':
            action = 'Created';
            break;
          case 'IssuesEvent':
            action = 'Opened issue in';
            break;
          case 'PullRequestEvent':
            action = 'Created pull request in';
            break;
        }

        // Try to categorize based on repository name/description
        const repoName = event.repo.name.toLowerCase();
        if (repoName.includes('terraform') || repoName.includes('bicep')) category = 'iac';
        else if (repoName.includes('azure')) category = 'azure';
        else if (repoName.includes('k8s') || repoName.includes('kubernetes')) category = 'kubernetes';
        else if (repoName.includes('devops') || repoName.includes('ci')) category = 'devops';
        else if (repoName.includes('monitor') || repoName.includes('grafana')) category = 'monitoring';
        else if (repoName.includes('script') || repoName.includes('automation')) category = 'automation';

        return {
          name: event.repo.name,
          description: `${action} ${event.repo.name}`,
          url: `https://github.com/${event.repo.name}`,
          category: category,
          date: event.created_at
        };
      });

    // Format repositories for the personal projects section
    const personalRepositories = repositories
      .filter(repo => !repo.fork && !repo.archived) // Exclude forks and archived repos
      .sort((a, b) => {
        // Sort by stars first, then by update date
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      })
      .slice(0, 12) // Limit to top 12 repositories
      .map(repo => {
        // Determine category for this repo
        let category = 'other';
        const repoName = repo.name.toLowerCase();
        const description = (repo.description || '').toLowerCase();
        const topics = repo.topics || [];
        const language = (repo.language || '').toLowerCase();

        if (language.includes('hcl') || 
            topics.some(t => ['terraform', 'bicep', 'cloudformation', 'pulumi'].includes(t)) ||
            description.includes('terraform') || description.includes('infrastructure')) {
          category = 'iac';
        } else if (topics.some(t => t.includes('azure')) || 
            description.includes('azure') || 
            repoName.includes('azure')) {
          category = 'azure';
        } else if (topics.some(t => ['devops', 'ci-cd', 'jenkins', 'github-actions'].includes(t)) ||
            description.includes('devops') || description.includes('ci/cd')) {
          category = 'devops';
        } else if (topics.some(t => ['kubernetes', 'k8s', 'helm', 'docker'].includes(t)) ||
            description.includes('kubernetes') || description.includes('docker')) {
          category = 'kubernetes';
        } else if (language.includes('python') || language.includes('bash') ||
            topics.some(t => ['automation', 'scripting', 'python'].includes(t)) ||
            description.includes('automation') || description.includes('script')) {
          category = 'automation';
        } else if (topics.some(t => ['monitoring', 'grafana', 'prometheus', 'observability'].includes(t)) ||
            description.includes('monitoring') || description.includes('grafana')) {
          category = 'monitoring';
        } else if (['javascript', 'typescript', 'html', 'css', 'vue', 'react', 'astro'].includes(language) ||
            topics.some(t => ['web', 'frontend', 'backend', 'fullstack'].includes(t))) {
          category = 'web';
        }

        return {
          name: repo.name,
          description: repo.description || 'No description available',
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updated_at: repo.updated_at,
          category: category
        };
      });

    // Prepare final data structure
    const githubData = {
      githubStats,
      categories,
      repositories: personalRepositories,
      contributions,
      profile: {
        login: profile.login,
        avatar_url: profile.avatar_url,
        html_url: profile.html_url,
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        blog: profile.blog,
        company: profile.company
      },
      lastFetched: new Date().toISOString()
    };

    // Update cache
    cache = {
      data: githubData,
      timestamp: now,
      expiration: cache.expiration
    };

    console.log('GitHub data fetched and cached successfully');

    return new Response(JSON.stringify({
      success: true,
      data: githubData,
      cached: false
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    
    // If we have cached data, serve it even if expired
    if (cache.data) {
      console.log('Serving stale cached data due to error');
      return new Response(JSON.stringify({
        success: true,
        data: cache.data,
        cached: true,
        stale: true,
        error: 'Failed to fetch fresh data, serving cached version'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If no cached data and error, return error response
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch GitHub data',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
