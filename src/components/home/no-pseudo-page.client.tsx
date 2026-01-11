"use client";

import { ReactNode } from "react";
import { ExternalLink, MousePointer2, Hammer, ChevronRight, User, ListChevronsUpDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { FaCalculator, FaDiscord, FaGithub, FaShoppingBasket } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { PiRankingBold } from "react-icons/pi";
import { MdOutlineWebhook } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { constants, PathValid } from "@/lib/constants";
import { SearchPlayerInput } from "@/components/home/search-player.client";
import { textFormatting } from "@/lib/misc";
import { Card } from "../ui/card";
import { UnOptimizedImage } from "../ui/image-loading";
import { IoMdStopwatch } from "react-icons/io";

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: ReactNode;
  image: string;
  href: PathValid | "/craft" | typeof constants.discord.url;
}

const FEATURES: FeatureItem[] = [
  { id: "clicker", title: constants.links[constants.optimizerClickerPath].label, desc: "Maximisez vos clics coins.", icon: <MousePointer2 size={20} />, image: "/img/Home/clicker-optimizer.jpg", href: constants.optimizerClickerPath },
  { id: "profil", title: constants.links[constants.profilPath].label, desc: "Stats & infos joueurs.", icon: <User size={20} />, image: "/img/Home/profil.jpg", href: constants.profilPath },
  { id: "market", title: constants.links[constants.ahPath].label, desc: "Prix HDV en temps réel et historique de vente.", icon: <FaShoppingBasket size={20} />, image: "/img/Home/market.jpg", href: constants.ahPath },
  { id: "adminshop", title: constants.links[constants.adminShopPath].label, desc: "Historique des prix de vente de l'admin shop.", icon: <LuShoppingCart size={20} />, image: "/img/Home/admin-shop.jpg", href: constants.adminShopPath },
  { id: "leaderboard", title: constants.links[constants.moneyRanking].label, desc: "Classements Paladium quotidien.", icon: <PiRankingBold size={20} />, image: "/img/Home/ranking.jpg", href: constants.moneyRanking },
  { id: "crafts-1", title: constants.links[constants.craftingCalculatorPath].label, desc: "Calcul les ressouces nécessaires pour un craft.", icon: <Hammer size={20} />, image: "/img/Home/craft-calculator.jpg", href: constants.craftingCalculatorPath },
  { id: "crafts-2", title: constants.links[constants.craftingOptimizerPath].label, desc: "Optimise les crafts les plus rentables.", icon: <ListChevronsUpDown size={20} />, image: "/img/Home/craft-optimizer.jpg", href: constants.craftingOptimizerPath },
  { id: "calculator", title: constants.links[constants.calculatorXpPath].label, desc: "Calcul d'xp métier nécessaire.", icon: <FaCalculator size={20} />, image: "/img/Home/xp-calculator.jpg", href: constants.calculatorXpPath },
  { id: "webhook", title: constants.links[constants.webhooksPath].label, desc: "Notifications discord en temps semi-réel.", icon: <MdOutlineWebhook size={20} />, image: "/img/Home/webhook.jpg", href: constants.webhooksPath },
  { id: "pala-animation", title: constants.links[constants.palaAnimationPath].label, desc: "Entraînement aux Pala-Animations", icon: <IoMdStopwatch size={20} />, image: "/img/Home/pala-animation.jpg", href: constants.palaAnimationPath },
  { id: "status", title: constants.links[constants.statusPath].label, desc: "Graphiques de l'historique des joueurs en ligne.", icon: <HiOutlineStatusOnline size={20} />, image: "/img/Home/status.jpg", href: constants.statusPath },
  { id: "discord", title: "Nous Rejoindre", desc: "Communauté, Support & Actualités.", icon: <FaDiscord size={20} />, image: "/img/Home/discord-logo.png", href: constants.discord.url },
];

interface NoPseudoPageProps {
  contributors: Contributor[];
  texth1: string;
  texth2: string;
}

/**
 * [Home page content](https://palatracker.bromine.fr)
 */
export function NoPseudoPageWithContributeur({ contributors, texth1, texth2 }: NoPseudoPageProps) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        speed: 1.25,
      })
    ]
  );

  return (
    <div className="flex flex-col gap-12 sm:gap-16 w-full max-w-full overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full text-center space-y-8 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold md:text-3xl text-center font-extrabold">
          {textFormatting(texth1)}
        </h1>
        <h2 className="text-xl md:text-2xl text-center font-bold">
          {textFormatting(texth2)}
        </h2>
        {/* <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl break-words max-w-full">
          Commence par saisir ton pseudo <span className="text-primary block md:inline">Minecraft</span>
        </h1> */}
        <div className="w-full max-w-md mx-auto">
          <SearchPlayerInput variant="homepage" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-4  mb-3">
          <div className="h-[2px] w-8 sm:w-12 bg-primary rounded-full shrink-0" />
          <h3 className="font-bold uppercase tracking-widest text-xs sm:text-sm truncate">
            Fonctionnalités
          </h3>
        </div>

        <div className="w-full relative group/carousel max-w-full overflow-hidden">

          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[45%] md:auto-cols-[33.333%] lg:auto-cols-[25%] xl:auto-cols-[20%] touch-pan-y">
              {FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  className="min-w-0 px-2 first:pl-4"
                >
                  <FeatureCard data={feature} />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      <div className="w-full px-4 sm:px-0">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-[2px] w-8 sm:w-12 bg-primary rounded-full shrink-0"></div>
          <h3 className="font-bold uppercase tracking-widest text-xs sm:text-sm">
            Communauté
          </h3>
        </div>

        <Card className="w-full overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1 text-center lg:text-left space-y-6 w-full">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Projet Open Source</h2>
                <p className="leading-relaxed max-w-lg mx-auto lg:mx-0 text-sm sm:text-base">
                  PalaTracker est un outil développé par la communauté pour la communauté.
                  Chaque contribution compte pour améliorer l&apos;expérience des joueurs Paladium.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href={constants.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded bg-[#24292e] hover:bg-[#2f363d] text-white font-bold border border-[#444c56] hover:border-gray-400 shadow-lg active:translate-y-[1px] transition-all text-sm sm:text-base"
                >
                  <FaGithub size={20} />
                  <span>Contribuer</span>
                  <ExternalLink size={14} className="opacity-50" />
                </a>

                <a
                  href={constants.discord.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold border border-[#5865F2] hover:border-[#4752C4] shadow-lg active:translate-y-[1px] transition-all text-sm sm:text-base"
                >
                  <FaDiscord size={20} />
                  <span>Discord</span>
                  <ExternalLink size={14} className="opacity-50" />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
              <span className="text-xs font-bold text-primary uppercase tracking-widest text-center">
                Merci à nos contributeurs
              </span>
              <div className="flex flex-wrap justify-center lg:justify-end gap-3 w-full max-w-xs sm:max-w-md">
                {contributors.map((contributor) => (
                  <a
                    key={contributor.login}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#2a2a2a] overflow-hidden hover:scale-110 hover:border-primary transition-all duration-300 shrink-0"
                    title={contributor.login}
                  >
                    <Image
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      fill
                      className="object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({ data }: { data: typeof FEATURES[0] }) {
  return (
    <Link
      href={data.href}
      draggable={false}
      className="group relative block w-full h-[320px] sm:h-[380px] select-none my-2"
    >
      <Card className="flex flex-col p-0 relative w-full h-full group-hover:border-primary group-hover:border overflow-hidden  group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
        <div className="h-[150px] sm:h-[180px] w-full relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br z-0"></div>
          <UnOptimizedImage
            width={0}
            height={0}
            src={data.image}
            alt={data.title}
            draggable={false}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
          />
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="text-primary group-hover:scale-110 transition-transform duration-300 shrink-0">
                {data.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold group-hover:text-white transition-colors truncate">{data.title}</h3>
            </div>
            <p className="text-sm leading-relaxed line-clamp-3">
              {data.desc}
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-primary uppercase tracking-widest mt-2 sm:mt-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
            Accéder <ChevronRight size={14} className="ml-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}