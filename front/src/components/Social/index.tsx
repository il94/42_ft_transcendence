import MediaQuery from 'react-responsive'

import { Style, ReduceButton } from "./style"

import Profile from "../Profile"

import breakpoints from '../../utils/breakpoints'

import reduceIcon from '../../assets/deconnexion.png' // a changer

function Social({ setSocial }: { setSocial?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<div>
				Social
				<MediaQuery query={breakpoints.smallDesktop}>
					<ReduceButton src={reduceIcon} onClick={() => setSocial && setSocial(true)} alt="Reduce button" />
				</MediaQuery>
			</div>
			<Profile />
		</Style>
	)
}

export default Social