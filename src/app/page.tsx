'use client'

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { user } = useUser()
  const createUser = useMutation(api.user.createUser)

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="logo"
            width={150}
            height={150}
            className="h-10 w-auto"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <a href="#features" className="hover:text-black/70 transition-colors">Features</a>
          <a href="#solution" className="hover:text-black/70 transition-colors">Solution</a>
          <a href="#testimonials" className="hover:text-black/70 transition-colors">Testimonials</a>
          <a href="#blog" className="hover:text-black/70 transition-colors">Blog</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <UserButton />
          ) : (
            <Link href="/sign-in">
              <Button variant="outline">Sign in</Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tighter">
            Simplify <span className="text-red-500">PDF</span> Note-Taking<br />
            with <span className="text-blue-600">AI-Powered</span>
          </h1>

          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Elevate your note-taking experience with our AI-powered PDF app.
            Seamlessly extract key insights, summaries, and annotations from any PDF with just a few clicks.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-10 py-7 text-lg rounded-full">
                Get started
              </Button>
            </Link>

            <Button size="lg" variant="outline" className="px-10 py-7 text-lg rounded-full">
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Bar / Features Bar */}
      <section className="border-t border-b bg-white/80 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          <div className="text-center">
            <div className="font-semibold text-lg">The lowest price</div>
            <p className="text-slate-500 mt-2">Some text here</p>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">The fastest on the market</div>
            <p className="text-slate-500 mt-2">Some text here</p>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">The most loved</div>
            <p className="text-slate-500 mt-2">Some text here</p>
          </div>
        </div>
      </section>

      {/* Optional: Add more sections later (Features, Testimonials, etc.) */}
    </div>
  )
}