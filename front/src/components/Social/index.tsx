import MediaQuery from 'react-responsive'

import { Style, ReduceButton } from "./style"

import Profile from "../Profile"

import breakpoints from '../../utils/breakpoints'

function Social({ setSocial }: { setSocial?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>

			<MediaQuery query={breakpoints.smallDesktop}>
				<ReduceButton onClick={() => setSocial && setSocial(true)} />
			</MediaQuery>

			<MediaQuery query={breakpoints.bigDesktop}>
				{/* temporaire */}
				<div />
			</MediaQuery>
			
			<Profile />
		</Style>
	)
}

export default Social