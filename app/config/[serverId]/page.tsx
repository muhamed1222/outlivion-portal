'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import Header from '@/components/layout/Header';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/components/ui/Toast';

interface Config {
  id: string;
  serverId: string;
  serverName: string;
  serverLocation: string;
  vlessConfig: string;
  qrCode: string;
  isActive: boolean;
}

export default function ConfigPage() {
  const router = useRouter();
  const params = useParams();
  const serverId = params.serverId as string;
  const { showToast } = useToast();

  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    async function fetchData() {
      try {
        const configRes = await api.get(`/servers/${serverId}/config`);
        setConfig(configRes.data);
      } catch (error: any) {
        console.error('Failed to fetch config:', error);
        if (error.response?.status === 403) {
          showToast('Требуется активная подписка', 'error');
          router.push('/billing');
        } else {
          showToast('Ошибка загрузки', 'error');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, serverId, showToast]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Скопировано!', 'success');
    } catch {
      showToast('Ошибка копирования', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-main border-t-transparent"></div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-primary flex justify-center">
      {/* Background glow */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-primary-main rounded-full filter blur-[128px] opacity-20 pointer-events-none"></div>
      
      {/* Main container - 448px */}
      <div className="w-full max-w-[448px] flex flex-col min-h-screen relative">
        <Header />

        <main className="flex-1 p-4 pb-20">
          <button
            onClick={() => router.back()}
            className="mb-4 text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </button>

          <h2 className="text-xl font-bold text-text-primary mb-6">
            {config.serverName}
          </h2>

          {/* QR код */}
          <div className="bg-background-card rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-semibold text-text-primary mb-4 text-center">
              QR код
            </h3>
            
            <div className="flex justify-center mb-4 p-4 bg-white rounded-xl">
              {config.qrCode ? (
                <img src={config.qrCode} alt="QR Code" className="w-40 h-40" />
              ) : (
                <QRCodeSVG value={config.vlessConfig} size={160} />
              )}
            </div>

            <p className="text-xs text-text-tertiary text-center">
              Отсканируйте в VPN приложении
            </p>
          </div>

          {/* VLESS конфигурация */}
          <div className="bg-background-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Конфигурация
            </h3>
            
            <div className="bg-background-tertiary rounded-xl p-3 mb-4 overflow-x-auto">
              <code className="text-xs text-text-secondary break-all whitespace-pre-wrap font-mono">
                {config.vlessConfig.substring(0, 100)}...
              </code>
            </div>

            <button
              onClick={() => copyToClipboard(config.vlessConfig)}
              className="w-full bg-primary-main text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Копировать
            </button>
          </div>

          <div className="mt-4 p-4 bg-background-card rounded-2xl">
            <p className="text-xs text-text-tertiary text-center">
              Импортируйте в v2rayNG, Clash или Shadowrocket
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
