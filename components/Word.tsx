import { Prata, Courgette } from "next/font/google";
import { Label } from "./ui/label";
import { Play } from "lucide-react";

const spaceMono = Courgette({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const prata = Prata({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

function Word({ word, setKeyword, searchQuery }: any) {
  return (
    <section className=" flex flex-col my-11">
      <div className="flex place-content-between items-center">
        <div className="flex flex-col gap-1">
          <Label
            className={`text-4xl first-letter:uppercase ${prata.className}`}
          >
            {word.word}
          </Label>
          <Label className="theme-text-primary">{word.phonetic}</Label>
        </div>
        <button
          className="flex items-center place-content-center p-2 theme-bg-primary rounded-full hover:shadow-lg hover:scale-110 transition-all duration-200"
          onClick={(event: any) => {
            event.preventDefault();
            event.stopPropagation();
            const wordToSay = word.word ?? word.phonetic;
            const utterance = new SpeechSynthesisUtterance(wordToSay);
            speechSynthesis.speak(utterance);
          }}
        >
          <Play />
          {/* <SvgIcon icon={"Play"} className="theme-text-on-primary" size={10} /> */}
        </button>
      </div>
      <div className="flex flex-col">
        <Meanings
          meanings={word.meanings}
          setQuery={(query: string) => {
            setKeyword(query);
            searchQuery(query);
          }}
        />
      </div>
      <div>
        <div className="flex flex-col my-4 border-t py-2">
          <Label>Origin </Label>
          <a href={word.sourceUrls}>
            <Label className="underline">{word.sourceUrls}</Label>
          </a>
        </div>
      </div>
    </section>
  );
}

function Meanings({ meanings, setQuery = () => {} }: any) {
  return (
    <>
      {meanings.map((meaning: any, index: number) => {
        const { partOfSpeech, synonyms, antonyms } = meaning;
        return (
          <>
            <div key={index}>
              <div className="flex gap-4 items-center my-4">
                <Label className={spaceMono.className}>{partOfSpeech}</Label>
                <div className="flex-1 border-b h-1 " />
              </div>
              <Definition definitions={meaning.definitions} />
              <div className="flex flex-col gap-2 mt-4">
                <Nonyms
                  nonyms={synonyms}
                  label={"Synonyms "}
                  setQuery={setQuery}
                />
                <Nonyms
                  nonyms={antonyms}
                  label={"Antonyms "}
                  setQuery={setQuery}
                />
              </div>
            </div>
          </>
        );
      })}
    </>
  );
}

function Definition({ definitions }: any) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Meaning </Label>
      <div className="flex flex-col gap-1">
        {definitions.map((item: any, index: number) => (
          <ul
            key={index}
            className="flex flex-col  list-disc list-outside pl-4"
          >
            <li key={index}>
              <Label>{item.definition}</Label>

              {item.example && (
                <div className="ml-4">
                  <Label>Example: </Label>
                  <Label className="italic">{item.example}</Label>
                </div>
              )}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}

function Nonyms({ nonyms, label, setQuery = (e: any) => {} }: any) {
  return (
    nonyms &&
    nonyms.length > 0 && (
      <div className="flex items-start gap-2">
        <Label>{label}</Label>
        <div className="flex flex-wrap gap-2 ">
          {nonyms.map((item: any, index: number) => (
            <Label
              key={index}
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();

                setQuery(item);
              }}
              className={`cursor-pointer theme-text-primary ${prata.className}`}
            >
              {item}
            </Label>
          ))}
        </div>
      </div>
    )
  );
}

export default Word;
