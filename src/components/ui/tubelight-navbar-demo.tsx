
import { Home, Search, Plus } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { useAuth } from "@/hooks/useAuth"
import { FloatingSignInButton } from "@/components/ui/FloatingSignInButton"

export function NavBarDemo() {
  // Only ever show leftItems in nav bar, never "Profile"
  const leftItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Browse', url: '/browse', icon: Search },
    { name: 'Create', url: '/create-listing', icon: Plus },
  ]

  // Don't pass any rightItems (Profile now always handled by floating CTA)
  return (
    <>
      <NavBar leftItems={leftItems} />
      <FloatingSignInButton />
    </>
  )
}
