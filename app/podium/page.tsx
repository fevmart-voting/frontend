'use client'

import { useState } from 'react';

export default function Podium() {

    const data1 = {
        "10A" : 63,
        "10Б" : 69,
        "10В" : 52,
        "10Г" : 67,
        "10Д" : 65,
    };

    const data2 = {
        "10A" : 50,
        "10Б" : 56,
        "10В" : 69,
        "10Г" : 71,
        "10Д" : 70,
    };

    const maxVotes = Math.max(...Object.values(data1));

    const topClass = Object.entries(data1).sort(([,a], [,b]) => b - a)[0][0];
    const dataArray = Object.entries(data1);


    const maxVotesM = Math.max(...Object.values(data2));

    const topMiss = Object.entries(data2).sort(([,a], [,b]) => b - a)[0][0];
    const dataArrayM = Object.entries(data2);


    const [selectedTopic, setSelectedTopic] = useState<string | null>("мисс");

    const toggleTopicButton = () => {
        setSelectedTopic(selectedTopic === "мисс" ? "класс" : "мисс");
    };

    return (
        <div className="px-6 py-7 flex flex-col items-center">
            <p className="pt-8 w-[270px] text-[48px] font-bold text-[#FF991C] text-center leading-tight">
                Подиум
            </p>

            <div className='pt-10'>
                <button
                    className={`bg-[#FF991C] text-bright h-[54px] w-[165px] rounded-l-xl border-2 border-r-1 border-white text-[32px] ${selectedTopic === "мисс" ? 'bg-[#FF991C] font-bold' : 'bg-black'}`}
                    onClick={toggleTopicButton}
                >
                    Мисс
                </button>
                <button
                    className={`bg-[#FF991C] text-bright h-[54px] w-[165px] rounded-r-xl border-2 border-l-1 border-white text-[32px] ${selectedTopic === "класс" ? 'bg-[#FF991C] font-bold' : 'bg-black'}`}
                    onClick={toggleTopicButton}
                >
                    Класс
                </button>
            </div>

            { 
            (selectedTopic === "мисс") ?
                <div className="p-4 space-y-4 mt-6">
                    {dataArrayM.map(([className, votes]) => {
                        const width = (votes / maxVotesM) * 255;

                        return (
                            <div key={className} className="flex items-center">
                                <span className="text-white text-[32px] w-12">{className}</span>
                                
                                <div className="ml-4 relative">
                                    <div 
                                        className={`h-10 rounded-r-xl flex items-center justify-end
                                            ${className === topMiss ? 'bg-[#FF991C]' : 'bg-white'}`}
                                        style={{ width: `${width}px` }}
                                    >
                                        
                                        <span className={`font-bold text-[24px] pr-4 ${className === topMiss ? 'text-bright' : 'text-black'}`} >
                                            {votes}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            :
                <div className="p-4 space-y-4 mt-6">
                    {dataArray.map(([className, votes]) => {
                        const width = (votes / maxVotes) * 255;

                        return (
                            <div key={className} className="flex items-center">
                                <span className="text-white text-[32px] w-12">{className}</span>
                                
                                <div className="ml-4 relative">
                                    <div 
                                        className={`h-10 rounded-r-xl flex items-center justify-end
                                            ${className === topClass ? 'bg-[#FF991C]' : 'bg-white'}`}
                                        style={{ width: `${width}px` }}
                                    >
                                        
                                        <span className={`font-bold text-[24px] pr-4 ${className === topClass ? 'text-bright' : 'text-black'}`} >
                                            {votes}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            } 

        </div>
    )
}