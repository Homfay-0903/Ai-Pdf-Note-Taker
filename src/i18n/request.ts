import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, isValidLocale } from './config'

export default getRequestConfig(async () => {
    const store = await cookies()
    const cookieLocale = store.get('locale')?.value
    const locale = isValidLocale(cookieLocale) ? cookieLocale : defaultLocale

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    }
})
