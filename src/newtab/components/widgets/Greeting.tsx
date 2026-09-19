import {useEffect, useState} from 'react'

interface GreetingProps {
  name?: string
}

function getGreetingText(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return 'Good morning'
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon'
  } else if (hour >= 17 && hour < 22) {
    return 'Good evening'
  } else {
    return 'Good night'
  }
}

export default function Greeting({name}: GreetingProps) {
  const [greeting, setGreeting] = useState(getGreetingText)

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreetingText())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const trimmedName = name?.trim()

  return (
    <div className="greeting">
      {greeting}
      {trimmedName ? `, ${trimmedName}` : ''}
    </div>
  )
}

