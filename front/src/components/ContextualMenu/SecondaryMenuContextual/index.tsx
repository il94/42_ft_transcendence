import { Dispatch, SetStateAction } from "react"

import { Style } from "./style"

import ScrollBar from "../../../componentsLibrary/ScrollBar"
import Section, { SectionName } from "../../../componentsLibrary/Section"

import { Channel } from "../../../utils/types"

import DefaultChannelPicture from "../../../assets/default_channel.png"

type PropsSecondaryMenuContextual = {
	displaySecondaryContextualMenu: Dispatch<SetStateAction<boolean>>,
	secondaryContextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	secondaryContextualMenuHeight: number
}


function SecondaryMenuContextual({ displaySecondaryContextualMenu, secondaryContextualMenuPosition, secondaryContextualMenuHeight } : PropsSecondaryMenuContextual) {

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

	return (
		<Style
			onMouseLeave={() => displaySecondaryContextualMenu(false)}
			$left={secondaryContextualMenuPosition.left}
			$right={secondaryContextualMenuPosition.right}
			$top={secondaryContextualMenuPosition.top}
			$bottom={secondaryContextualMenuPosition.bottom}
			$height={secondaryContextualMenuHeight}>
			<ScrollBar>
			{
				channels.map((channel, index) => (
					<Section key={"channelSection" + index}>
						<SectionName> 
							{channel.name}
						</SectionName>
					</Section>
				))
			}
			</ScrollBar>
		</Style>
	)
}

export default SecondaryMenuContextual