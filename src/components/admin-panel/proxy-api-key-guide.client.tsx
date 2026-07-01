"use client";
import { useState } from "react";
import { SiJavascript, SiPython, SiCurl } from "react-icons/si";

type Lang = "js" | "python" | "curl";

const TABS: { key: Lang; label: string; icon: React.ReactNode }[] = [
  { key: "js",     label: "JavaScript", icon: <SiJavascript color="#F7DF1E" /> },
  { key: "python", label: "Python",     icon: <SiPython color="#3776AB" /> },
  { key: "curl",   label: "curl",       icon: <SiCurl color="#00ff6aff" /> },
];

function CodeBlock({ html }: { html: string }) {
  return (
    <div
      className="rounded-lg overflow-x-auto text-sm [&>pre]:p-4 [&>pre]:rounded-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Example of code to use the API key
 */
export function ProxyApiKeyGuideClient({ jsHtml, pythonHtml, curlHtml }: { jsHtml: string; pythonHtml: string; curlHtml: string }) {
  const [lang, setLang] = useState<Lang>("js");

  const htmlMap: Record<Lang, string> = { js: jsHtml, python: pythonHtml, curl: curlHtml };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>
          La cr&eacute;ation de cl&eacute;s Paladium n&apos;est plus possible directement. Ce proxy vous permet d&apos;utiliser
          l&apos;int&eacute;gralit&eacute; de l&apos;API officielle de Paladium en utilisant une cl&eacute; PalaTracker &agrave; la place.
        </p>
        <ul className="list-none flex flex-col gap-1">
          <li>- Acc&egrave;s &agrave; tous les endpoints de l&apos;API Paladium via <code className="text-primary">https://palatracker.bromine.fr/v1/...</code></li>
          <li>- La r&eacute;ponse est identique &agrave; celle de l&apos;API Paladium, avec deux headers suppl&eacute;mentaires :</li>
          <li className="pl-4"><code className="text-primary">X-Cache</code> : <code>HIT</code> si la r&eacute;ponse provient du cache, <code>MISS</code> sinon.</li>
          <li className="pl-4"><code className="text-primary">X-Cache-Expires-In</code> : pr&eacute;sent uniquement en cas de <code>HIT</code>, indique le temps restant avant expiration du cache (en secondes).</li>
          <li>- La cl&eacute; est partag&eacute;e entre tous les utilisateurs actifs sur l&apos;heure &eacute;coul&eacute;e. Le rate limit de chaque endpoint est divis&eacute; par le nombre d&apos;utilisateurs simultan&eacute;s donc pensez &agrave; g&eacute;rer le header <code className="text-primary">X-RateLimit-Remaining</code> pour &eacute;viter les erreurs 429.</li>
          <li>- <strong>Documentation compl&egrave;te et détaillée</strong> : <a href="https://palatracker.bromine.fr/v1/docs" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">https://palatracker.bromine.fr/v1/docs</a></li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Exemples de requ&ecirc;tes :</p>
        <div className="flex gap-2 border-b border-secondary-foreground dark:border-secondary">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              className={`flex items-center gap-1.5 py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                lang === key
                  ? "text-primary border-primary"
                  : "border-transparent hover:text-primary-darker hover:border-primary-darker"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <CodeBlock html={htmlMap[lang]} />
      </div>
    </div>
  );
}
