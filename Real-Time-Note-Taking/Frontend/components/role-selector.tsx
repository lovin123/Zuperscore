"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RoleSelectorProps {
  onRoleSelect: (name: string, role: "Teacher" | "Student") => void
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [name, setName] = useState("")
  const [selectedRole, setSelectedRole] = useState<"Teacher" | "Student" | null>(null)

  const handleSubmit = () => {
    if (name.trim() && selectedRole) {
      onRoleSelect(name.trim(), selectedRole)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Join Collaboration Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
          </div>

          <div>
            <Label>Select Your Role</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={selectedRole === "Teacher" ? "default" : "outline"}
                onClick={() => setSelectedRole("Teacher")}
                className="flex-1"
              >
                Teacher
              </Button>
              <Button
                variant={selectedRole === "Student" ? "default" : "outline"}
                onClick={() => setSelectedRole("Student")}
                className="flex-1"
              >
                Student
              </Button>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={!name.trim() || !selectedRole} className="w-full">
            Join Session
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
