
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  leftItems: NavItem[]
  rightItems?: NavItem[]
  className?: string
}

export function NavBar({ leftItems, rightItems = [], className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  const allItems = [...leftItems, ...rightItems]

  useEffect(() => {
    const currentItem = allItems.find(item => item.url === location.pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    } else {
      setActiveTab(leftItems[0]?.name || "")
    }
  }, [location.pathname, allItems, leftItems])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon
      const isActive = activeTab === item.name

      return (
        <Link
          key={item.name}
          to={item.url}
          onClick={() => setActiveTab(item.name)}
          className={cn(
            "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300",
            "text-slate-700 hover:text-slate-900",
            isActive && "bg-gradient-to-r from-coral-500 to-violet-600 text-white shadow-lg border border-white/20 hover:text-white",
          )}
        >
          <span className="hidden md:inline">{item.name}</span>
          <span className="md:hidden">
            <Icon size={18} strokeWidth={2.5} />
          </span>
          {isActive && (
            <motion.div
              layoutId="lamp"
              className="absolute inset-0 w-full bg-gradient-to-r from-coral-400/10 to-violet-500/10 rounded-full -z-10"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-coral-400 to-violet-500 rounded-t-full">
                <div className="absolute w-12 h-6 bg-coral-400/30 rounded-full blur-md -top-2 -left-2" />
                <div className="absolute w-8 h-6 bg-violet-500/30 rounded-full blur-md -top-1" />
                <div className="absolute w-4 h-4 bg-coral-400/20 rounded-full blur-sm top-0 left-2" />
              </div>
            </motion.div>
          )}
        </Link>
      )
    })
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6 pointer-events-none",
        className,
      )}
    >
      <div className="flex items-center justify-between bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg min-w-fit pointer-events-auto">
        <div className="flex items-center gap-3">
          {renderNavItems(leftItems)}
        </div>
        {rightItems.length > 0 && (
          <div className="flex items-center gap-3 ml-8">
            {renderNavItems(rightItems)}
          </div>
        )}
      </div>
    </div>
  )
}

