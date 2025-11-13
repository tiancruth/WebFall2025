//filler video database
const VIDEO_DATABASE = 
[
    { 
        id: 1, title: "feta tomato pasta", category: "cooking", engagement: 0.7, thumbnail: "🍝" 
    },

    { 
        id: 2, title: "orange cat", category: "pets", engagement: 0.9, thumbnail: "😺" 
    },

    { 
        id: 3, title: "5 minutes crafts", category: "diy", engagement: 0.6, thumbnail: "🏠" 
    },

    { 
        id: 4, title: "how to do the renegade", category: "dance", engagement: 0.85, thumbnail: "💃" 
    },

    { 
        id: 5, title: "bunny the talking dog", category: "pets", engagement: 0.8, thumbnail: "🐕" 
    },

    { 
        id: 6, title: "james charles makeup", category: "beauty", engagement: 0.75, thumbnail: "💄" 
    },

    { 
        id: 7, title: "mug cake recipe", category: "cooking", engagement: 0.7, thumbnail: "☕" 
    },

    { 
        id: 8, title: "five nights at freddys", category: "gaming", engagement: 0.8, thumbnail: "🎮" 
    },

    { 
        id: 9, title: "going to honolulu to get something", category: "travel", engagement: 0.65, thumbnail: "🗼" 
    },

    { 
        id: 10, title: "gym bros", category: "fitness", engagement: 0.7, thumbnail: "💪" 
    },

    { 
        id: 11, title: "bee wants that cookie", category: "cooking", engagement: 0.75, thumbnail: "🍪" 
    },

    { 
        id: 12, title: "impractical jokers", category: "comedy", engagement: 0.85, thumbnail: "😂" 
    },

    { 
        id: 13, title: "plants", category: "diy", engagement: 0.6, thumbnail: "🌱" 
    },

    { 
        id: 14, title: "bins haul to resell on depop", category: "fashion", engagement: 0.7, thumbnail: "👗" 
    },

    { 
        id: 15, title: "judy hopps lover", category: "pets", engagement: 0.9, thumbnail: "🐰"
    },
];

let userProfile = 
{
    preferences: {},
    interactions: [],
    totalVideosWatched: 0
};

let currentVideo = null;
let feedQueue = [];
let showStats = false;

//initialize
function init() 
{
    generateInitialFeed();
    updateDisplay();
}

function generateInitialFeed() 
{
    const shuffled = [...VIDEO_DATABASE].sort(() => Math.random() - 0.5);
    feedQueue = shuffled.slice(0, 5);
    currentVideo = feedQueue[0];
}

function calculateRecommendationScore(video) 
{
    let score = video.engagement;
    const categoryPref = userProfile.preferences[video.category] || 0;
    score += categoryPref * 2;
    score += Math.random() * 0.3;
    return score;
}

function getNextVideo() 
{
    const remainingQueue = feedQueue.slice(1);
    const availableVideos = VIDEO_DATABASE.filter(
        v => !remainingQueue.find(qv => qv.id === v.id) && v.id !== currentVideo.id
    );

    const scoredVideos = availableVideos.map(video => (
    {
        ...video,
        score: calculateRecommendationScore(video)
    })).sort((a, b) => b.score - a.score);

    if (scoredVideos.length > 0) 
    {
        const newQueue = [...remainingQueue, scoredVideos[0]];
        feedQueue = newQueue;
        return newQueue[0];
    }

    return remainingQueue[0] || VIDEO_DATABASE[0];
}

function handleLike() 
{
    recordInteraction('like', 100);
    moveToNextVideo();
}

function handleSkip() 
{
    recordInteraction('skip', 10);
    moveToNextVideo();
}

function recordInteraction(type, watchTime) 
{
    const category = currentVideo.category;
    const currentPref = userProfile.preferences[category] || 0;

    const prefChange = type === 'like' ? 0.3 : watchTime / 500;
    const newPref = Math.min(1, currentPref + prefChange);
    const finalPref = type === 'skip' ? Math.max(0, newPref - 0.1) : newPref;

    userProfile.preferences[category] = finalPref;
    userProfile.interactions.push({
        videoId: currentVideo.id,
        type,
        watchTime,
        category,
        timestamp: Date.now()
    });
    userProfile.interactions = userProfile.interactions.slice(-20);
    userProfile.totalVideosWatched++;

    updateDisplay();
}

function moveToNextVideo() 
{
    currentVideo = getNextVideo();
    updateDisplay();
}

function updateDisplay() 
{
    //video display
    document.getElementById('video-emoji').textContent = currentVideo.thumbnail;
    document.getElementById('video-title').textContent = currentVideo.title;
    document.getElementById('video-category').textContent = '#' + currentVideo.category;

    //recommendation reason
    let reason;
    if (userProfile.preferences[currentVideo.category] > 0.3) 
    {
        reason = `You've shown interest in ${currentVideo.category} content`;
    } 
    
    else if (userProfile.totalVideosWatched < 3) 
    {
        reason = 'Exploring your interests (cold start)';
    } 
    
    else 
    {
        reason = 'Popular content to keep you engaged';
    }
    document.getElementById('reason-text').textContent = reason;

    //stats update
    document.getElementById('videos-watched').textContent = userProfile.totalVideosWatched;

    //preferences if stats are showing
    if (showStats) 
    {
        updatePreferences();
    }
}

function updatePreferences() 
{
    const topCategories = Object.entries(userProfile.preferences)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const preferencesList = document.getElementById('preferences-list');
    
    if (topCategories.length > 0) 
    {
        preferencesList.innerHTML = topCategories.map(([category, value]) => `
            <div class="preference-item">
                <div class="stat-row">
                    <span style="text-transform: capitalize;">${category}</span>
                    <span>${Math.round(value * 100)}%</span>
                </div>
                ${value * 100}%"></div>
                </div>
            </div>
        `).join('');
    } 
    
    else 
    {
        preferencesList.innerHTML = '<p class="no-preferences">No preferences yet. Start interacting!</p>';
    }
}

function toggleStats() 
{
    showStats = !showStats;
    const prefsSection = document.getElementById('preferences-section');
    const btnText = document.getElementById('stats-btn-text');
    
    if (showStats) 
    {
        prefsSection.style.display = 'block';
        btnText.textContent = 'Hide Stats';
        updatePreferences();
    }
    
    else 
    {
        prefsSection.style.display = 'none';
        btnText.textContent = 'Show Stats';
    }
}

function resetAlgorithm() 
{
    userProfile = 
    {
        preferences: {},
        interactions: [],
        totalVideosWatched: 0
    };
    generateInitialFeed();
    updateDisplay();
}

//start toktik :)
init();