import Logo from '@/app/icons/logo.svg'
import { Grid } from 'react-loader-spinner'
export default function Loading() {
	return (
		<div className="px-6 py-7 flex flex-col items-center">
			<div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center">
				<div className="mb-25">
					<Grid
						visible={true}
						height="120"
						width="120"
						color="#FF991C"
						ariaLabel="grid-loading"
						radius="12.5"
						wrapperStyle={{}}
						wrapperClass="grid-wrapper"
					/>
				</div>

				<p className="text-center text-bright text-4xl">Голосование ещё не началось, пожалуйста подождите...</p>
			</div>
		</div>
	)
}
