"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { textFormatting } from "@/lib/misc";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  { date: "C'est l'heure du rewind", text: "Retrace l'année de développement du °PalaTracker°", image: undefined, className: "", description: "Il y a un an, j’écrivais la toute première ligne de code. Qui aurait cru qu’un an plus tard, le projet aurait grandi à ce point ?\n" +
      "\n" +
      "Quelques chiffres pour mesurer le chemin parcouru :\n" +
      "🖥️ °13 898° lignes de code\n" +
      "🔄 °791° commits\n" +
      "🤝 °4° contributeurs\n"
  },
  { date: "15 Mars 2024", text: "Première ligne de code 🎉", image: "/img/Birthday/0.15-03-2024 first line of code.png", className: "", description: "" },
  { date: "19 Mars 2024", text: "Lancement du site 1/2 🎉", image: "/img/Birthday/1. 2-04-2024 -0.png" , className: "", description: "" },
  { date: "19 Mars 2024", text: "Lancement du site 2/2 🎉", image: "/img/Birthday/2. 2-04-2024.png" , className: "", description: "" },
  { date: "3 Avril 2024", text: "Ajout du classement clicker 💡", image: "/img/Birthday/3. 3-04-2024 graphique.png", className: "", description: "" },
  { date: "15 Avril 2024", text: "Fuze présente le site en vidéo", image: "/img/Birthday/3.5 15 avril 2024 Fuze.jpg", className: "", description: "" },
  { date: "25 Avril 2024", text: "Ajout du PalaAnimation Trainer", image: "/img/Birthday/3.5 25 avril palaAnimation.png" , className: "", description: "" },
  { date: "5 Mai 2024", text: "Ajout de la page Profil", image: "/img/Birthday/4. 5 mai 2024 profil.png" , className: "", description: "" },
  { date: "7 Mai 2024", text: "Ajout du Ah Tracker", image: "/img/Birthday/5. 7 mai ajout du ah tracker.png", className: "", description: "", border: true },
  { date: "9 Mai 2024", text: "1ère refonte du site", image: "/img/Birthday/6. 9 mai 2024.png" , className: "", description: "" },
  { date: "12 Mai 2024", text: "2ème refonte du site 1/2", image: "/img/Birthday/8. 12 mai refont graphique.png" , className: "", description: "" },
  { date: "12 Mai 2024", text: "2ème refonte du site 2/2", image: "/img/Birthday/9. 12 mai refont graphique 2.png", className: "", description: "" },
  { date: "22 Mai 2024", text: "Ajout de Xp Calculator", image: "/img/Birthday/10. 22 mai xp calculator.png", className: "", description: "" },
  { date: "7 Septembre 2024", text: "Ajout de l'historique de prix du l'admin shop", image: "/img/Birthday/7-09-2025 admin shop.png" , className: "", description: "" },
  { date: "7 Octobre 2024", text: "DDoS du site", image: undefined, className: "", description: "C'est passé inaperçu, mais on a tellement DDoS le site que mon hébergeur a bloqué mon compte, rendant le site inaccessible pendant une heure." },
  { date: "16 Octobre 2024", text: "Ajout de l'aide au craft", image: "/img/Birthday/12. 16-10-2024 ajout du craft.png", className: "", description: "" },
  { date: "27 Novembre 2024", text: "Ajout d'informations supplémentaires dans le profil 1/3", image: "/img/Birthday/12. 27-11-2024 Achievements.png" , className: "", description: "" },
  { date: "27 Novembre 2024", text: "Ajout d'informations supplémentaires dans le profil 2/3", image: "/img/Birthday/13. 27-11-2024 Monture.png", className: "", description: "" },
  { date: "21 Decembre 2024", text: "Ajout d'informations supplémentaires dans le profil 3/3", image: "/img/Birthday/14. 21 decembre 2024 classement profil.png", className: "", description: "" },
  { date: "24 Janvier 2025", text: "Ajout de l'authentification via Discord et des alertes Discord", image: "/img/Birthday/15. 24-01-2025 - Ajout du SSO discord et webhook.png", className: "", description: "" },
  { date: "22 Février 2025", text: "Ajout du market en temps réel", image: "/img/Birthday/16. 22-02-2025 - detail market.png", className: "", description: "" },
  { date: "Aujourd'hui", text: "",description:
      "PalaTracker aujourd'hui c'est **9 outils** principaux\n" +
      "[Profil](https://palatracker.bromine.fr/profil), " +
      "[Market Tracker](https://palatracker.bromine.fr/ah?item=paladium-ingot), " +
      "[Admin-Shop Tracker](https://palatracker.bromine.fr/admin-shop?item=paladium-ingot), " +
      "[Classement Tracker](https://palatracker.bromine.fr/ranking?category=clicker), " +
      "[Clicker Optimizer](https://palatracker.bromine.fr/clicker-optimizer/BroMine__), " +
      "[Calculateur d'xp](https://palatracker.bromine.fr/clicker-optimizer/BroMine__), " +
      "[Pala Animation Trainer](https://palatracker.bromine.fr/pala-animation/), " +
      "[Craft Optimizer](https://palatracker.bromine.fr/craft?count=1&item=hunter-backpack-amethyste), " +
      "[Alertes Discord](https://palatracker.bromine.fr/webhook)\n\n" +
      "Un engouement de fou: °3 455° profils uniques chargés depuis la V10.5 soit °17.2%° des joueurs, °30 611 joueurs uniques° depuis le lancement du site.\n\n" +
      "Le site n’aurait jamais pu évoluer autant sans °vous°, la communauté. Chaque visite, chaque retour, chaque suggestion ont permis de faire de PalaTracker ce qu'il est aujourd'hui." +
      "\n\n" +
      "Merci à toutes celles et ceux qui utilisent le site, qui le partagent, qui donnent leurs idées et leur soutien. Votre enthousiasme et votre engagement ont été la plus grande motivation pour continuer à améliorer PalaTracker." +
      "\n\n" +
      "Merci encore, et longue vie à PalaTracker ! ❤️\nUn grand °merci°, BroMine__", image: undefined, className: "" },
];

/**
 * Custom scrollbar using coin.png
 * Use for [rewind page](https://palatracker.bromine.fr/rewind)
 */
const Timeline = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRefs = useRef<any>([]);

  useEffect(() => {
    const sections: any = gsap.utils.toArray(".timeline-item");
    sectionRefs.current = sections;

    sections.forEach((section: any, index: number) => {
      const image = section.querySelector(".timeline-image");
      const text = section.querySelector(".timeline-text");
      const description = section.querySelector(".timeline-description");

      gsap.fromTo(
        section,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 30%",
            scrub: true,
            onUpdate: (self) => {
              if (self.progress > 0.5) {
                setCurrentIndex(index);
              }
            },
          },
        }
      );

      gsap.fromTo(
        text,
        { y: "0%" },
        {
          y: () => image ? `-${image.clientHeight / 2 + text.clientHeight / 2 + 20}px` : `-${description.clientHeight / 2 + text.clientHeight / 2 + 20}px`,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "top 20%",
            scrub: true,
          },
          onComplete: () => {
            const rect = text.getBoundingClientRect();
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top - rect.height / 2) / window.innerHeight },
              zIndex: -1
            });
          },
        }
      );

      gsap.fromTo(
        image,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "top 20%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        description,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "top 10%",
            scrub: true,
          },
        }
      );
    });
  }, []);

  const handleScrollTo = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="fixed right-10 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4">
        {timelineData.map((_, index) => (
          <Image key={index}
            width={0}
            height={0}
            alt={"clic"}
            src="/coin.png"
            unoptimized={true}
            onClick={() => handleScrollTo(index)}
            className={`w-5 h-5 pixelated cursor-pointer ${index === currentIndex ? "scale-[150%]" : "grayscale"} ${index - 1 === currentIndex || index + 1 === currentIndex && "scale-[115%]"} ${index - 2 === currentIndex || index + 2 === currentIndex && "scale-[105%]"} transition-transform duration-300`} />
        ))}
      </div>
      <div ref={containerRef} className="flex flex-col items-center gap-20 py-20">
        {timelineData.map((event, index) => (
          <div key={index} className={cn("timeline-item relative w-full h-screen flex flex-col justify-center items-center opacity-0", event.className)}>
            {event.description &&
              <span
                className="w-full h-auto text-center bg-card/90 text-card-foreground text-3xl font-bold p-10 rounded-lg timeline-description">
                {textFormatting(event.description)}
              </span>
            }
            <div
              className="absolute z-10 bg-card/80 p-6 rounded-lg text-card-foreground text-center max-w-2xl transition-transform duration-500 timeline-text">
              <h3 className="text-3xl font-bold">{event.date}</h3>
              <p className="text-lg">{textFormatting(event.text)}</p>
            </div>
            {event.image !== undefined && <Image
              src={event.image}
              alt={event.text}
              width={0}
              height={0}
              unoptimized={true}
              className={cn("w-full h-auto object-cover opacity-0 transition-opacity duration-500 timeline-image border-4 rounded-xl border-primary")}
            />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
