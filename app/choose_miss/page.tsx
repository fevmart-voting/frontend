'use client'

import { useEffect, useState } from 'react'
import Table from '../components/table'
import Button from '../components/button'
import { useAuthKey } from '../contexts/authStringContext';
import { useRouter } from 'next/navigation';
import { castVote } from '../api/voteApi'
import { chooseMissOptions, optionContent } from '../config/options'
import { toast } from "react-toastify";


export default function ChooseMiss() {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { authKey, clearAuthKey } = useAuthKey();
	const router = useRouter();

	const selectedOption = selectedIndex !== null ? selectedIndex + 1 : null;

	const toggleCheckbox = (index: number) => {
		setSelectedIndex(selectedIndex === index ? null : index)
	}

	const handleSubmit = async () => {
		if (isLoading) return;

		if (selectedOption === null) {
			toast.error("Вы не выбрали вариант!");
			return;
		}
		if (!authKey) {
			toast.error("Вы перейшли не по QR коду, либо он уже использован!");
			return;
		}
		setIsLoading(true);
		try {
			const res = await castVote(authKey, 'miss-fevmart', selectedOption);
			if (res.ok) {
				toast.success("Голос принят! Переход...");
				setTimeout(() => {
					router.push('/');
				}, 800);
				clearAuthKey()
			} else {
				toast.error("Обновите старницу или же QR уже использован!");
			}
		} catch (err) {
			toast.error("Обновите старницу или же QR уже использован!");
		}
	};

	const options = chooseMissOptions.map(({ cl, name }: optionContent, index) => {
		return (
			<div
				className={`grid grid-cols-[6.5rem_1fr_auto] items-center w-full`}
				key={`Miss-Option-${index}`}>
				<h3 className={`text-bright pr-2 text-4xl`}>{cl}</h3>
				<h4 className="text-bright text-2xl font-light">{name}</h4>

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
		<div className="py-7 flex flex-col items-center absolute bottom-1/2 translate-y-1/2 left-0 px-[max(4vw,4rem)] w-full">
			<h1 className="text-3.5xl mb-16 font-bold text-secondary text-center leading-tight">Выберите Мисс ФевМарт</h1>

			<div className="w-full">
				<div className="w-full">
					<Table tableName="chooseClass">{options}</Table>
				</div>

				<div className="absolute -bottom-20 left-0 w-full px-[max(4vw,4rem)]">
					<Button onClick={handleSubmit}>Продолжить</Button>
				</div>
			</div>
		</div>
	)
}