# Настройка Telegram Login Widget

## Текущие настройки

- **Имя бота:** `outlivionbot`
- **Токен:** Установлен в `outlivion-backend/.env`

## Важно для работы виджета

Telegram Login Widget требует, чтобы домен был добавлен в настройки бота:

1. Откройте @BotFather в Telegram
2. Отправьте команду `/mybots`
3. Выберите вашего бота (`@outlivionbot`)
4. Выберите "Bot Settings" → "Domain"
5. Добавьте домен: `localhost` (для разработки) или ваш домен (для продакшена)

## Перезапуск после изменения .env.local

**ВАЖНО:** Next.js загружает переменные окружения `NEXT_PUBLIC_*` только при старте!

После изменения `.env.local`:

```bash
# Остановите сервер (Ctrl+C)
# Затем запустите снова:
cd outlivion-portal
npm run dev
```

## Проверка работы

1. Откройте http://localhost:3000/login
2. Откройте консоль браузера (F12)
3. Должно быть сообщение: "Telegram widget loaded successfully"
4. Кнопка входа через Telegram должна появиться

## Отладка

Если кнопка не появляется:

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что Portal перезапущен после изменения .env.local
3. Проверьте, что домен добавлен в настройки бота в BotFather
4. Проверьте файл `.env.local` - должно быть: `NEXT_PUBLIC_TELEGRAM_BOT_NAME=outlivionbot`


