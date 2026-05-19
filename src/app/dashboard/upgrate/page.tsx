'use client'

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

const plans = [
    {
        name: "Free",
        price: "0$",
        duration: "/month",
        buttonText: "Current Plan",
        features: [
            "5 PDF Upload",
            "Unlimited Notes Taking",
            "Email support",
            "Help center access",
        ],
    },
    {
        name: "Unlimited",
        price: "9.99$",
        duration: "/One Time",
        buttonText: "Get Started",
        features: [
            "Unlimited PDF Upload",
            "Unlimited Notes Taking",
            "Email support",
            "Help center access",
        ],
    },
];

export default function Upgrate() {
    const { user } = useUser()
    const userUpgratePlan = useMutation(api.user.userUpgratePlan)

    const paymentSuccess = async () => {
        await userUpgratePlan({ email: user?.primaryEmailAddress?.emailAddress as string })
    }

    return (
        <div>
            <h2 className='font-medium text-3xl'>Plans</h2>
            <p>upgrate your plans to upload more pdf to take notes</p>
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
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
                            {/* 标题 */}
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {plan.name}
                                </h2>

                                {/* 价格 */}
                                <div className="mt-3 flex items-end justify-center gap-1">
                                    <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                        {plan.price}
                                    </strong>

                                    <span className="text-sm text-gray-500">
                                        {plan.duration}
                                    </span>
                                </div>
                            </div>

                            {/* 功能列表 */}
                            <ul className="mt-6 space-y-3">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature}
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
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* 按钮 */}
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
                                    toast('pay success!')
                                    await paymentSuccess() // 调用升级函数
                                }}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}