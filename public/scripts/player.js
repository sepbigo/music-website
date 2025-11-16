// 播放器功能
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    
    // 播放/暂停功能
    playPauseBtn.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // 更新进度条
    audioPlayer.addEventListener('timeupdate', function() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            
            // 更新时间显示
            currentTimeEl.textContent = formatTime(currentTime);
            durationEl.textContent = formatTime(duration);
        }
    });
    
    // 点击进度条跳转
    progressBar.addEventListener('click', function(e) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });
    
    // 上一曲功能
    prevBtn.addEventListener('click', function() {
        playAdjacentSong(-1);
    });
    
    // 下一曲功能
    nextBtn.addEventListener('click', function() {
        playAdjacentSong(1);
    });
    
    // 音频结束自动下一曲
    audioPlayer.addEventListener('ended', function() {
        playAdjacentSong(1);
    });
});

// 格式化时间 (秒 -> 分:秒)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 播放相邻歌曲
function playAdjacentSong(direction) {
    const currentSongItem = document.querySelector('.song-item.playing');
    if (!currentSongItem) return;
    
    const currentSongId = parseInt(currentSongItem.dataset.id);
    const songItems = Array.from(document.querySelectorAll('.song-item'));
    const currentIndex = songItems.findIndex(item => parseInt(item.dataset.id) === currentSongId);
    
    let newIndex = currentIndex + direction;
    
    // 循环播放
    if (newIndex < 0) {
        newIndex = songItems.length - 1;
    } else if (newIndex >= songItems.length) {
        newIndex = 0;
    }
    
    // 播放新歌曲
    const newSongItem = songItems[newIndex];
    const songId = parseInt(newSongItem.dataset.id);
    
    // 在实际部署中，这里应该根据ID找到对应的歌曲对象
    // 现在只是模拟
    const songTitle = newSongItem.querySelector('.song-title').textContent;
    const artistName = newSongItem.querySelector('.artist-name').textContent;
    
    const song = {
        id: songId,
        title: songTitle,
        artist: artistName,
        fileId: `song${songId}`
    };
    
    playSong(song);
    highlightPlayingSong(songId);
}
