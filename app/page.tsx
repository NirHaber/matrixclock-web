"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  Code2,
  Grid3x3,
  Palette,
  Wifi,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function MatrixPreview() {
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-black/60 px-8 py-10 ring-1 ring-emerald-500/10"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(52 211 153 / 0.15) 1px, transparent 1px)",
        backgroundSize: "10px 10px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
      <p
        className="relative text-center font-mono text-5xl font-medium tracking-[0.2em] text-emerald-400 sm:text-6xl"
        style={{ textShadow: "0 0 24px rgb(52 211 153 / 0.45)" }}
        aria-live="polite"
        aria-label={`Current time ${time}`}
      >
        {time}
      </p>
    </div>
  );
}

const features = [
  {
    icon: Grid3x3,
    title: "Crystal clear",
    description:
      "High-contrast LED pixels keep every digit sharp from across the room.",
  },
  {
    icon: Wifi,
    title: "Always accurate",
    description:
      "Wi-Fi NTP sync keeps the display aligned to the second, automatically.",
  },
  {
    icon: Palette,
    title: "Your style",
    description:
      "Adjust brightness, themes, and animations to match your space.",
  },
];

const highlights = [
  { label: "Display", value: "64 × 32 matrix" },
  { label: "Sync", value: "Wi-Fi NTP" },
  { label: "Firmware", value: "Open source" },
  { label: "Mount", value: "Wall or desk" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="font-mono text-sm font-semibold tracking-wide">
            MatrixClock
          </span>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="#features">Features</a>
            </Button>
            <Button size="sm" asChild>
              <a href="#cta">Get yours</a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <Badge variant="outline" className="w-fit border-emerald-500/30 text-emerald-400">
                LED Matrix Clock
              </Badge>
              <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Time, rendered in light.
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground">
                MatrixClock turns every minute into a crisp dot-matrix display —
                precise, readable, and built for desks, shelves, and walls.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#cta">Pre-order</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#features">See features</a>
                </Button>
              </div>
            </div>
            <MatrixPreview />
          </div>
        </section>

        <Separator />

        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Built for clarity
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Simple hardware, thoughtful software, and a display that stays
              legible day and night.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="size-5 text-emerald-400" aria-hidden />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <Card key={item.label} size="sm">
                <CardHeader>
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="font-mono text-base">{item.value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        <section id="cta" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                Ready to light up your space?
              </CardTitle>
              <CardDescription className="text-base">
                Join the waitlist for the first production run of MatrixClock.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <a href="#">Pre-order now</a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-auto border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" aria-hidden />
            <span>© 2026 MatrixClock</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <a href="#">
                <Code2 className="size-4" />
                GitHub
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#">Docs</a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
