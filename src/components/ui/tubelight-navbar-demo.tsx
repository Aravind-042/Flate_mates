
import { Home, User, Briefcase, FileText } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Browse', url: '/browse', icon: User },
    { name: 'Create', url: '/create-listing', icon: Briefcase },
    { name: 'Profile', url: '/profile', icon: FileText }
  ]

  return <NavBar items={navItems} />
}
