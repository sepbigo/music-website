# 音乐网站

一个基于Cloudflare Pages的音乐网站，支持上传音乐到Telegram Bot存储，并在网站上分类播放。

## 功能特性

- 音乐文件上传到Telegram Bot存储
- 按歌手分类浏览音乐
- 搜索和筛选功能
- 响应式设计，支持全平台
- 自动分页
- 动态播放器
- 支持所有音乐格式

## 部署步骤

1. 创建Telegram Bot并获取Token
2. 在Cloudflare Pages上部署网站
3. 配置环境变量
4. 上传网站文件

## 环境变量

- `TELEGRAM_BOT_TOKEN`: Telegram Bot Token
- `TELEGRAM_CHAT_ID`: 用于存储文件的Telegram聊天ID

## 项目结构

- `public/`: 静态网站文件
- `functions/`: Cloudflare Functions
- `wrangler.toml`: Wrangler配置
- `_config.yml`: 部署配置
