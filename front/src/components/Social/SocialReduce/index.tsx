import { ReduceButton, Interface, Style } from "./style"

function SocialReduce({ setReduce }: { setReduce?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<Interface />
			<ReduceButton	onClick={() => setReduce && setReduce(false)}
							title="Extend" />
		</Style>
	)
}

export default SocialReduce