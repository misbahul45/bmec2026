import { LogOut, LayoutDashboard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../ui/button'

const ToggleUser = () => {
  const navigate = useNavigate()

  const user = {
    name: 'Misbah',
    role: 'ADMIN', 
  }

  const handleGoToDashboard = () => {
    if (user.role === 'ADMIN') {
      navigate({ to: '/dashboard/admin' })
    } else {
      navigate({ to: '/dashboard/team' })
    }
  }

  const toLogout=()=>{
    navigate({
      to:'/auth/login'
    })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleGoToDashboard}>
          <LayoutDashboard size={14} />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/admin' })}>
          Home
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toLogout} variant='destructive' className="text-red-500 gap-2">
          <LogOut size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ToggleUser