'use client'

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

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
      imageUrl: user.imageUrl
    })
  }

  useEffect(() => {
    user && CheckUser()
  }, [user])

  return (
    <div>
      helloo,world
      <Button>click</Button>
      <UserButton></UserButton>
    </div>
  )
}