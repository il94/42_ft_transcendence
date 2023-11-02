import MediaQuery from 'react-responsive'

import { Style, ReduceButton, TopWrapper } from "./style"

import Profile from "../Profile"

import breakpoints from '../../utils/breakpoints'

import reduceIcon from '../../assets/deconnexion.png' // a changer

function Social({ setSocial }: { setSocial?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>

			<MediaQuery query={breakpoints.smallDesktop}>
				<TopWrapper>
					<ReduceButton src={reduceIcon} onClick={() => setSocial && setSocial(true)} alt="Reduce button" />
				</TopWrapper>
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