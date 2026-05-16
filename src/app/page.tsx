import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      helloo,world
      <Button>click</Button>
      <UserButton></UserButton>
    </div>
  )
}
