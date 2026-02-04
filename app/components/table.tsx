import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface TableProps extends ComponentPropsWithoutRef<'ul'> {
	children: ReactNode[]
	tableName: string
}

export default function Table({ children: childrenArr, className, tableName, ...props }: TableProps) {
	return (
		<ul
			className={`${className} w-full`}
			{...props}>
			{...childrenArr.map((child, index) => {
				return (
					<div
						key={`${tableName}-${index}`}
						className={`${index + 1 != childrenArr.length ? 'border-b border-border-bright-01' : ''} py-4 w-full`}>
						{child}
					</div>
				)
			})}
		</ul>
	)
}
