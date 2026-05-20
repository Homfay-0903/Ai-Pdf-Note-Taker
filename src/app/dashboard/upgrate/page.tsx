'use client'

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function Upgrate() {
    const { user } = useUser()
    const userUpgratePlan = useMutation(api.user.userUpgratePlan)
    const t = useTranslations('dashboard.plans')

    const plans = [
        {
            key: 'free' as const,
            price: "0$",
        },
        {
            key: 'unlimited' as const,
            price: "9.99$",
        },
    ];

    const paymentSuccess = async () => {
        await userUpgratePlan({ email: user?.primaryEmailAddress?.emailAddress as string })
    }

    const featureKeys = ['pdfUpload', 'notes', 'email', 'help'] as const

    return (
        <div>
            <h2 className='font-medium text-3xl'>{t('title')}</h2>
            <p>{t('subtitle')}</p>
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.key}
                            className="
                              rounded-2xl
                              border border-gray-200
                              bg-white
                              p-6
                              shadow-xs
                              sm:px-8
                              lg:p-12
                            "
                        >
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {t(`${plan.key}.name`)}
                                </h2>

                                <div className="mt-3 flex items-end justify-center gap-1">
                                    <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                        {plan.price}
                                    </strong>

                                    <span className="text-sm text-gray-500">
                                        {t(`${plan.key}.duration`)}
                                    </span>
                                </div>
                            </div>

                            <ul className="mt-6 space-y-3">
                                {featureKeys.map((featureKey) => (
                                    <li
                                        key={featureKey}
                                        className="flex items-center gap-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.8"
                                            stroke="currentColor"
                                            className="h-5 w-5 text-gray-500"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>

                                        <span className="text-sm text-gray-700">
                                            {t(`${plan.key}.features.${featureKey}`)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="
                                  mt-8
                                  w-full
                                  rounded-full
                                  border border-indigo-400
                                  bg-white
                                  px-6 py-3
                                  text-sm font-medium
                                  text-indigo-500
                                  transition
                                  hover:bg-indigo-50
                                "
                                onClick={async () => {
                                    toast(t('paySuccess'))
                                    await paymentSuccess()
                                }}
                            >
                                {t(`${plan.key}.button`)}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
