import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { IconType } from "react-icons";
import {
  FiCloudLightning,
  FiEye,
  FiGlobe,
  FiSmile,
  FiWifiOff,
} from "react-icons/fi";

const features: Array<{
  icon: IconType;
  title: string;
  description: string;
}> = [
  {
    icon: FiGlobe,
    title: "Free and Open Source",
    description:
      "Sharing is caring, writedown is completely free and open source and licensed under AGPLv3.",
  },
  {
    icon: FiCloudLightning,
    title: "Synced on all your devices",
    description:
      "All your notes are synced on all your devices. You can access them from anywhere.",
  },
  {
    icon: FiWifiOff,
    title: "Offline Support",
    description: "Write and save notes even when you are away from the internet!",
  },
  {
    icon: FiEye,
    title: "Live Markdown",
    description:
      "Writedown supports Markdown. You can write markdown and preview it in real-time.",
  },
  {
    icon: FiSmile,
    title: "Easy to Use",
    description:
      "Writedown is easy to use with a beautiful interface. Get started in just 5 seconds!",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 xl:grid-cols-5">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="h-full border border-border/40 bg-background/70 backdrop-blur"
            >
              <CardContent className="flex h-full flex-col gap-4 pt-6">
                <span className="flex size-12 items-center justify-center rounded-full border border-border/60 bg-muted/60">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
