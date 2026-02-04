"use client";

import { useState, useMemo } from "react";
import Button from "@/app/components/button";
import Table from "../components/table";

interface DataEntry {
  title: string;
  votes: number;
}

const CLASS_VOTES: DataEntry[] = [
  { title: "10A", votes: 63 },
  { title: "10Б", votes: 69 },
  { title: "10В", votes: 52 },
  { title: "10Г", votes: 67 },
  { title: "10Д", votes: 65 },
];

const PERSON_VOTES: DataEntry[] = [
  { title: "10A", votes: 50 },
  { title: "10Б", votes: 56 },
  { title: "10В", votes: 69 },
  { title: "10Г", votes: 71 },
  { title: "10Д", votes: 70 },
];

type TabOptions = "miss" | "class";

export default function Podium() {
  const [selectedTopic, setSelectedTopic] = useState<TabOptions>("miss");

  const { sortedData, q, d } = useMemo(() => {
    const rawData = selectedTopic === "miss" ? PERSON_VOTES : CLASS_VOTES;
    const sorted = [...rawData].sort((a, b) => b.votes - a.votes);

    const qVal = sorted.length > 0 ? sorted[sorted.length - 1].votes : 0;
    const wVal = sorted.length > 0 ? sorted[0].votes : 0;
    const dVal = wVal - qVal;

    return { sortedData: sorted, q: qVal, d: dVal };
  }, [selectedTopic]);

  const magic: number = 42;

  const calculateWidth = (votes: number) => {
    if (d === 0) return magic * 2;
    return (Math.pow((votes - q) / d, 1.2) + 1) * magic;
  };

  const winnerTitle = sortedData[0]?.title;

  return (
    <div className="py-7 flex flex-col items-center min-h-screen">
      <p className="pt-8 mb-5 text-[48px] font-bold text-secondary text-center leading-tight">
        Подиум
      </p>

      <div className="w-full border-border-dark-2 border-2 p-1 grid grid-cols-2 h-fit rounded-lg mb-8">
        <button
          className={`${selectedTopic === "miss" ? "bg-secondary text-text-dark" : "bg-background text-text-bright"} duration-300 py-4 rounded-2xl`}
          onClick={() => setSelectedTopic("miss")}
        >
          <h3 className="text-xl">Мисс</h3>
        </button>
        <button
          className={`${selectedTopic === "class" ? "bg-secondary text-text-dark" : "bg-background text-text-bright"} duration-300 py-4 rounded-2xl`}
          onClick={() => setSelectedTopic("class")}
        >
          <h3 className="text-xl">Класс</h3>
        </button>
      </div>

      <Table tableName="Podium" className="w-full px-4 flex flex-col gap-4">
        {sortedData.map((entry) => {
          const widthPercentage = calculateWidth(entry.votes);
          const isWinner = entry.title === winnerTitle;

          return (
            <div
              key={entry.title}
              className="grid grid-cols-[5rem_1fr] gap-3 items-center w-full"
            >
              <h3 className="text-text-bright text-[32px]">{entry.title}</h3>

              <div className="ml-4 relative flex-1">
                <div
                  className={`${
                    isWinner
                      ? "bg-secondary text-text-dark"
                      : "bg-dark-2 text-text-bright"
                  } py-3.5 rounded-xl flex items-center justify-end transition-all duration-500`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  <h3 className="font-medium text-xl pr-4">{entry.votes}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </Table>

      <footer className="w-full mt-auto pt-10 px-4">
        <Button>Переголосовать</Button>
      </footer>
    </div>
  );
}
