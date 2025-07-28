
import { Home, Search, Plus, Coins } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { useAuth } from "@/hooks/useAuth"
import { useCredits } from "@/hooks/useCredits"
import { FloatingSignInButton } from "@/components/ui/FloatingSignInButton"
import { Badge } from "@/components/ui/badge"

export function NavBarDemo() {
  const { user } = useAuth();
  const { credits, creditsLoading } = useCredits();

  const leftItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Browse', url: '/browse', icon: Search },
    { name: 'Create', url: '/create-listing', icon: Plus },
  ]

  // Show credits in navbar when user is authenticated
  const rightItems = user && !creditsLoading ? [
    {
      name: `${credits} Credits`,
      url: '/profile',
      icon: Coins,
      badge: credits <= 3 ? 'warning' : undefined
    }
  ] : [];

  return (
    <>
      <NavBar leftItems={leftItems} rightItems={rightItems} />
      <FloatingSignInButton />
    </>
  )
}
