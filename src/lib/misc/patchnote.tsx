export function textFormatting(
  text: string): React.JSX.Element {
  const parts = text.split(
    /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~|°.*?°|\[.*?\]\(.*?\)|\n)/g
  );

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong
            key={index}>{textFormatting(part.slice(2, -2))}</strong>;
        }
        if (part.startsWith("°") && part.endsWith("°")) {
          return <span key={index + "orange"} className="text-primary">
            {textFormatting(part.slice(1, -1))}
          </span>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em
            key={index}>{textFormatting(part.slice(1, -1))}</em>;
        }
        if (part.startsWith("__") && part.endsWith("__")) {
          return <u
            key={index}>{textFormatting(part.slice(2, -2))}</u>;
        }
        if (part.startsWith("~~") && part.endsWith("~~")) {
          return <s
            key={index}>{textFormatting(part.slice(2, -2))}</s>;
        }

        const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          return (
            <strong key={index + "strong"}><a key={index + "href"} href={linkUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
               className="text-primary hover:text-orange-700 transition-colors duration-300"
            >
              {linkText}
            </a>
            </strong>
          );
        }
        if (part === "\n") {
          return <br key={index}/>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}