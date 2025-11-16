// 上传功能
document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close');
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = uploadProgress.querySelector('.progress-fill');
    
    // 打开上传模态框
    uploadBtn.addEventListener('click', function() {
        uploadModal.style.display = 'flex';
    });
    
    // 关闭上传模态框
    closeBtn.addEventListener('click', function() {
        uploadModal.style.display = 'none';
        resetUploadForm();
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
            resetUploadForm();
        }
    });
    
    // 处理表单提交
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = fileInput.files[0];
        const artistName = document.getElementById('artistName').value;
        const songTitle = document.getElementById('songTitle').value;
        
        if (!file) {
            alert('请选择音乐文件');
            return;
        }
        
        uploadFile(file, artistName, songTitle);
    });
});

// 重置上传表单
function resetUploadForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('uploadProgress').style.display = 'none';
    document.querySelector('.progress-fill').style.width = '0%';
}

// 上传文件到Telegram Bot
async function uploadFile(file, artist, title) {
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = uploadProgress.querySelector('.progress-fill');
    
    try {
        // 显示进度条
        uploadProgress.style.display = 'block';
        
        // 创建FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('artist', artist);
        formData.append('title', title);
        
        // 模拟上传进度 - 实际部署时应使用真实的上传进度
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            progressFill.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                
                // 在实际部署中，这里应该调用Cloudflare Function上传文件
                // const response = await fetch('/api/upload', {
                //     method: 'POST',
                //     body: formData
                // });
                
                // 模拟上传完成
                setTimeout(() => {
                    alert('上传成功！');
                    document.getElementById('uploadModal').style.display = 'none';
                    resetUploadForm();
                    
                    // 重新加载歌曲列表
                    loadSongs();
                }, 500);
            }
        }, 100);
        
    } catch (error) {
        console.error('上传失败:', error);
        alert('上传失败，请重试');
        uploadProgress.style.display = 'none';
    }
}
