import { Button, Interface, Style } from "./style"

function SocialReduce({ setSocial }: { setSocial?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<Interface />
			<Button onClick={() => setSocial && setSocial(false)}/>
		</Style>
	)
}

export default SocialReduce