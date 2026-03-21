'use client'

import React, { useState } from 'react'
import QrGenratorInPDF from '../helpers/genQrInPDF'


export default function GenQRPage () {
    const [qrCodesAmount, setQrCodesAmount] = useState(100);

    return(
		<div className='flex h-screen items-center justify-center'>
			<div className=' bg-dark-2 p-4 rounded-xl border border-border-dark-2'>
				<input
					type="number"
					min="1"
					defaultValue={100}
					value={qrCodesAmount}
					onChange={e => setQrCodesAmount(parseInt(e.target.value) || 1)}
					className="w-full px-2 py-1 rounded bg-dark border border-border-bright-01 text-text-bright"
				/>
				<button
					onClick={() => QrGenratorInPDF(qrCodesAmount)}
					className="w-full bg-bright text-dark font-bold py-2 px-3 rounded">
					Скачать QR-коды (PDF)
				</button>
			</div>
		</div>
    )
}