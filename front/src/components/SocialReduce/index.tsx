import { ReduceButton, Interface, Style } from "./style"

function SocialReduce({ setReduce }: { setReduce?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<Interface />
			<ReduceButton onClick={() => setReduce && setReduce(false)}/>
		</Style>
	)
}

export default SocialReduce