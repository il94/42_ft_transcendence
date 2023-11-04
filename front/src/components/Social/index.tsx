import { Style, ReduceButton } from "./style"

function Social({ setSocial }: { setSocial?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<ReduceButton onClick={() => setSocial && setSocial(false)} />
		</Style>
	)
}

export default Social