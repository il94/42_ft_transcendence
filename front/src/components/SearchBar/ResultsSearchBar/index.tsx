import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState
} from "react"
import axios from "axios"

import {
	AvatarResult,
	Group,
	NoResult,
	Result,
	Style
} from "./style"

import ErrorRequest from "../../../componentsLibrary/ErrorRequest"

import InteractionContext from "../../../contexts/InteractionContext"

import { ChannelData, User } from "../../../utils/types"
import { channelStatus } from "../../../utils/status"

import { getRandomStatus, getTempChannels } from "../../../temp/temp"

type PropsSearchBar = {
	displayChat: Dispatch<SetStateAction<boolean>>
}

function ResultsSearchBar({ displayChat } : PropsSearchBar) {

	const [usersFound, setUsersFound] = useState<User[]>([])
	const [channelsFound, setChannelsFound] = useState<ChannelData[]>([])

	const { userAuthenticate, setChannelTarget } = useContext(InteractionContext)!
	const [errorRequest, setErrorRequest] = useState<boolean>(false)

	async function addUserToFriendList(user: User) {
		try {
			if (!userAuthenticate.friends.includes(user))
			{
				/* ============ Temporaire ============== */

				// axios.post("http://localhost:3333/user/me/friends/${user.id}") 

				/* ============================================== */

				userAuthenticate.friends.push(user)
			}
		}
		catch (error) {
			setErrorRequest(true)
		}
	}

	async function addChannelToChannelList(channel: ChannelData) {
		try {
			if (!channel.users.includes(userAuthenticate))
			{
				/* ============ Temporaire ============== */

				// axios.post("http://localhost:3333/user/me/channels/${channel.id")

				/* ============================================== */

				channel.users.push(userAuthenticate)
				userAuthenticate.channels.push(channel)
			}
			setChannelTarget(channel)
			displayChat(true)
		}
		catch (error) {
			setErrorRequest(true)
		}
	}

	useEffect(() => {
		async function fetchUsersAndChannels() {
			try {

				/* ============ Temporaire ============== */

				const response = await axios.get("http://localhost:3333/user")
				// const response = await axios.get("http://localhost:3333/user/search")

				/* ============================================== */

				setUsersFound(response.data.filter((user: User) => (
					user.username != userAuthenticate.username
				)).map((user: User) => ({
					// temporaire
					// retirer map quand la route retournera le status et le score resume
					...user ,
					status: getRandomStatus(),
					scoreResume: {
						wins: 0,
						draws: 0,
						looses: 0
					}
				})).slice(0, 3))

				/* ============ Temporaire ============== */

				// const channels = await axios.get("http://localhost:3333/channel/search")

				const tempResponse: ChannelData[] = getTempChannels(userAuthenticate)

				/* ============================================== */

				setChannelsFound(tempResponse.filter((channel: ChannelData) => (
					channel.type !== channelStatus.PRIVATE && channel.type !== channelStatus.MP
				)))
			}
			catch (error) {
				setErrorRequest(true)
			}
		}
		fetchUsersAndChannels()
	}, [userAuthenticate])

	const resultsSearchBarRef = useRef<HTMLDivElement>(null)
	const [littleResults, setLittleResults] = useState<boolean>(true)

	useEffect(() => {
		const resultsSearchBarContainer: HTMLDivElement | null = resultsSearchBarRef.current
		if (resultsSearchBarContainer)
		{
			if (resultsSearchBarContainer.getBoundingClientRect().width < 152)
				setLittleResults(true)
			else
				setLittleResults(false)
			console.log(resultsSearchBarContainer.getBoundingClientRect().width)
		}
	})

	return (
		<Style ref={resultsSearchBarRef}>
			{
				!errorRequest ?
				<>
				{
					usersFound.length > 0 &&
					<Group>
						USERS
					</Group>
				}
				{
					littleResults ?	
					usersFound.map((user, index) => (
						<Result
							key={"user_result" + index} // a definir
							onClick={() => addUserToFriendList(user)}>
							{user.username}
						</Result>
					))
					:
					usersFound.map((user, index) => (
						<Result
							key={"user_result" + index} // a definir
							onClick={() => addUserToFriendList(user)}>
								<AvatarResult src={user.avatar} />
							{user.username}
						</Result>
					))
				}
				{
					channelsFound.length > 0 &&
					<Group>
						CHANNELS
					</Group>
				}
				{
					channelsFound.map((channel, index) => (
						<Result
							key={"channel_result" + index} // a definir
							onClick={() => addChannelToChannelList(channel)}>
							<AvatarResult src={channel.avatar} />
							{channel.name}
						</Result>
					))
				}
				{
					usersFound.length > 0 && channelsFound.length > 0 &&
					<NoResult>
						No result found
					</NoResult>
				}
				</>
				:
				<ErrorRequest />
			}
		</Style>
	)
}

export default ResultsSearchBar