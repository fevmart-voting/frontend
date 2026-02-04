'use client'

import { useState } from 'react'
import Button from '@/app/components/button'
import Table from '../components/table'

const data1 = {
	'10A': 63,
	'10Б': 69,
	'10В': 52,
	'10Г': 67,
	'10Д': 65,
}

const data2 = {
	'10A': 50,
	'10Б': 56,
	'10В': 69,
	'10Г': 71,
	'10Д': 70,
}

type tabOptions = "miss" | "class"

export default function Podium() {
	const dataArray = Object.entries(data1)

	const maxVotesM = Math.max(...Object.values(data2))

	const topMiss = Object.entries(data2).sort(([, a], [, b]) => b - a)[0][0]
	const dataArrayM = Object.entries(data2)

	const [selectedTopic, setSelectedTopic] = useState<tabOptions>('miss')

	const toggleTopicButton = (topic:tabOptions) => {
		setSelectedTopic(() => topic)
	}

	const chart = (selectedTopic === 'miss' ? dataArrayM : dataArray).map(([cl, votes]) => {
		const width = votes / maxVotesM

		return (
			<div
				key={cl}
				className="grid grid-cols-[5rem_1fr] gap-3 items-center w-full">
				<h3 className="text-text-bright text-[32px]">{cl}</h3>

				<div className="ml-4 relative">
					<div
						className={`${cl === topMiss ? 'bg-secondary text-text-dark' : 'bg-dark-2 text-text-bright'} py-3.5 rounded-xl flex items-center justify-end`}
						style={{ width: `${width * 100}%` }}>
						<h3 className={`font-medium text-xl pr-4`}>{votes}</h3>
					</div>
				</div>
			</div>
		)
	})

	return (
		<div className="py-7 flex flex-col items-center">
			<p className="pt-8 mb-5 text-[48px] font-bold text-secondary text-center leading-tight">Подиум</p>

			<div className="w-full border-border-dark-2 border-2 p-1 grid grid-cols-2 h-fit rounded-lg">
				<button
					className={`${selectedTopic === 'miss' ? 'bg-secondary text-text-dark' : 'bg-background text-text-bright'} duration-300 ease-in-out py-4 rounded-2xl`}
					onClick={() => toggleTopicButton('miss')}>
					<h3 className="text-xl">Мисс</h3>
				</button>
				<button
					className={`${selectedTopic === 'class' ? 'bg-secondary text-text-dark' : 'bg-background  text-text-bright'} duration-300 ease-in-out py-4  rounded-2xl`}
					onClick={() => toggleTopicButton('class')}>
					<h3 className="text-xl">Класс</h3>
				</button>
			</div>

			<ul className="w-full absolute bottom-1/2 translate-y-1/2 px-4">
				<Table tableName="Podium">{chart}</Table>
			</ul>

			<footer className="w-full absolute bottom-18 px-4">
				<Button>Переголосовать</Button>
			</footer>
		</div>
	)
}
