import { Dispatch, SetStateAction, useEffect } from "react"

import { Style } from "./style"

import Section, { SectionName } from "../../../componentsLibrary/Section"

import { Channel } from "../../../utils/types"

import DefaultChannelPicture from "../../../assets/default_channel.png"

// type PropsSecondaryMenuContextual = {
// 	secondary: boolean,
// 	displaySecondary: Dispatch<SetStateAction<boolean>>,
// 	secondaryPosition: {
// 		top: number,
// 		left: number
// 	},
// 	setSecondaryHeight: Dispatch<SetStateAction<number>>,
// }

type PropsSecondaryMenuContextual = {
	contextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	offset: number
}


function SecondaryMenuContextual({ contextualMenuPosition, offset } : PropsSecondaryMenuContextual) {
	// function SecondaryMenuContextual({ secondary, displaySecondary, secondaryPosition, setSecondaryHeight } : PropsSecondaryMenuContextual) {

	/* ============ Temporaire ============== */

	// Recup les Channels Publics et Protecteds du User authentifie avec un truc du style
	// axios.get("http://localhost:3333/user&id=?/channels")

	const channels: Channel[] = [
		{
			id: 1,
			name: "Public 1",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 2,
			name: "Public 2",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 3,
			name: "Public 3",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 4,
			name: "Public 4",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 5,
			name: "Protected 1",
			avatar: DefaultChannelPicture,
			type: "protected"
		},
		{
			id: 6,
			name: "Protected 2",
			avatar: DefaultChannelPicture,
			type: "protected"
		},
		{
			id: 7,
			name: "Protected 3",
			avatar: DefaultChannelPicture,
			type: "protected"
		}
	]

	/* ============================================== */

	// useEffect(() => {
	// 	setSecondaryHeight(channels.length * 35)
	// }, [])


	return (
		<Style
			$left={contextualMenuPosition.left}
			$right={contextualMenuPosition.right}
			$top={contextualMenuPosition.top}
			$bottom={contextualMenuPosition.bottom}
			$offset={offset}>

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



	// return (
	// 	<Style /* onMouseLeave={() => displaySecondary(false)}
	// 		$top={secondaryPosition.top} $left={secondaryPosition.left} */>
	// 	{
	// 		channels.map((channel) => (
	// 			<Section key={"channelSection" + channel.id}>
	// 				<SectionName> 
	// 					{channel.name}
	// 				</SectionName>
	// 			</Section>
	// 		))
	// 	}
	// 	</Style>
	// )
}

export default SecondaryMenuContextual