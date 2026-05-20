'use client'

import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Home() {
  const { user } = useUser()
  const createUser = useMutation(api.user.createUser)
  const t = useTranslations('home')

  const CheckUser = async () => {
    if (!user?.fullName || !user?.primaryEmailAddress?.emailAddress || !user?.imageUrl) {
      return
    }

    await createUser({
      userName: user.fullName,
      email: user.primaryEmailAddress.emailAddress,
      upgrate: false,
      imageUrl: user.imageUrl
    })
  }

  useEffect(() => {
    user && CheckUser()
  }, [user])

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 shrink-0">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="logo"
            width={130}
            height={130}
            className="h-8 w-auto md:h-10"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-black/70 transition-colors">{t('nav.features')}</a>
          <a href="#solution" className="hover:text-black/70 transition-colors">{t('nav.solution')}</a>
          <a href="#testimonials" className="hover:text-black/70 transition-colors">{t('nav.testimonials')}</a>
          <a href="#blog" className="hover:text-black/70 transition-colors">{t('nav.blog')}</a>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <UserButton />
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" className="text-sm px-4 py-2">{t('signIn')}</Button>
            </Link>
          )}
        </div>
      </nav>

      <section className="flex grow items-center justify-center px-4 py-6 md:px-6 md:py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
            {t('hero.titlePrefix')} <span className="text-red-500">{t('hero.pdf')}</span> {t('hero.titleSuffix')}<br />
            {t('hero.with')} <span className="text-blue-600">{t('hero.aiPowered')}</span>
          </h1>

          <p className="mt-4 md:mt-6 text-base md:text-xl text-slate-600 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="mt-6 md:mt-8 flex items-center justify-center gap-3 md:gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-6 md:px-10 py-4 md:py-6 text-base md:text-lg rounded-full">
                {t('hero.getStarted')}
              </Button>
            </Link>

            <Button size="lg" variant="outline" className="px-6 md:px-10 py-4 md:py-6 text-base md:text-lg rounded-full">
              {t('hero.learnMore')}
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-b bg-white/80 py-6 md:py-8 shrink-0">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6">
          <div className="text-center">
            <div className="font-semibold text-base md:text-lg">{t('features.lowestPrice.title')}</div>
            <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-base">{t('features.lowestPrice.description')}</p>
          </div>
          <div className="text-center">
            <div className="font-semibold text-base md:text-lg">{t('features.fastest.title')}</div>
            <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-base">{t('features.fastest.description')}</p>
          </div>
          <div className="text-center">
            <div className="font-semibold text-base md:text-lg">{t('features.mostLoved.title')}</div>
            <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-base">{t('features.mostLoved.description')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
