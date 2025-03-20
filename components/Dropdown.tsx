'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface DropdownItem {
  href: string
  icon?: React.ReactNode
  label: string
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  width?: string
}

export default function Dropdown({ trigger, items, align = 'left', width = 'w-48' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <div className={`absolute z-50 mt-2 ${width} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 
        transition-all duration-300 ease-in-out transform origin-top 
        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} 
        ${align === 'left' ? 'left-0' : 'right-0'}`}>
        <div className="py-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex flex-row items-center">
                {item.icon && (
                  <div className="mr-2 w-9 h-9 flex items-center justify-center">
                    {item.icon}
                  </div>
                )}
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 