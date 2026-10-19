import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'src', 'js', 'stats-data.js');

const USERNAME = 'Epitome87';
const GITHUB_ALL_API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}`;
const GITHUB_LAST_API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function fetchLeetCodeDirect(username) {
  const query = `
    query getCompleteLeetCodeData($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        submissionCalendar
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge {
          name
        }
      }
    }
  `;

  const res = await fetchWithTimeout(
    'https://leetcode.com/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username } }),
    },
    10000,
  );

  const data = res?.data;
  if (!data?.matchedUser) {
    throw new Error('LeetCode GraphQL returned no matchedUser');
  }

  const qMap = {};
  for (const q of data.allQuestionsCount || []) {
    qMap[q.difficulty] = q.count;
  }

  const acList = data.matchedUser.submitStatsGlobal?.acSubmissionNum || [];
  const acMap = {};
  for (const ac of acList) {
    acMap[ac.difficulty] = ac;
  }

  const totalList = data.matchedUser.submitStatsGlobal?.totalSubmissionNum || [];
  const totalSubmissions = totalList.find((t) => t.difficulty === 'All')?.submissions || 0;
  const acSubmissions = acMap['All']?.submissions || 0;
  const acceptanceRate = totalSubmissions > 0 ? (acSubmissions / totalSubmissions) * 100 : 83.47;

  let submissionCalendar = {};
  if (typeof data.matchedUser.submissionCalendar === 'string') {
    try {
      submissionCalendar = JSON.parse(data.matchedUser.submissionCalendar);
    } catch {}
  } else if (typeof data.matchedUser.submissionCalendar === 'object') {
    submissionCalendar = data.matchedUser.submissionCalendar || {};
  }

  const contest = data.userContestRanking;

  return {
    status: 'success',
    message: 'retrieved',
    totalSolved: acMap['All']?.count ?? 0,
    totalQuestions: qMap['All'] || 4086,
    easySolved: acMap['Easy']?.count ?? 0,
    totalEasy: qMap['Easy'] || 972,
    mediumSolved: acMap['Medium']?.count ?? 0,
    totalMedium: qMap['Medium'] || 2130,
    hardSolved: acMap['Hard']?.count ?? 0,
    totalHard: qMap['Hard'] || 984,
    acceptanceRate: Math.round(acceptanceRate * 100) / 100,
    ranking: data.matchedUser.profile?.ranking ?? 14840,
    contributionPoints: 0,
    reputation: data.matchedUser.profile?.reputation ?? 0,
    submissionCalendar,
    contestRating: contest?.rating != null ? Math.round(contest.rating) : 1737,
    contestTopPercentage: contest?.topPercentage != null ? Math.round(contest.topPercentage * 10) / 10 : 11.6,
    contestGlobalRanking: contest?.globalRanking ?? 0,
    contestTotalParticipants: contest?.totalParticipants ?? 0,
    contestAttended: contest?.attendedContestsCount ?? 0,
    contestBadge: contest?.badge?.name ?? null,
  };
}

async function fetchLeetCodeProxies(username) {
  const profileSources = [
    `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
    `https://leetcode-api-faisalshohag.vercel.app/${username}`,
    `https://leetcode-stats-api.herokuapp.com/${username}`,
  ];

  let baseStats = null;
  for (const url of profileSources) {
    try {
      console.log(`Fetching LeetCode from proxy (${url})...`);
      const data = await fetchWithTimeout(url, {}, 10000);
      if (data && (data.totalSolved != null || data.solvedProblem != null)) {
        const totalSolved = data.totalSolved ?? data.solvedProblem;
        const totalSubmissions = data.matchedUserStats?.totalSubmissionNum?.[0]?.submissions;
        const acSubmissions = data.matchedUserStats?.acSubmissionNum?.[0]?.submissions;
        const computedAcceptance =
          data.acceptanceRate != null
            ? data.acceptanceRate
            : totalSubmissions
              ? (acSubmissions / totalSubmissions) * 100
              : 83.47;

        baseStats = {
          status: 'success',
          message: 'retrieved',
          totalSolved,
          totalQuestions: data.totalQuestions || 4086,
          easySolved: data.easySolved ?? 0,
          totalEasy: data.totalEasy || 972,
          mediumSolved: data.mediumSolved ?? 0,
          totalMedium: data.totalMedium || 2130,
          hardSolved: data.hardSolved ?? 0,
          totalHard: data.totalHard || 984,
          acceptanceRate: Math.round(computedAcceptance * 100) / 100,
          ranking: data.ranking ?? 14840,
          contributionPoints: data.contributionPoint ?? data.contributionPoints ?? 0,
          reputation: data.reputation ?? 0,
          submissionCalendar: data.submissionCalendar ?? {},
          contestRating: 1737,
          contestTopPercentage: 11.6,
          contestGlobalRanking: 101386,
          contestTotalParticipants: 888637,
          contestAttended: 6,
          contestBadge: null,
        };
        break;
      }
    } catch (err) {
      console.warn(`LeetCode proxy profile failed (${url}):`, err.message);
    }
  }

  if (!baseStats) return null;

  const contestUrls = [
    `https://alfa-leetcode-api.onrender.com/userContestRankingInfo/${username}`,
    `https://alfa-leetcode-api.onrender.com/${username}/contest`,
  ];
  for (const url of contestUrls) {
    try {
      const data = await fetchWithTimeout(url, {}, 10000);
      const ranking = data?.userContestRanking || data;
      const rating = ranking?.rating ?? ranking?.contestRating;
      const topPercentage = ranking?.topPercentage ?? ranking?.contestTopPercentage;
      if (rating != null) {
        baseStats.contestRating = Math.round(rating);
        baseStats.contestTopPercentage = Math.round(topPercentage * 10) / 10;
        baseStats.contestGlobalRanking = ranking.globalRanking ?? ranking.contestGlobalRanking ?? 0;
        baseStats.contestTotalParticipants = ranking.totalParticipants ?? 0;
        baseStats.contestAttended = ranking.attendedContestsCount ?? ranking.contestAttend ?? 0;
        baseStats.contestBadge = ranking.badge?.name ?? ranking.contestBadges?.name ?? null;
        break;
      }
    } catch {}
  }

  return baseStats;
}

async function fetchLeetCodeStats(username) {
  // Strategy 1: Direct unified GraphQL query to LeetCode (fastest, single round-trip, authoritative)
  try {
    console.log('Fetching all LeetCode stats via direct GraphQL query...');
    const directData = await fetchLeetCodeDirect(username);
    if (directData && directData.totalSolved > 0) {
      console.log(
        `Direct LeetCode GraphQL succeeded: ${directData.totalSolved} solved, rank #${directData.ranking}, contest rating ${directData.contestRating} (top ${directData.contestTopPercentage}%).`,
      );
      return directData;
    }
  } catch (err) {
    console.warn('Direct LeetCode GraphQL query failed, attempting proxy fallbacks:', err.message);
  }

  // Strategy 2: Third-party REST proxy APIs
  return await fetchLeetCodeProxies(username);
}

async function main() {
  console.log('Fetching live stats snapshot for Epitome87...');

  let leetcodeData = null;
  let githubLastData = null;
  let githubAllData = null;

  try {
    leetcodeData = await fetchLeetCodeStats(USERNAME);
  } catch (err) {
    console.warn('Failed to fetch live LeetCode stats:', err.message);
  }

  try {
    console.log('Fetching GitHub trailing year contribution data (?y=last)...');
    githubLastData = await fetchWithTimeout(GITHUB_LAST_API_URL);
    console.log(`GitHub trailing year fetched successfully (${githubLastData.contributions?.length || 0} days).`);
  } catch (err) {
    console.warn('Failed to fetch live GitHub trailing year stats:', err.message);
  }

  try {
    console.log('Fetching GitHub full contribution history data...');
    githubAllData = await fetchWithTimeout(GITHUB_ALL_API_URL);
    console.log(
      `GitHub full history fetched successfully (${githubAllData.total ? Object.keys(githubAllData.total).length : 0} years).`,
    );
  } catch (err) {
    console.warn('Failed to fetch live GitHub all-years stats:', err.message);
  }

  if (!leetcodeData && !githubLastData && !githubAllData) {
    console.error(
      'Error: Could not fetch LeetCode or GitHub data. Aborting snapshot update to preserve existing data.',
    );
    process.exit(1);
  }

  let existingStats = {};
  try {
    const imported = await import(`file://${outputPath.replace(/\\/g, '/')}?t=${Date.now()}`);
    existingStats = imported;
  } catch {}

  const finalLeetCode = leetcodeData || existingStats.LEETCODE_SNAPSHOT || {};
  const rawLast =
    githubLastData && Array.isArray(githubLastData.contributions)
      ? githubLastData.contributions
      : existingStats.GITHUB_LAST_SNAPSHOT || [];
  const rawAll = githubAllData && githubAllData.contributions ? githubAllData : existingStats.GITHUB_SNAPSHOT || {};

  // 1. Calculate true all-time streak across the full multi-year history
  const allContributions = Array.isArray(rawAll.contributions) ? rawAll.contributions : [];
  let calculatedMaxStreak = 0;
  let runningStreak = 0;
  for (const c of allContributions) {
    if (c.count > 0) {
      runningStreak++;
      if (runningStreak > calculatedMaxStreak) calculatedMaxStreak = runningStreak;
    } else {
      runningStreak = 0;
    }
  }

  // Preserve maximum streak (computed or existing snapshot fallback)
  const maxStreak = Math.max(calculatedMaxStreak, rawAll.maxStreak || 0, 1883);

  // 2. Clean trailing 12 months (strip unused 'color' and 'intensity')
  const finalGithubLast = rawLast.map((c) => ({
    date: c.date,
    count: c.count,
  }));

  // 3. Clean full history: keep all year totals in .total, but filter daily items to top 5 visible years
  const allYears = rawAll.total ? Object.keys(rawAll.total).sort((a, b) => Number(b) - Number(a)) : [];
  const top5YearsSet = new Set(allYears.slice(0, 5));

  const finalContributions = allContributions
    .filter((c) => top5YearsSet.has(c.date.slice(0, 4)))
    .map((c) => ({
      date: c.date,
      count: c.count,
    }));

  const finalGithubAll = {
    total: rawAll.total || {},
    maxStreak: maxStreak,
    contributions: finalContributions,
  };

  const fileContent = `/* Generated by scripts/fetch-stats.mjs - Build pre-baked snapshot */
export const LEETCODE_SNAPSHOT = ${JSON.stringify(finalLeetCode, null, 2)};

export const GITHUB_LAST_SNAPSHOT = ${JSON.stringify(finalGithubLast, null, 2)};

export const GITHUB_SNAPSHOT = ${JSON.stringify(finalGithubAll, null, 2)};
`;

  await writeFile(outputPath, fileContent, 'utf8');
  console.log('Successfully written fresh optimized snapshot data to stats-data.js');
}

main().catch((err) => {
  console.error('Fatal error in fetch-stats:', err);
  process.exit(1);
});
