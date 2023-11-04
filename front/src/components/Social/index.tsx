import { Style, ReduceButton } from "./style"

function Social({ setReduce }: { setReduce?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<ReduceButton	onClick={() => setReduce && setReduce(true)}
							title="Reduce" />
		</Style>
	)
}

export default Social