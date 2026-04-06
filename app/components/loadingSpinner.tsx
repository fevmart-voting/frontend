import { Grid } from 'react-loader-spinner';


export default function LoadingSpinner(){
    return (
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
	)
}