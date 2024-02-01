import {
	useEffect,
	useState
} from "react"

import styled from "styled-components"

const Style = styled.div<{ $size: number, $backgroundColor?: string }>`
	
	display: flex;
	justify-content: space-evenly;

	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	width: ${(props) => props.$size}px;
	height: ${(props) => props.$size / 10 + (props.$size / 100 * 7.5)}px;

	background-color: ${(props) => props.$backgroundColor && props.$backgroundColor};

	@keyframes moveUpDown {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: ${(props) => `translateY(${props.$size / 100 * 7.5}px)`};
		}
	}

	.delay_1 {
		animation-delay: 0.2s;
	}

	.delay_2 {
		animation-delay: 0.4s;
	}
`

const Point = styled.div<{ $size: number, $color?: string }>`
	
	width: ${(props) => props.$size / 10 }px;
	height: ${(props) => props.$size / 10 }px;

	background-color: ${(props) => props.$color ? props.$color : "white" };

	animation: moveUpDown 1.5s ease-in-out infinite;

`

type LoaderProps = {
	size: number,
	color?: string,
	backgroundColor?: string
}

function Loader({ size, color, backgroundColor } : LoaderProps) {

	const [loader, displayLoader] = useState<boolean>(false)

	useEffect(() => {
		const timeout = setTimeout(() => {
			displayLoader(true)
		}, 500)

		return () => clearTimeout(timeout)
	}, [])

	return (
		loader ?
		<Style $size={size} $backgroundColor={backgroundColor}>
			<Point $size={size} $color={color} />
			<Point className="delay_1" $size={size} $color={color} />
			<Point className="delay_2" $size={size} $color={color} />
		</Style>
		:
		null
	)
}

export default Loader