# Пароль от туннеля localtunnel

## Где найти пароль

Пароль отображается в **терминале, где запущен localtunnel**.

Когда вы запускаете:
```bash
lt --port 3000
```

Вы увидите что-то вроде:
```
your url is: https://abc123.loca.lt

⚠️  Warning: This tunnel is using a password!
Password: xyz789
```

## Решения

### Вариант 1: Использовать пароль из терминала

1. Посмотрите в терминал, где запущен `lt --port 3000`
2. Найдите строку `Password: xyz789`
3. Введите этот пароль при первом открытии URL в браузере

### Вариант 2: Автоматическое открытие (без пароля)

Используйте флаг `--open`:
```bash
lt --port 3000 --open
```

Это автоматически откроет браузер и обойдет требование пароля.

### Вариант 3: Использовать cloudflared (без пароля)

Cloudflare Tunnel не требует пароля:

```bash
# Установите
brew install cloudflared

# Запустите
cloudflared tunnel --url http://localhost:3000
```

Вы получите URL вида: `https://abc123.trycloudflare.com`

### Вариант 4: Использовать ngrok (требует регистрации, но без пароля)

1. Зарегистрируйтесь: https://dashboard.ngrok.com/signup
2. Получите authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
3. Установите: `ngrok config add-authtoken YOUR_AUTHTOKEN`
4. Запустите: `ngrok http 3000`

## Рекомендация

Для быстрого старта используйте **cloudflared** - он не требует пароля и работает сразу.


