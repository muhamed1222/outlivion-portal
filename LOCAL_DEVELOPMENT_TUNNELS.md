# Туннели для локальной разработки Telegram Login Widget

## Проблема

Telegram Login Widget не работает с `localhost`. Нужен публичный URL с HTTPS.

## Решения

### Вариант 1: ngrok (требует регистрации)

1. Зарегистрируйтесь: https://dashboard.ngrok.com/signup
2. Получите authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
3. Установите токен:
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```
4. Запустите туннель:
   ```bash
   ngrok http 3000
   ```
5. Используйте полученный URL в BotFather

### Вариант 2: localtunnel (бесплатно, без регистрации) ⭐ РЕКОМЕНДУЕТСЯ

1. Установите:
   ```bash
   npm install -g localtunnel
   ```

2. Запустите туннель:
   ```bash
   lt --port 3000
   ```

3. Скопируйте URL (например: `https://abc123.loca.lt`)

4. Добавьте домен в BotFather:
   - Откройте @BotFather
   - `/mybots` → `@outlivionbot` → `Bot Settings` → `Domain`
   - Введите: `abc123.loca.lt` (без https://)

5. Откройте приложение через туннель URL

### Вариант 3: Cloudflare Tunnel (бесплатно)

1. Установите:
   ```bash
   brew install cloudflared
   ```

2. Запустите туннель:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. Используйте полученный URL в BotFather

### Вариант 4: serveo (бесплатно, без установки)

1. Запустите туннель:
   ```bash
   ssh -R 80:localhost:3000 serveo.net
   ```

2. Используйте полученный URL в BotFather

## Рекомендация

Для быстрого старта используйте **localtunnel** - он не требует регистрации и работает сразу.

## После настройки туннеля

1. Добавьте домен в @BotFather
2. Откройте приложение через туннель URL
3. Кнопка Telegram должна появиться!


