'use client'

import { setLocale } from '@/actions/set-locale'
import { type Locale } from '@/i18n/config'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function LanguageSwitcher() {
    const locale = useLocale() as Locale
    const t = useTranslations('language')
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const switchLocale = (nextLocale: Locale) => {
        if (nextLocale === locale) return

        startTransition(async () => {
            await setLocale(nextLocale)
            router.refresh()
        })
    }

    return (
        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white/80 p-0.5 text-sm">
            <button
                type="button"
                disabled={isPending}
                onClick={() => switchLocale('zh')}
                className={`rounded px-2.5 py-1 transition-colors ${locale === 'zh'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
            >
                {t('zh')}
            </button>
            <button
                type="button"
                disabled={isPending}
                onClick={() => switchLocale('en')}
                className={`rounded px-2.5 py-1 transition-colors ${locale === 'en'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
            >
                {t('en')}
            </button>
        </div>
    )
}
