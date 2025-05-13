"use client";
import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const {isSignedIn} = useUser();
  useGSAP(() => {
    gsap.fromTo(
      "#hero-text",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: "power1.inOut",
        duration: 1,
        delay: 0.5,
      }
    );

    gsap.fromTo(
      "#hero-image",
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        ease: "power1.inOut",
        duration: 1,
        delay: 0,
      }
    );
  });

  return (
    <div className="bg-gray-950 pt-16">
      <section className="py-8" id="hero-section">
        <div className="pb-16 pt-8">
          <div
            className="text-white flex items-center justify-center flex-col gap-8"
            id="hero-text"
          >
            <h3 className="text-md font-semibold">Welcome to</h3>
            <h1 className="text-8xl relative font-semibold before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[4px] before:bg-white cursor-pointer before:w-0 before:transition-all before:duration-500 hover:before:w-full">
              Uptime Monitor
            </h1>
            <h3 className="text-md font-semibold">
              Powered by Thousands of nodes.
            </h3>
            <SignedOut>
          <Button variant="default" className="button">
            <SignUpButton>
              <span className="cursor-pointer">Get Started</span>
            </SignUpButton>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button variant="default" className="cursor-pointer" onClick={()=> router.push("/dashboard")}>
            Go To Dashboard
          </Button>
        </SignedIn>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="./dashboard.png"
            alt="dashboard"
            className="h-1/3 w-3/4 rounded-xl mt-2 shadow-[0_0_30px_rgba(59,130,246,0.7)]"
            id="hero-image"
          />
        </div>
      </section>

      <section id="features" className="pt-16">
        <div>
          <div className="text-white flex items-center justify-center mb-12">
            <h2 className="mb-4 font-secondary text-3xl font-bold text-white dark:text-white md:text-4xl  relative cursor-pointer before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-current before:transition-all before:duration-500 hover:before:w-full">
              Features
            </h2>
          </div>
          <div className="flex items-center justify-center gap-8">
            <Card className="w-1/3 bg-black rounded-sm border-2 border-gray-200 hover:border-blue-500 transition-transform duration-300 ease-out hover:-translate-y-2">
              <CardTitle className="flex items-center justify-center text-blue-500 text-xl font-semibold">
                Performance & Trust
              </CardTitle>
              <CardDescription className="flex items-center justify-center text-md text-gray-200">
                Earn Customer Trust with Zero Downtime.
              </CardDescription>
              <CardContent className="flex items-center justify-center">
                <img
                  src="./get-started.png"
                  alt="dashboard"
                  className="w-3/4 rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="w-1/3 bg-black rounded-sm border-2 border-gray-200 hover:border-blue-500 transition-transform duration-300 ease-out hover:-translate-y-2">
              <CardTitle className="flex items-center justify-center text-blue-500 text-xl font-semibold">
                Performance & Trust
              </CardTitle>
              <CardDescription className="flex items-center justify-center text-md text-gray-200">
                Earn Customer Trust with Zero Downtime.
              </CardDescription>
              <CardContent className="flex items-center justify-center">
                <img
                  src="./get-started.png"
                  alt="dashboard"
                  className="w-3/4 rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-2 py-8 md:py-24" id="how-to">
        <div className="mx-auto max-w-7xl">
          <div
            className="my-12 text-center md:my-16"
            // style="opacity: 1; transform: none;"
          >
            <div className="text-white flex items-center justify-center mb-12">
            <h2 className="mb-4 font-secondary text-3xl font-bold text-white dark:text-white md:text-4xl  relative cursor-pointer before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-current before:transition-all before:duration-500 hover:before:w-full">
              How it Works
            </h2>
          </div>
            <p className="mx-auto max-w-2xl text-neutral-500 dark:text-gray-400">
              See how easy it is to start monitoring and get instant alerts.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-4 h-full w-0.5 bg-gradient-to-b from-accent/50 via-primary to-accent/50 md:left-1/2"></div>
            <div className="relative space-y-8 md:space-y-12">
              <div
                className="relative flex items-center md:flex-row flex-row"
                // style="opacity: 1; transform: none;"
              >
                <div className="absolute left-4 z-10 -translate-x-1/2 transform md:left-1/2 hover:bg-blue-500">
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  <div className="absolute left-0 top-0 h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-20"></div>
                </div>
                <div className="ml-12 md:ml-0 md:mr-auto md:w-[calc(50%-2rem)] md:pr-16 w-[calc(100%-3rem)]">
                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-white/50 hover:bg-blue-500 to-gray-50/30 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 dark:border-gray-800 dark:from-gray-900/50 dark:to-black/30">
                    <div className="absolute top-0 left-0 h-20 w-20 rounded-full bg-blue-500 blur-xl opacity-0 transition-opacity duration-500 hover:opacity-100"></div>
                    <div className="absolute bottom-0 right-0 h-20 w-20 rounded-full bg-blue-500 blur-xl opacity-0 transition-opacity duration-500 hover:opacity-100"></div>
                    <div className="relative mb-4 flex items-start gap-4 text-gray-900 dark:text-white hover:text-white">
                      <div className="relative h-16 w-16 shrink-0">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600/50 opacity-10 dark:from-blue-500 dark:to-blue-700/50 dark:opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-user-plus h-8 w-8 text-blue-600"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="19" x2="19" y1="8" y2="14"></line>
                            <line x1="22" x2="16" y1="11" y2="11"></line>
                          </svg>
                        </div>
                        <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                          <span className="font-secondary text-base font-bold text-white">
                            1
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-secondary text-xl font-semibold text-black dark:text-white/90">
                          Sign Up and Access Dashboard
                        </h3>
                        <p className="mt-2 text-gray-900">
                          Create an account to get started and access your
                          personalized dashboard.
                        </p>
                      </div>
                    </div>
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl dark:bg-blue-500/10"></div>
                    <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl dark:bg-blue-700/5"></div>
                  </div>
                </div>
              </div>
              <div
                className="relative flex items-center md:flex-row-reverse flex-row"
                // style="opacity: 1; transform: none;"
              >
                <div className="absolute left-4 z-10 -translate-x-1/2 transform md:left-1/2">
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  <div className="absolute left-0 top-0 h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-20"></div>
                </div>
                <div className="ml-12 md:ml-auto md:w-[calc(50%-2rem)] md:pl-16 w-[calc(100%-3rem)]">
                  <div className="relative overflow-hidden hover:bg-blue-500 rounded-xl border bg-gradient-to-br from-white/50 to-gray-50/30 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 dark:border-gray-800 dark:from-gray-900/50 dark:to-black/30">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 dark:from-blue-500/10"
                      // style="opacity: 0;"
                    ></div>
                    <div className="relative mb-4 flex items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600/50 opacity-10 dark:from-blue-500 dark:to-blue-700/50 dark:opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-clipboard-check h-8 w-8 text-blue-600"
                          >
                            <rect
                              width="8"
                              height="4"
                              x="8"
                              y="2"
                              rx="1"
                              ry="1"
                            ></rect>
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <path d="m9 14 2 2 4-4"></path>
                          </svg>
                        </div>
                        <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                          <span className="font-secondary text-base font-bold text-white">
                            2
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-secondary text-xl font-semibold text-black dark:text-white/90">
                          Add the website you want to monitor
                        </h3>
                        <p className="mt-2 text-gray-900">
                          Just add the website and sit back and see how we keep
                          you updated of your website's status.
                        </p>
                      </div>
                    </div>
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl dark:bg-blue-500/10"></div>
                    <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl dark:bg-blue-700/5"></div>
                  </div>
                </div>
              </div>
              <div
                className="relative flex items-center md:flex-row flex-row"
                // style="opacity: 1; transform: none;"
              >
                <div className="absolute left-4 z-10 -translate-x-1/2 transform md:left-1/2">
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  <div className="absolute left-0 top-0 h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-20"></div>
                </div>
                <div className="ml-12 md:ml-0 md:mr-auto md:w-[calc(50%-2rem)] md:pr-16 w-[calc(100%-3rem)]">
                  <div className="relative overflow-hidden hover:bg-blue-500 rounded-xl border bg-gradient-to-br from-white/50 to-gray-50/30 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 dark:border-gray-800 dark:from-gray-900/50 dark:to-black/30">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 dark:from-blue-500/10"
                      // style="opacity:0"
                    ></div>
                    <div className="relative mb-4 flex items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600/50 opacity-10 dark:from-blue-500 dark:to-blue-700/50 dark:opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-database h-8 w-8 text-blue-600"
                          >
                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                            <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                            <path d="M3 12A9 3 0 0 0 21 12"></path>
                          </svg>
                        </div>
                        <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                          <span className="font-secondary text-base font-bold text-white">
                            3
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-secondary text-xl font-semibold text-black dark:text-white/90">
                          Our Nodes
                        </h3>
                        <p className="mt-2 text-gray-900">
                          Our decentralised network collects data about tyour
                          website from different locations and summarises it all
                          up in one place for a clear understanding of your
                          website.
                        </p>
                      </div>
                    </div>
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl dark:bg-blue-500/10"></div>
                    <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl dark:bg-blue-700/5"></div>
                  </div>
                </div>
              </div>
              <div
                className="relative flex items-center md:flex-row-reverse flex-row"
                // style="opacity: 1; transform: none;"
              >
                <div className="absolute left-4 z-10 -translate-x-1/2 transform md:left-1/2">
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  <div className="absolute left-0 top-0 h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-20"></div>
                </div>
                <div className="ml-12 md:ml-auto md:w-[calc(50%-2rem)] md:pl-16 w-[calc(100%-3rem)]">
                  <div className="relative overflow-hidden hover:bg-blue-500 rounded-xl border bg-gradient-to-br from-white/50 to-gray-50/30 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 dark:border-gray-800 dark:from-gray-900/50 dark:to-black/30">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 dark:from-blue-500/10"
                      // style="opacity:0"
                    ></div>
                    <div className="relative mb-4 flex items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600/50 opacity-10 dark:from-blue-500 dark:to-blue-700/50 dark:opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-share h-8 w-8 text-blue-600"
                          >
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" x2="12" y1="2" y2="15"></line>
                          </svg>
                        </div>
                        <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                          <span className="font-secondary text-base font-bold text-white">
                            4
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-secondary text-xl font-semibold text-black dark:text-white/90">
                          Get notified
                        </h3>
                        <p className="mt-2 text-gray-900">
                          Stay alerted with our messages or gmail notifications
                          to know how your website is performing in different
                          locations.
                        </p>
                      </div>
                    </div>
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl dark:bg-blue-500/10"></div>
                    <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl dark:bg-blue-700/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Activity className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-white">
                  UptimeGuard
                </span>
              </div>
              <p className="text-sm">
                Enterprise-grade monitoring solutions for modern infrastructure.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            © 2025 UptimeGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default page;
