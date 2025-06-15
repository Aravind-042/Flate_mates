
import { Home, Search, Plus, User, LogIn } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { useAuth } from "@/hooks/useAuth"

export function NavBarDemo() {
  const { user } = useAuth()

  const leftItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Browse', url: '/browse', icon: Search },
    { name: 'Create', url: '/create-listing', icon: Plus },
  ]

  const rightItems = user 
    ? [{ name: 'Profile', url: '/profile', icon: User }]
    : [{ name: 'Sign In', url: '/auth', icon: LogIn }]

  return <NavBar leftItems={leftItems} rightItems={rightItems} />
}
