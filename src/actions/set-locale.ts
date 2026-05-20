'use server'

import { cookies } from 'next/headers'
import { isValidLocale, type Locale } from '@/i18n/config'

export async function setLocale(locale: Locale) {
    if (!isValidLocale(locale)) return

    const store = await cookies()
    store.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
}
