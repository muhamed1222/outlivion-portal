'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex justify-center bg-background-primary relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-main rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none"></div>
      
      <div className="w-full max-w-[448px] flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-8xl font-bold text-primary-main mb-4">404</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Страница не найдена
        </h1>
        <p className="text-text-secondary mb-8">
          К сожалению, запрашиваемая страница не существует
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-primary-main text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Вернуться в личный кабинет
        </Link>
      </div>
    </div>
  );
}
