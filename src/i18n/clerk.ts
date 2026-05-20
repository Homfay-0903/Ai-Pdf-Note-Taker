import { enUS, zhCN } from '@clerk/localizations'
import type { Locale } from './config'

const clerkLocalizations = {
    en: enUS,
    zh: zhCN,
} as const

export function getClerkLocalization(locale: Locale) {
    return clerkLocalizations[locale]
}
