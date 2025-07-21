"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  FileText,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [joinSessionId, setJoinSessionId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateSessionId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleCreateSession = () => {
    setIsCreating(true);
    const sessionId = generateSessionId();

    // Simulate a brief loading state
    setTimeout(() => {
      router.push(`/collaboration/${sessionId}`);
    }, 500);
  };

  const handleJoinSession = () => {
    if (joinSessionId.trim()) {
      router.push(`/collaboration/${joinSessionId.trim()}`);
    }
  };

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Real-time Notes",
      description:
        "Collaborate on shared documents with instant synchronization",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description:
        "Communicate with your collaborators through integrated chat",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Role-based Access",
      description:
        "Distinct roles for teachers and students with appropriate permissions",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Updates",
      description: "See changes and typing indicators in real-time",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Sessions",
      description: "Private collaboration sessions with unique session IDs",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Cross-platform",
      description: "Works seamlessly on desktop and mobile devices",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded-lg p-2">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CollabNotes</h1>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Real-time Collaboration
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Collaborate in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Real-time
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create shared notes and chat with your team instantly. Perfect for
            teachers and students, remote teams, and collaborative learning
            sessions.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Create Session Card */}
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Create New Session</CardTitle>
              <CardDescription>
                Start a new collaboration session and invite others to join
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={handleCreateSession}
                disabled={isCreating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                {isCreating ? "Creating Session..." : "Create Session"}
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                A unique session ID will be generated automatically
              </p>
            </CardContent>
          </Card>

          {/* Join Session Card */}
          <Card className="border-2 border-indigo-200 hover:border-indigo-300 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto bg-indigo-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl">Join Existing Session</CardTitle>
              <CardDescription>
                Enter a session ID to join an ongoing collaboration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
                  value={joinSessionId}
                  onChange={(e) => setJoinSessionId(e.target.value)}
                  placeholder="Enter session ID..."
                  className="mt-1"
                  onKeyPress={(e) => e.key === "Enter" && handleJoinSession()}
                />
              </div>
              <Button
                onClick={handleJoinSession}
                disabled={!joinSessionId.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6"
              >
                Join Session
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-16" />

        {/* Features Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need for collaboration
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make real-time collaboration seamless
            and productive
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="mx-auto bg-gray-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h3>
            <p className="text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2">Create or Join</h4>
              <p className="text-gray-600">
                Create a new session or join an existing one with a session ID
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2">Choose Your Role</h4>
              <p className="text-gray-600">
                Select whether you're a Teacher or Student to get the
                appropriate interface
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2">
                Start Collaborating
              </h4>
              <p className="text-gray-600">
                Begin taking notes together and chatting in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-blue-600 rounded-lg p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                CollabNotes
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Built with Next.js, Socket.IO, and Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
