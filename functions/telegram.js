// 处理与Telegram Bot的交互
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// 上传文件到Telegram
export async function onRequestPost(context) {
    const { request } = context;
    
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const artist = formData.get('artist');
        const title = formData.get('title');
        
        if (!file || !artist || !title) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: '缺少必要参数' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // 创建用于发送到Telegram的FormData
        const telegramFormData = new FormData();
        telegramFormData.append('chat_id', TELEGRAM_CHAT_ID);
        telegramFormData.append('audio', file);
        telegramFormData.append('title', title);
        telegramFormData.append('performer', artist);
        
        // 发送到Telegram Bot
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendAudio`, {
            method: 'POST',
            body: telegramFormData
        });
        
        const result = await response.json();
        
        if (result.ok) {
            return new Response(JSON.stringify({ 
                success: true,
                fileId: result.result.audio.file_id
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ 
                success: false, 
                error: result.description 
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
