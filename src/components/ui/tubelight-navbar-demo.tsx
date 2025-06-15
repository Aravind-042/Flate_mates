
import { Home, Search, Plus, User } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { useAuth } from "@/hooks/useAuth"
import { FloatingSignInButton } from "@/components/ui/FloatingSignInButton"

export function NavBarDemo() {
  const { user } = useAuth()

  const leftItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Browse', url: '/browse', icon: Search },
    { name: 'Create', url: '/create-listing', icon: Plus },
  ]

  // Only show "Profile" for logged in users; if not, don't show anything on right
  const rightItems = user 
    ? [{ name: 'Profile', url: '/profile', icon: User }]
    : []

  return (
    <>
      <NavBar leftItems={leftItems} rightItems={rightItems} />
      {!user && <FloatingSignInButton />}
    </>
  )
}
