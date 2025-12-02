# Исправление проблем с cloudflared

## Проблема: "Failed to dial a quic connection"

Если cloudflared не может подключиться, попробуйте следующие решения:

### Решение 1: Использовать HTTP протокол вместо QUIC

```bash
cloudflared tunnel --url http://localhost:3000 --protocol http2
```

### Решение 2: Проверить, что Portal запущен

Убедитесь, что Portal запущен на порту 3000:
```bash
cd outlivion-portal
npm run dev
```

### Решение 3: Использовать простой режим

```bash
cloudflared tunnel --url http://127.0.0.1:3000
```

### Решение 4: Вернуться к localtunnel (с паролем)

Если cloudflared не работает, используйте localtunnel:

```bash
# Установите
npm install -g localtunnel

# Запустите с автоматическим открытием
lt --port 3000 --open

# Или просто
lt --port 3000
# (пароль будет показан в терминале)
```

### Решение 5: Использовать ngrok (требует регистрации)

1. Зарегистрируйтесь: https://dashboard.ngrok.com/signup
2. Получите authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
3. Установите: `ngrok config add-authtoken YOUR_AUTHTOKEN`
4. Запустите: `ngrok http 3000`

## Рекомендация

Если cloudflared не работает из-за проблем с сетью, используйте **localtunnel** - он более простой и обычно работает лучше в локальных сетях.


