// 全局变量
let allSongs = [];
let filteredSongs = [];
let currentPage = 1;
const songsPerPage = 10;
let currentArtistFilter = '';
let currentSearchQuery = '';

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    loadSongs();
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    document.getElementById('searchInput').addEventListener('input', function(e) {
        currentSearchQuery = e.target.value.toLowerCase();
        filterSongs();
    });
    
    // 歌手筛选
    document.getElementById('artistSelect').addEventListener('change', function(e) {
        currentArtistFilter = e.target.value;
        filterSongs();
    });
    
    // 分页按钮
    document.getElementById('pagination').addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            const page = parseInt(e.target.dataset.page);
            if (page) {
                currentPage = page;
                displaySongs();
            }
        }
    });
}

// 从Telegram Bot加载歌曲数据
async function loadSongs() {
    try {
        // 在实际部署中，这里应该调用Cloudflare Function来获取歌曲数据
        // const response = await fetch('/api/files');
        // allSongs = await response.json();
        
        // 模拟数据 - 实际部署时应删除
        allSongs = [
            { id: 1, title: '示例歌曲1', artist: '周杰伦', duration: '3:45', fileId: 'example1' },
            { id: 2, title: '示例歌曲2', artist: '林俊杰', duration: '4:20', fileId: 'example2' },
            { id: 3, title: '示例歌曲3', artist: '邓紫棋', duration: '3:30', fileId: 'example3' },
            { id: 4, title: '示例歌曲4', artist: '周杰伦', duration: '4:05', fileId: 'example4' },
            { id: 5, title: '示例歌曲5', artist: 'Taylor Swift', duration: '3:50', fileId: 'example5' },
            { id: 6, title: '示例歌曲6', artist: '林俊杰', duration: '4:15', fileId: 'example6' },
            { id: 7, title: '示例歌曲7', artist: '邓紫棋', duration: '3:25', fileId: 'example7' },
            { id: 8, title: '示例歌曲8', artist: '周杰伦', duration: '3:55', fileId: 'example8' },
            { id: 9, title: '示例歌曲9', artist: 'Taylor Swift', duration: '4:10', fileId: 'example9' },
            { id: 10, title: '示例歌曲10', artist: '林俊杰', duration: '3:40', fileId: 'example10' },
            { id: 11, title: '示例歌曲11', artist: '邓紫棋', duration: '4:00', fileId: 'example11' },
            { id: 12, title: '示例歌曲12', artist: '周杰伦', duration: '3:35', fileId: 'example12' }
        ];
        
        filterSongs();
        populateArtistFilter();
        displayArtists();
    } catch (error) {
        console.error('加载歌曲失败:', error);
        alert('加载歌曲失败，请刷新页面重试');
    }
}

// 筛选歌曲
function filterSongs() {
    filteredSongs = allSongs.filter(song => {
        const matchesSearch = currentSearchQuery === '' || 
            song.title.toLowerCase().includes(currentSearchQuery) || 
            song.artist.toLowerCase().includes(currentSearchQuery);
        
        const matchesArtist = currentArtistFilter === '' || song.artist === currentArtistFilter;
        
        return matchesSearch && matchesArtist;
    });
    
    currentPage = 1;
    displaySongs();
    updatePagination();
}

// 显示歌曲列表
function displaySongs() {
    const songsList = document.getElementById('songsList');
    songsList.innerHTML = '';
    
    const startIndex = (currentPage - 1) * songsPerPage;
    const endIndex = startIndex + songsPerPage;
    const songsToDisplay = filteredSongs.slice(startIndex, endIndex);
    
    if (songsToDisplay.length === 0) {
        songsList.innerHTML = '<div class="no-songs">没有找到匹配的歌曲</div>';
        return;
    }
    
    songsToDisplay.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.dataset.id = song.id;
        
        songItem.innerHTML = `
            <i class="fas fa-music"></i>
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="artist-name">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;
        
        songItem.addEventListener('click', function() {
            playSong(song);
            highlightPlayingSong(song.id);
        });
        
        songsList.appendChild(songItem);
    });
}

// 更新分页
function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
    
    if (totalPages <= 1) return;
    
    // 添加上一页按钮
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.dataset.page = currentPage - 1;
        pagination.appendChild(prevButton);
    }
    
    // 添加页码按钮
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.dataset.page = i;
        
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        
        pagination.appendChild(pageButton);
    }
    
    // 添加下一页按钮
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.dataset.page = currentPage + 1;
        pagination.appendChild(nextButton);
    }
}

// 填充歌手筛选器
function populateArtistFilter() {
    const artistSelect = document.getElementById('artistSelect');
    const artists = [...new Set(allSongs.map(song => song.artist))];
    
    artists.forEach(artist => {
        const option = document.createElement('option');
        option.value = artist;
        option.textContent = artist;
        artistSelect.appendChild(option);
    });
}

// 显示歌手分类
function displayArtists() {
    const artistsList = document.getElementById('artistsList');
    artistsList.innerHTML = '';
    
    const artistCounts = {};
    allSongs.forEach(song => {
        artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
    });
    
    Object.keys(artistCounts).forEach(artist => {
        const artistCard = document.createElement('div');
        artistCard.className = 'artist-card';
        artistCard.dataset.artist = artist;
        
        artistCard.innerHTML = `
            <i class="fas fa-user"></i>
            <h3>${artist}</h3>
            <p>${artistCounts[artist]} 首歌曲</p>
        `;
        
        artistCard.addEventListener('click', function() {
            // 移除其他活动状态
            document.querySelectorAll('.artist-card').forEach(card => {
                card.classList.remove('active');
            });
            
            // 设置当前活动状态
            artistCard.classList.add('active');
            
            // 筛选歌曲
            currentArtistFilter = artist;
            document.getElementById('artistSelect').value = artist;
            filterSongs();
        });
        
        artistsList.appendChild(artistCard);
    });
}

// 播放歌曲
function playSong(song) {
    // 在实际部署中，这里应该调用Cloudflare Function获取文件URL
    // const fileUrl = await getFileUrl(song.fileId);
    
    // 模拟文件URL - 实际部署时应替换为真实URL
    const fileUrl = `https://example.com/music/${song.fileId}.mp3`;
    
    // 设置音频源并播放
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = fileUrl;
    
    // 更新播放器信息
    document.getElementById('currentSongTitle').textContent = song.title;
    document.getElementById('currentArtistName').textContent = song.artist;
    
    // 播放音频
    audioPlayer.play();
    
    // 更新播放按钮状态
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// 高亮正在播放的歌曲
function highlightPlayingSong(songId) {
    // 移除所有高亮
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('playing');
    });
    
    // 高亮当前歌曲
    const currentSongItem = document.querySelector(`.song-item[data-id="${songId}"]`);
    if (currentSongItem) {
        currentSongItem.classList.add('playing');
    }
}

// 从Telegram Bot获取文件URL
async function getFileUrl(fileId) {
    try {
        const response = await fetch(`/api/getFile?fileId=${fileId}`);
        const data = await response.json();
        
        if (data.success) {
            return data.fileUrl;
        } else {
            throw new Error('获取文件URL失败');
        }
    } catch (error) {
        console.error('获取文件URL失败:', error);
        throw error;
    }
}
