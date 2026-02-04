'use client'

import { useMemo, useState } from 'react'
import Button from '@/app/components/button'
import Table from '../components/table'

interface DataEntry {
	title: string
	votes: number
}

const CLASS_VOTES: DataEntry[] = [
	{ title: '10A', votes: 63 },
	{ title: '10Б', votes: 69 },
	{ title: '10В', votes: 52 },
	{ title: '10Г', votes: 67 },
	{ title: '10Д', votes: 65 },
]

const PERSON_VOTES: DataEntry[] = [
	{ title: '10A', votes: 50 },
	{ title: '10Б', votes: 56 },
	{ title: '10В', votes: 69 },
	{ title: '10Г', votes: 71 },
	{ title: '10Д', votes: 70 },
]

type tabOptions = 'miss' | 'class'

export default function Podium() {
	const [selectedTopic, setSelectedTopic] = useState<tabOptions>('miss')

	const toggleTopicButton = (topic: tabOptions) => {
		setSelectedTopic(() => topic)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { sortedData, q, d } = useMemo(() => {
		const rawData = selectedTopic === 'miss' ? PERSON_VOTES : CLASS_VOTES
		const sorted = [...rawData].sort((a, b) => b.votes - a.votes)

		const qVal = sorted.length > 0 ? sorted[sorted.length - 1].votes : 0
		const wVal = sorted.length > 0 ? sorted[0].votes : 0
		const dVal = wVal - qVal

		return { sortedData: sorted, q: qVal, d: dVal }
	}, [selectedTopic])

	const calculateWidth = (votes: number) => {
		return (votes / sortedData[0]?.votes) * 100 // get percentage of max width
	}

	const winnerTitle = sortedData[0]?.title

	const chart = sortedData.map(({ title, votes }: DataEntry) => {
		const width = calculateWidth(votes)
		const isWinner = title === winnerTitle

		return (
			<div
				key={title}
				className="grid grid-cols-[6ch_1fr] gap-[clamp(12px,4vw,24px)] items-center w-full">
				<h3 className="text-text-bright text-4xl">{title}</h3>

				<div className="relative">
					<div
						className={`${isWinner ? 'bg-secondary text-text-dark' : 'bg-dark-2 text-text-bright'} py-3.5 rounded-xl flex items-center justify-end`}
						style={{ width: `${width}%` }}>
						<h3 className={`font-medium text-xl pr-4`}>{votes}</h3>
					</div>
				</div>
			</div>
		)
	})

	return (
		<div className="py-7 flex flex-col items-center">
			<div className="w-full absolute bottom-[55dvh] translate-y-1/2 px-[max(4vw,2rem)]">
				<p className="pt-8 mb-5 text-[48px] font-bold text-secondary text-center leading-tight">Подиум</p>

				<div className="w-full border-border-dark-2 border-2 p-1 grid grid-cols-2 h-fit rounded-lg mb-10">
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

				<Table tableName="Podium">{chart}</Table>
			</div>

			<footer className="w-full absolute bottom-18 px-[max(4vw,2rem)]">
				<Button>Переголосовать</Button>
			</footer>
		</div>
	)
}
