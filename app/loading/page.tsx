'use client'

import { Grid } from 'react-loader-spinner';
import { useSearchParams, useRouter } from 'next/navigation';
import { getStats } from '../api/voteApi';
import { useEffect } from 'react';
import { useAuthKey } from '../contexts/authStringContext';


export default function Loading() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { setAuthKey } = useAuthKey();

	useEffect(() => {

		const auth_string = searchParams.get('auth_string');
		if (!auth_string) {
			return
		}

		setAuthKey(auth_string);

		const fetchElections = async () => {
			try {
				const bestClassElectionData = await getStats("best-class");
				const missFevmartElectionData = await getStats("miss-fevmart");
				if (!bestClassElectionData || !missFevmartElectionData) {
					return;
				}
				router.push('/choose_class');
			} catch (error) {
				console.error(error);
			};
		}
		fetchElections(); 
	}, []);

	return (
		<div className="px-6 py-7 flex flex-col items-center">
			<div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center">
				<div className="mb-25">
					<Grid
						visible={true}
						height="120"
						width="120"
						color="#CAF247"
						ariaLabel="grid-loading"
						radius="12.5"
						wrapperStyle={{}}
						wrapperClass="grid-wrapper"
					/>
				</div>

				<p className="text-center text-bright text-2xl">Голосование ещё не началось, пожалуйста подождите и обновите страницу...</p>
			</div>
		</div>
	);
}