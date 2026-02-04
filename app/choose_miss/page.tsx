'use client'

import { useState } from 'react'
import Table from '../components/table'
import Button from '../components/button'

interface optionContent {
	cl: string
	name: string
}

export default function ChooseMiss() {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

	const toggleCheckbox = (index: number) => {
		setSelectedIndex(selectedIndex === index ? null : index)
	}

	const optionsData: optionContent[] = [
		{
			cl: '10A',
			name: 'Марочкин Т.',
		},
		{
			cl: '10Б',
			name: 'Марочкин Т.',
		},
		{
			cl: '10В',
			name: 'Марочкин Т.',
		},
		{
			cl: '10Г',
			name: 'Марочкин Т.',
		},
		{
			cl: '10Д',
			name: 'Марочкин Т.',
		},
	]

	const options = optionsData.map(({ cl, name }: optionContent, index) => {
		return (
			<div
				className={`grid grid-cols-[5rem_1fr_auto] items-center w-full`}
				key={`Miss-Option-${index}`}>
				<h3 className={`text-bright pr-2 text-2.5xl`}>{cl}</h3>
				<h4 className="text-bright text-xl font-light">{name}</h4>

				<label className="cursor-pointer">
					<input
						type="checkbox"
						className="hidden"
						checked={selectedIndex === index}
						onChange={() => toggleCheckbox(index)}
					/>
					<div className="rounded-md border-2 border-bright">
						<div className={`w-5 h-5 m-1 duration-300 ease-in-out rounded-sm flex items-center justify-center ${selectedIndex === index ? 'bg-secondary' : 'bg-background'}`} />
					</div>
				</label>
			</div>
		)
	})

	return (
		<div className="py-7 flex flex-col items-center">
			<h1 className="text-3.5xl font-bold text-secondary text-center leading-tight">Выберите Мисс ФевМарт</h1>

			<div className="w-full">
				<div className="absolute bottom-1/2 translate-y-1/2 left-0 px-4 w-full">
					<Table tableName="chooseClass">{options}</Table>
				</div>

				<div className="absolute bottom-18 left-0 w-full px-4">
					<Button>Продолжить</Button>
				</div>
			</div>
		</div>
	)
}
