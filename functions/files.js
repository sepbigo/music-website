// 获取存储在Telegram Bot中的文件列表
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// 获取文件列表
export async function onRequestGet(context) {
    try {
        // 在实际部署中，这里应该从数据库或存储中获取文件列表
        // 由于Telegram Bot API没有直接获取所有文件的方法，
        // 我们需要维护自己的文件索引
        
        // 模拟返回文件列表 - 实际部署时应从数据库获取
        const files = [
            { id: 1, title: '示例歌曲1', artist: '周杰伦', duration: '3:45', fileId: 'example1' },
            { id: 2, title: '示例歌曲2', artist: '林俊杰', duration: '4:20', fileId: 'example2' },
            { id: 3, title: '示例歌曲3', artist: '邓紫棋', duration: '3:30', fileId: 'example3' }
        ];
        
        return new Response(JSON.stringify(files), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// 获取单个文件的URL
export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const fileId = url.searchParams.get('fileId');
    
    if (!fileId) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: '缺少文件ID' 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        // 从Telegram获取文件信息
        const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
        const fileResult = await fileResponse.json();
        
        if (fileResult.ok) {
            const filePath = fileResult.result.file_path;
            const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
            
            return new Response(JSON.stringify({ 
                success: true,
                fileUrl: fileUrl
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ 
                success: false, 
                error: '获取文件信息失败' 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
