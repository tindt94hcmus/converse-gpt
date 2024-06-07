import { Prata, Courgette } from "next/font/google";
import { Label } from "./ui/label";

const prata = Prata({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

interface Props {
  word?: string;
  result: {
    message: string;
    resolution: string;
    title: string;
  };
}

export const NoDefinition = ({ word, result }: Props) => {
  if (!word) return null;

  return (
    <section className=" flex flex-col my-11">
      <div className="flex place-content-between items-center">
        <div className="flex flex-col gap-1">
          <Label
            className={`text-4xl first-letter:uppercase ${prata.className}`}
          >
            {word}
          </Label>
        </div>
      </div>
      <div className="font-bold text-lg mt-8">{result.title}</div>
      <div className="mt-4">{result.message}</div>
      <div className="mt-2">{result.resolution}</div>
    </section>
  );
};
