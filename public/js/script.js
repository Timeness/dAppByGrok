document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    const results = document.getElementById('results');
    const history = document.getElementById('history');
    const tabBar = document.getElementById('tabBar');
    const newTabBtn = document.getElementById('newTab');
    
    let tabs = [];
    let currentTab = null;
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Load initial tab
    addNewTab();

    // Search function
    async function search(query) {
        try {
            results.innerHTML = '<div class="text-center">Loading...</div>';
            const response = await fetch(`/search?q=${query}`);
            const data = await response.json();
            
            results.innerHTML = '';
            if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                data.RelatedTopics.forEach(topic => {
                    if (topic.Text && topic.FirstURL) {
                        const div = document.createElement('div');
                        div.className = 'bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors';
                        div.innerHTML = `
                            <a href="${topic.FirstURL}" target="_blank" class="text-indigo-300 hover:text-indigo-100">
                                ${topic.Text}
                            </a>
                        `;
                        results.appendChild(div);
                    }
                });
            } else {
                results.innerHTML = '<div class="text-center">No results found</div>';
            }

            // Update history
            if (!searchHistory.includes(query)) {
                searchHistory.unshift(query);
                if (searchHistory.length > 10) searchHistory.pop();
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                updateHistory();
            }
        } catch (error) {
            results.innerHTML = '<div class="text-center text-red-400">Error loading results</div>';
        }
    }

    // Update search history display
    function updateHistory() {
        history.innerHTML = '';
        searchHistory.forEach(query => {
            const div = document.createElement('div');
            div.className = 'bg-white/10 p-2 rounded hover:bg-white/20 transition-colors cursor-pointer';
            div.textContent = query;
            div.onclick = () => {
                searchInput.value = query;
                search(query);
            };
            history.appendChild(div);
        });
    }

    // Tab management
    function addNewTab() {
        const tabId = Date.now();
        const tab = document.createElement('button');
        tab.className = 'tab bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors';
        tab.textContent = `Tab ${tabs.length + 1}`;
        tab.dataset.id = tabId;
        
        tab.onclick = () => switchTab(tabId);
        tabBar.insertBefore(tab, newTabBtn);

        tabs.push({ id: tabId, query: '' });
        if (!currentTab) switchTab(tabId);
    }

    function switchTab(tabId) {
        currentTab = tabs.find(t => t.id === tabId);
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            if (t.dataset.id === tabId.toString()) t.classList.add('active');
        });
        searchInput.value = currentTab.query;
        if (currentTab.query) search(currentTab.query);
        else results.innerHTML = '';
    }

    // Event listeners
    searchBtn.onclick = () => {
        const query = searchInput.value.trim();
        if (query && currentTab) {
            currentTab.query = query;
            search(query);
        }
    };

    reloadBtn.onclick = () => {
        if (currentTab && currentTab.query) search(currentTab.query);
    };

    newTabBtn.onclick = addNewTab;

    searchInput.onkeypress = (e) => {
        if (e.key === 'Enter') searchBtn.click();
    };

    // Initial history load
    updateHistory();
