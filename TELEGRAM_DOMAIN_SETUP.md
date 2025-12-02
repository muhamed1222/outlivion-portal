# Настройка домена для Telegram Login Widget

## Проблема: "Bot domain invalid"

Эта ошибка возникает, когда домен не добавлен в настройки бота в BotFather.

## Решение для локальной разработки

Telegram Login Widget **не поддерживает localhost напрямую**. Нужно использовать туннель.

### Вариант 1: Использовать ngrok (рекомендуется)

1. Установите ngrok:
   ```bash
   brew install ngrok
   # или скачайте с https://ngrok.com/
   ```

2. Запустите ngrok для порта 3000:
   ```bash
   ngrok http 3000
   ```

3. Скопируйте полученный URL (например: `https://abc123.ngrok.io`)

4. Добавьте домен в BotFather:
   - Откройте @BotFather в Telegram
   - Отправьте `/mybots`
   - Выберите `@outlivionbot`
   - Выберите "Bot Settings" → "Domain"
   - Введите домен: `abc123.ngrok.io` (без https://)
   - Сохраните

5. Обновите `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_TELEGRAM_BOT_NAME=outlivionbot
   ```

6. Откройте приложение через ngrok URL:
   ```
   https://abc123.ngrok.io/login
   ```

### Вариант 2: Использовать другой туннель

- **Cloudflare Tunnel**: `cloudflared tunnel --url http://localhost:3000`
- **localtunnel**: `npx localtunnel --port 3000`
- **serveo**: `ssh -R 80:localhost:3000 serveo.net`

### Вариант 3: Развернуть на тестовом сервере

Если у вас есть тестовый сервер с доменом, используйте его.

## Проверка

После настройки:
1. Откройте приложение через туннель URL
2. Откройте консоль браузера (F12)
3. Должны увидеть: `✅ Telegram widget script loaded successfully`
4. Кнопка входа через Telegram должна появиться

## Важно

- Домен должен быть добавлен в BotFather **до** использования виджета
- После изменения домена может потребоваться несколько минут для применения
- Используйте HTTPS URL для туннеля (ngrok предоставляет HTTPS по умолчанию)


