import { Dispatch, SetStateAction, useEffect } from "react"

import { Style } from "./style"

import Section from "../../../componentsLibrary/Section"
import SectionName from "../../../componentsLibrary/SectionName/SectionName"

import { Channel } from "../../../utils/types"

import DefaultChannelPicture from "../../../assets/default_channel.png"

type PropsSecondaryMenuContextual = {
	secondary: boolean,
	displaySecondary: Dispatch<SetStateAction<boolean>>,
	secondaryTop: number,
	setSecondaryHeight: Dispatch<SetStateAction<number>>,
}

function SecondaryMenuContextual({ secondary, displaySecondary, secondaryTop, setSecondaryHeight } : PropsSecondaryMenuContextual) {

	/* ============ Temporaire ============== */

	// Recup les Channels Publics et Protecteds du User authentifie avec un truc du style
	// axios.get("http://localhost:3333/user&id=?/channels")

	const channels: Channel[] = [
		{
			id: 1,
			name: "Public 1",
			picture: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 2,
			name: "Public 2",
			picture: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 3,
			name: "Public 3",
			picture: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 4,
			name: "Public 4",
			picture: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 5,
			name: "Protected 1",
			picture: DefaultChannelPicture,
			type: "protected"
		},
		{
			id: 6,
			name: "Protected 2",
			picture: DefaultChannelPicture,
			type: "protected"
		},
		{
			id: 7,
			name: "Protected 3",
			picture: DefaultChannelPicture,
			type: "protected"
		}
	]

	/* ============================================== */

	useEffect(() => {
		setSecondaryHeight(channels.length * 35)
	}, [])

	return ( secondary &&
		<Style onMouseLeave={() => displaySecondary(false)}
			$top={secondaryTop}>
		{
			channels.map((channel) => (
				<Section key={"channelSection" + channel.id}>
					<SectionName> 
						{channel.name}
					</SectionName>
				</Section>
			))
		}
		</Style>
	)
}

export default SecondaryMenuContextual