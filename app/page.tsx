"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Code2, Grid3x3, Palette, ShieldCheck, Wifi } from "lucide-react";

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

const LARGE_FONT: Record<string, string[]> = {
  "0": ["11111", "10001", "10011", "10101", "11001", "10001", "11111"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "11111"],
  "2": ["11111", "00001", "00001", "11111", "10000", "10000", "11111"],
  "3": ["11111", "00001", "00001", "11111", "00001", "00001", "11111"],
  "4": ["10001", "10001", "10001", "11111", "00001", "00001", "00001"],
  "5": ["11111", "10000", "10000", "11111", "00001", "00001", "11111"],
  "6": ["11111", "10000", "10000", "11111", "10001", "10001", "11111"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["11111", "10001", "10001", "11111", "10001", "10001", "11111"],
  "9": ["11111", "10001", "10001", "11111", "00001", "00001", "11111"],
  ":": ["0", "1", "0", "0", "0", "1", "0"],
};

const MEDIUM_FONT: Record<string, string[]> = {
  "0": ["1111", "1001", "1001", "1001", "1111"],
  "1": ["0010", "0110", "0010", "0010", "0111"],
  "2": ["1111", "0001", "1111", "1000", "1111"],
  "3": ["1111", "0001", "1111", "0001", "1111"],
  "4": ["1001", "1001", "1111", "0001", "0001"],
  "5": ["1111", "1000", "1111", "0001", "1111"],
  "6": ["1111", "1000", "1111", "1001", "1111"],
  "7": ["1111", "0001", "0010", "0100", "0100"],
  "8": ["1111", "1001", "1111", "1001", "1111"],
  "9": ["1111", "1001", "1111", "0001", "1111"],
};

const SMALL_FONT: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "001", "001", "001"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  ".": ["0", "0", "0", "0", "1"],
  "/": ["001", "001", "010", "100", "100"],
  "°": ["11", "11", "00", "00", "00"],
  "%": ["101", "001", "010", "100", "101"],
};

const pixelColors = {
  time:
    "bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)]",

  stacked:
    "bg-purple-300 shadow-[0_0_10px_rgba(216,180,254,0.9)]",

  classicDate:
    "bg-orange-200 shadow-[0_0_10px_rgba(254,215,170,0.85)]",

  slideDemo:
    "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]",

  slideDemoSeconds:
    "bg-cyan-200 shadow-[0_0_10px_rgba(165,243,252,0.85)]",

  temperature:
    "bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.8)]",

  humidity:
    "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]",
};

type PixelColorKey =
  | "time"
  | "stacked"
  | "classicDate"
  | "slideDemo"
  | "slideDemoSeconds"
  | "temperature"
  | "humidity";

type DrawCharFn = (
  font: Record<string, string[]>,
  char: string,
  startX: number,
  startY: number,
  color: PixelColorKey
) => void;

const drawMainLayoutToGrid = (
  drawChar: DrawCharFn,
  time: string,
  temperature: string,
  humidity: string
) => {
  let timeX = 3;
  const timeY = 1;

  time.split("").forEach((char) => {
    drawChar(LARGE_FONT, char, timeX, timeY, "time");
    timeX += char === ":" ? 2 : 6;
  });

  let tempX = 0;
  const envY = 10;
  const tempText = `${temperature}°`;

  tempText.split("").forEach((char) => {
    drawChar(SMALL_FONT, char, tempX, envY, "temperature");
    tempX += char === "." ? 2 : char === "°" ? 3 : 4;
  });

  let humidityX = 20;
  const humidityText = `${humidity}%`;

  humidityText.split("").forEach((char) => {
    drawChar(SMALL_FONT, char, humidityX, envY, "humidity");
    humidityX += 4;
  });
};

const drawClassicLayoutToGrid = (drawChar: DrawCharFn) => {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  const timeText = `${hours}:${minutes}`;
  const dateText = `${day}/${month}`;

  const timeY = 1;
  const dateY = 10;

  let timeX = 3;
  timeText.split("").forEach((char) => {
    drawChar(LARGE_FONT, char, timeX, timeY, "stacked");
    timeX += char === ":" ? 2 : 6;
  });

  let dateX = 7;
  dateText.split("").forEach((char) => {
    drawChar(SMALL_FONT, char, dateX, dateY, "classicDate");
    dateX += 4;
  });
};

function MatrixPreview({
  layout,
  time,
  colonVisible,
  temperature,
  humidity,
}: {
  layout: string;
  time: string;
  colonVisible: boolean;
  temperature: string;
  humidity: string;
}) {
  const pixels = useMemo(() => {
    const width = 32;
    const height = 16;

    const grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ({
        active: false,
        color: "time" as keyof typeof pixelColors,
      }))
    );

    const drawChar = (
      font: Record<string, string[]>,
      char: string,
      startX: number,
      startY: number,
      color: keyof typeof pixelColors
    ) => {
      if (char === ":" && !colonVisible) {
        return;
      }

      const pattern = font[char];

      if (!pattern) {
        return;
      }

      pattern.forEach((line, y) => {
        line.split("").forEach((value, x) => {
          const px = startX + x;
          const py = startY + y;

          if (value === "1" && px >= 0 && px < width && py >= 0 && py < height) {
            grid[py][px] = { active: true, color };
          }
        });
      });
    };

    const drawMainLayout = () => {
      drawMainLayoutToGrid(drawChar, time, temperature, humidity);
    };

    const drawClassicLayout = () => {
      drawClassicLayoutToGrid(drawChar);
    };

    if (layout === "DIGIT_SWAP") {
      const now = new Date();
      const secondsNumber = now.getSeconds();

      const showMainLayout = secondsNumber >= 55 || secondsNumber <= 4;

      if (showMainLayout) {
        drawMainLayout();
      } else {
        drawClassicLayout();
      }
    }
    else if (layout === "CLASSIC") {
      drawClassicLayout();
    }
    else if (layout === "SLIDE_DEMO") {
      const now = new Date();

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      const timeText = `${hours}:${minutes}`;

      const timeY = 1;
      const secondsY = 10;

      let timeX = 3;
      timeText.split("").forEach((char) => {
        drawChar(LARGE_FONT, char, timeX, timeY, "slideDemo");
        timeX += char === ":" ? 2 : 6;
      });

      let secondsX = 11;
      seconds.split("").forEach((char) => {
        drawChar(MEDIUM_FONT, char, secondsX, secondsY, "slideDemoSeconds");
        secondsX += 5;
      });
    }
    else if (layout === "STACKED") {
      const now = new Date();

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      const hoursMinutes = `${hours}:${minutes}`;

      const timeY = 3;
      const secondsY = 5;

      const [displayHours, displayMinutes] = hoursMinutes.split(":");

      let hoursX = 1;
      displayHours.split("").forEach((char) => {
        drawChar(LARGE_FONT, char, hoursX, timeY, "stacked");
        hoursX += 6;
      });

      drawChar(LARGE_FONT, ":", 12, timeY, "stacked");

      let minutesX = 13;
      displayMinutes.split("").forEach((char) => {
        drawChar(LARGE_FONT, char, minutesX, timeY, "stacked");
        minutesX += 6;
      });

      let secondsX = 25;
      seconds.split("").forEach((char) => {
        drawChar(SMALL_FONT, char, secondsX, secondsY, "stacked");
        secondsX += 4;
      });
    } else {
      drawMainLayout();
    }

    return grid.flat();
  }, [time, colonVisible, temperature, humidity, layout]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-black p-4 shadow-2xl shadow-emerald-500/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative rounded-2xl border border-emerald-400/20 bg-zinc-950/90 p-5">
        <div className="mb-5 flex items-center justify-between text-xs text-emerald-300/70">
          <span className="font-mono">MATRIX DISPLAY</span>
          <span className="font-mono">LIVE NTP</span>
        </div>

        <div className="grid grid-cols-32 gap-1">
          {pixels.map((pixel, index) => (
            <span
              key={index}
              className={
                pixel.active
                  ? `size-1.5 rounded-full ${pixelColors[pixel.color]}`
                  : "size-1.5 rounded-full bg-emerald-950/70"
              }
            />
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-emerald-400/20 bg-black/80 px-6 py-6 text-center">
          <p
            className="font-mono text-5xl font-semibold tracking-[0.25em] text-emerald-300 sm:text-6xl"
            style={{ textShadow: "0 0 28px rgb(52 211 153 / 0.65)" }}
            aria-live="polite"
            aria-label={`Current time ${time}`}
          >
            {time}
          </p>
        </div>
      </div>
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
  { label: "Display", value: "32 × 16 LED matrix" },
  { label: "Controller", value: "ESP32-C3" },
  { label: "Sync", value: "Wi-Fi NTP" },
  { label: "Firmware", value: "Open source" },
];

const layouts = [
  {
    name: "MAIN",
    description: "Large primary clock with clear HH:MM display.",
  },
  {
    name: "CLASSIC",
    description: "Classic digital clock layout with strong readability.",
  },
  {
    name: "STACKED",
    description: "Compact stacked time layout for small spaces.",
  },
  {
    name: "DIGIT_SWAP",
    description: "Animated digit swap mode with colorful transitions.",
  },
  {
    name: "SLIDE_DEMO",
    description: "Slide animation demo layout for smooth motion.",
  },
];

function LayoutPreview({
  name,
  time,
  temperature,
  humidity,
}: {
  name: string;
  time: string;
  temperature: string;
  humidity: string;
}) {
  const width = 32;
  const height = 16;

  const font: Record<string, string[]> = {
    "0": ["111", "101", "101", "101", "111"],
    "1": ["010", "110", "010", "010", "111"],
    "2": ["111", "001", "111", "100", "111"],
    "3": ["111", "001", "111", "001", "111"],
    "4": ["101", "101", "111", "001", "001"],
    "5": ["111", "100", "111", "001", "111"],
    "6": ["111", "100", "111", "101", "111"],
    "7": ["111", "001", "001", "001", "001"],
    "8": ["111", "101", "111", "101", "111"],
    "9": ["111", "101", "111", "001", "111"],
    ":": ["0", "1", "0", "1", "0"],
    "/": ["001", "001", "010", "100", "100"],
    "|": ["1", "1", "1", "1", "1"],
  };

  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      active: false,
      color: "time" as PixelColorKey,
    }))
  );

  const drawPreviewChar: DrawCharFn = (
    sourceFont,
    char,
    startX,
    startY,
    color
  ) => {
    const pattern = sourceFont[char];

    if (!pattern) {
      return;
    }

    pattern.forEach((line, y) => {
      line.split("").forEach((value, x) => {
        const targetX = startX + x;
        const targetY = startY + y;

        if (
          value === "1" &&
          targetX >= 0 &&
          targetX < width &&
          targetY >= 0 &&
          targetY < height
        ) {
          grid[targetY][targetX] = {
            active: true,
            color,
          };
        }
      });
    });
  };

  const drawText = (text: string, startX: number, startY: number) => {
    let x = startX;

    text.split("").forEach((char) => {
      const pattern = font[char];

      if (!pattern) {
        x += 2;
        return;
      }

      pattern.forEach((line, y) => {
        line.split("").forEach((value, px) => {
          const targetX = x + px;
          const targetY = startY + y;

          if (
            value === "1" &&
            targetX >= 0 &&
            targetX < width &&
            targetY >= 0 &&
            targetY < height
          ) {
            grid[targetY][targetX] = {
              active: true,
              color: "time",
            };
          }
        });
      });

      x += char === ":" || char === "|" ? 2 : 4;
    });
  };

  if (name === "MAIN") {
    drawMainLayoutToGrid(drawPreviewChar, time, temperature, humidity);
  }

  if (name === "CLASSIC") {
    drawClassicLayoutToGrid(drawPreviewChar);
  }

  if (name === "STACKED") {
    drawText("19", 4, 0);
    drawText("45", 4, 3);
  }

  if (name === "DIGIT_SWAP") {
    drawText("19:4|", 0, 1);
  }

  if (name === "SLIDE_DEMO") {
    drawText("19:44", -1, 0);
    drawText("19:45", 1, 3);
  }

  const pixels = grid.flat();

  return (
    <div className="rounded-xl border border-emerald-400/10 bg-black p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-emerald-300/70">
        <span>{name}</span>
        <span>PREVIEW</span>
      </div>

      <div className="grid grid-cols-32 gap-0.5">
        {pixels.map((pixel, index) => (
          <span
            key={index}
            className={
              pixel.active
                ? `size-1 rounded-full ${pixelColors[pixel.color]}`
                : "size-1 rounded-full bg-emerald-950/70"
            }
          />
        ))}
      </div>
    </div>
  );
}
export default function Home() {
  const layoutNames = layouts.map((layout) => layout.name);
  const [selectedLayout, setSelectedLayout] = useState(layoutNames[0]);
  const [time, setTime] = useState("00:00");
  const [colonVisible, setColonVisible] = useState(true);
  const [temperature, setTemperature] = useState("23.4");
  const [humidity, setHumidity] = useState("58");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      setColonVisible(now.getSeconds() % 2 === 0);

      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    const updateEnvironment = () => {
      const nextTemperature = (20 + Math.random() * 10).toFixed(1);
      const nextHumidity = Math.round(40 + Math.random() * 30).toString();

      setTemperature(nextTemperature);
      setHumidity(nextHumidity);
    };

    update();
    updateEnvironment();

    const clockId = setInterval(update, 1000);
    const environmentId = setInterval(updateEnvironment, 10000);

    return () => {
      clearInterval(clockId);
      clearInterval(environmentId);
    };
  }, []);

  const selectedLayoutIndex = layoutNames.indexOf(selectedLayout);

  const goToPreviousLayout = () => {
    const previousIndex =
      selectedLayoutIndex === 0 ? layoutNames.length - 1 : selectedLayoutIndex - 1;

    setSelectedLayout(layoutNames[previousIndex]);
  };

  const goToNextLayout = () => {
    const nextIndex =
      selectedLayoutIndex === layoutNames.length - 1 ? 0 : selectedLayoutIndex + 1;

    setSelectedLayout(layoutNames[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <header className="sticky top-0 z-50 border-b border-emerald-400/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="font-mono text-sm font-semibold tracking-[0.3em] text-emerald-300">
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

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.28),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.18),transparent_35%)]" />
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-7">
              <Badge
                variant="outline"
                className="w-fit border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              >
                LED Matrix Clock
              </Badge>

              <div className="space-y-5">
                <h1 className="max-w-2xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                  Time, rendered in{" "}
                  <span className="text-emerald-300">light.</span>
                </h1>

                <p className="max-w-xl text-lg leading-8 text-zinc-300">
                  MatrixClock turns every minute into a crisp dot-matrix display —
                  precise, readable, open, and built for desks, shelves, and walls.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#cta">Pre-order</a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-emerald-400/30 bg-black/20 text-zinc-50 hover:bg-emerald-400/10"
                  asChild
                >
                  <a href="#features">See features</a>
                </Button>
              </div>

              <div className="grid max-w-xl grid-cols-3 gap-3 pt-4">
                <div className="rounded-xl border border-emerald-400/10 bg-white/5 p-3">
                  <p className="font-mono text-sm text-emerald-300">32×16</p>
                  <p className="text-xs text-zinc-400">LED matrix</p>
                </div>
                <div className="rounded-xl border border-emerald-400/10 bg-white/5 p-3">
                  <p className="font-mono text-sm text-emerald-300">NTP</p>
                  <p className="text-xs text-zinc-400">Wi-Fi sync</p>
                </div>
                <div className="rounded-xl border border-emerald-400/10 bg-white/5 p-3">
                  <p className="font-mono text-sm text-emerald-300">Open</p>
                  <p className="text-xs text-zinc-400">Firmware</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-2xl border border-emerald-400/10 bg-zinc-950/70 px-4 py-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-emerald-400/30 bg-black/20 text-zinc-50 hover:bg-emerald-400/10"
                  onClick={goToPreviousLayout}
                >
                  ←
                </Button>

                <div className="text-center">
                  <p className="font-mono text-xs text-zinc-500">ACTIVE LAYOUT</p>
                  <p className="font-mono text-sm font-semibold tracking-[0.2em] text-emerald-300">
                    {selectedLayout}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-emerald-400/30 bg-black/20 text-zinc-50 hover:bg-emerald-400/10"
                  onClick={goToNextLayout}
                >
                  →
                </Button>
              </div>

              <MatrixPreview
                layout={selectedLayout}
                time={time}
                colonVisible={colonVisible}
                temperature={temperature}
                humidity={humidity}
              />
            </div>
          </div>
        </section>

        <Separator className="bg-emerald-400/10" />

        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 flex flex-col gap-2">
            <Badge
              variant="outline"
              className="w-fit border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
            >
              Built for clarity
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple hardware. Thoughtful software.
            </h2>
            <p className="max-w-2xl text-zinc-400">
              A display that stays legible day and night, with a software stack
              designed for customization.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-emerald-400/10 bg-zinc-950 text-zinc-50"
              >
                <CardHeader>
                  <feature.icon className="size-5 text-emerald-300" aria-hidden />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mb-10 flex flex-col gap-2">
            <Badge
              variant="outline"
              className="w-fit border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
            >
              Layout showcase
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Five display modes. One MatrixClock.
            </h2>
            <p className="max-w-2xl text-zinc-400">
              Preview the built-in layouts designed for readability, animation, and customization.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {layouts.map((layout) => (
              <Card
                key={layout.name}
                className="border-emerald-400/10 bg-zinc-950 text-zinc-50"
              >
                <CardHeader>
                  <LayoutPreview
                    name={layout.name}
                    time={time}
                    temperature={temperature}
                    humidity={humidity}
                  />
                  <CardTitle className="font-mono text-base text-emerald-300">
                    {layout.name}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    {layout.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <Card
                key={item.label}
                className="border-emerald-400/10 bg-zinc-950 text-zinc-50"
              >
                <CardHeader>
                  <CardDescription className="text-zinc-500">
                    {item.label}
                  </CardDescription>
                  <CardTitle className="font-mono text-base text-emerald-300">
                    {item.value}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Card className="overflow-hidden border-emerald-400/20 bg-zinc-950 text-zinc-50">
            <div className="bg-[linear-gradient(to_right,rgba(16,185,129,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.18)_1px,transparent_1px)] bg-[size:32px_32px]">
              <CardHeader className="bg-black/70">
                <div className="mb-2 flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="size-5" />
                  <span className="font-mono text-sm">FIRST RUN</span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl">
                  Ready to light up your space?
                </CardTitle>
                <CardDescription className="max-w-xl text-base text-zinc-400">
                  Join the waitlist for the first production run of MatrixClock.
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-black/70">
                <Button size="lg" asChild>
                  <a href="#">Pre-order now</a>
                </Button>
              </CardContent>
            </div>
          </Card>
        </section>
      </main>

      <footer className="mt-auto border-t border-emerald-400/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
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