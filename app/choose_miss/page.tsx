'use client'

import { useState } from 'react';

export default function ChooseMiss() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
    const toggleCheckbox = (index: number) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    }

    return (
        <div className="px-6 py-7 flex flex-col items-center">
            <p className="pt-9 w-[285px] text-[35px] font-bold text-[#FF991C] text-center leading-tight">
                Выберите Мисс ФевМарт
            </p>

            <form className="mt-7">
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <span className="text-white pr-2 text-[30px]">10A</span>
                        <span className="text-white text-[30px] font-bold">Марочкин Т.</span>
                    </div>

                    <label className="cursor-pointer">
                        <input type="checkbox" className="hidden" checked={selectedIndex === 0} onChange={() => toggleCheckbox(0)} />
                        <div className={`w-[30px] h-[30px] rounded-lg border-2 border-white flex items-center justify-center ${selectedIndex === 0 ? 'bg-[#FF991C]' : 'bg-black'}`}/>                    </label>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <div>
                        <span className="text-white pr-2 text-[30px]">10Б</span>
                        <span className="text-white text-[30px] font-bold">Марочкин Т.</span>
                    </div>

                    <label className="cursor-pointer">
                        <input type="checkbox" className="hidden" checked={selectedIndex === 1} onChange={() => toggleCheckbox(1)} />
                        <div className={`w-[30px] h-[30px] rounded-lg border-2 border-white flex items-center justify-center ${selectedIndex === 1 ? 'bg-[#FF991C]' : 'bg-black'}`}/>
                    </label>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <div>
                        <span className="text-white pr-2 text-[30px]">10В</span>
                        <span className="text-white text-[30px] font-bold">Марочкин Т.</span>
                    </div>

                    <label className="cursor-pointer">
                        <input type="checkbox" className="hidden" checked={selectedIndex === 2} onChange={() => toggleCheckbox(2)} />
                        <div className={`w-[30px] h-[30px] rounded-lg border-2 border-white flex items-center justify-center ${selectedIndex === 2 ? 'bg-[#FF991C]' : 'bg-black'}`}/>
                    </label>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <div>
                        <span className="text-white pr-2 text-[30px]">10Г</span>
                        <span className="text-white text-[30px] font-bold">Марочкин Т.</span>
                    </div>

                    <label className="cursor-pointer">
                        <input type="checkbox" className="hidden" checked={selectedIndex === 3} onChange={() => toggleCheckbox(3)} />
                        <div className={`w-[30px] h-[30px] rounded-lg border-2 border-white flex items-center justify-center ${selectedIndex === 3 ? 'bg-[#FF991C]' : 'bg-black'}`}/>
                    </label>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div>
                        <span className="text-white pr-2 text-[30px]">10Д</span>
                        <span className="text-white text-[30px] font-bold">Марочкин Т.</span>
                    </div>

                    <label className="cursor-pointer">
                        <input type="checkbox" className="hidden" checked={selectedIndex === 4} onChange={() => toggleCheckbox(4)} />
                        <div className={`w-[30px] h-[30px] rounded-lg border-2 border-white flex items-center justify-center ${selectedIndex === 4 ? 'bg-[#FF991C]' : 'bg-black'}`}/>
                    </label>
                </div>

                <button className="mt-10 text-white w-[330px] h-[68px] bg-[#FF991C] rounded-xl font-bold text-[36px]">
                    Продолжить
                </button>
            </form>
        </div>
    )
}