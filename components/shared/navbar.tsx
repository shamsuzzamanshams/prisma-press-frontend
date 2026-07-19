"use client"

import Link from "next/link"
import {
	LayoutDashboard,
	Package,
	BarChart3,
	Users,
	User,
	Settings,
	CreditCard,
	LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
	{ title: "Dashboard", href: "/", icon: LayoutDashboard },
	{ title: "Products", href: "/products", icon: Package },
	{ title: "Analytics", href: "/analytics", icon: BarChart3 },
	{ title: "Customers", href: "/customers", icon: Users },
]

const userMenuItems = [
	{ title: "Profile", href: "/profile", icon: User },
	{ title: "Billing", href: "/billing", icon: CreditCard },
	{ title: "Settings", href: "/settings", icon: Settings },
]

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background">
			<div className="container mx-auto grid h-16 grid-cols-3 items-center px-4">
				{/* Left - Avatar */}
				<div className="flex justify-start">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="relative h-10 w-10 rounded-full p-0"
							>
								<Avatar className="h-10 w-10">
									<AvatarImage
										src="/diverse-avatars.png"
										alt="User avatar"
									/>
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="start" className="w-56">
							<DropdownMenuLabel>
								<div className="flex flex-col">
									<span className="font-medium">Jane Doe</span>
									<span className="text-xs text-muted-foreground">
										jane@acme.com
									</span>
								</div>
							</DropdownMenuLabel>

							<DropdownMenuSeparator />

							<DropdownMenuGroup>
								{userMenuItems.map((item) => (
									<DropdownMenuItem key={item.href} asChild>
										<Link href={item.href} className="flex items-center w-full">
											<item.icon className="mr-2 h-4 w-4" />
											{item.title}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>

							<DropdownMenuSeparator />

							<DropdownMenuItem>
								<LogOut className="mr-2 h-4 w-4 text-red-500" />
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Center - Navigation */}
				<nav className="hidden md:flex justify-center gap-2">
					{navItems.map((item) => (
						<Button
							key={item.href}
							variant="ghost"
							size="sm"
							asChild
						>
							<Link href={item.href} className="flex items-center">
								<item.icon className="mr-2 h-4 w-4" />
								{item.title}
							</Link>
						</Button>
					))}
				</nav>

				{/* Right - Logo */}
				<div className="flex justify-end">
					<Link href="/" className="flex items-center gap-2">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Package className="h-5 w-5" />
						</div>
						<span className="text-xl font-bold">Next JS</span>
					</Link>
				</div>
			</div>
		</header>
	)
}