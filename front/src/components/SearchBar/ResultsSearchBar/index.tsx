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
	GroupName,
	NoResult,
	Result,
	ResultsWrapper,
	Style
} from "./style"

import ScrollBar from "../../../componentsLibrary/ScrollBar"
import ErrorRequest from "../../../componentsLibrary/ErrorRequest"

import AuthContext from "../../../contexts/AuthContext"
import InteractionContext from "../../../contexts/InteractionContext"

import { sortChannelByName, sortUserByName } from "../../../utils/functions"

import { ChannelData, User } from "../../../utils/types"
import { channelStatus } from "../../../utils/status"

import { getRandomStatus } from "../../../temp/temp"

type PropsSearchBar = {
	value: string,
	displayChat: Dispatch<SetStateAction<boolean>>
}

function ResultsSearchBar({ value, displayChat } : PropsSearchBar) {

	const { token } = useContext(AuthContext)!

	function generateResults(results: User[] | ChannelData[], type: string, littleResults: boolean) {
		return (
			<Group>
				<GroupName>
					{
					type === "user" ?
					<>
						USERS
					</>
					:
					<>
						CHANNELS
					</>
				}
				</GroupName>
				{
					results.length > 3 ?
					<ResultsWrapper>
						<ScrollBar>
						{
							results.map((result, index) => (
								<Result
									key={`${type}_result` + index} // a definir
									onClick={() => {
										type === "user" ?
											addUserToFriendList(result as User)
											:
											addChannelToChannelList(result as ChannelData)
										}
									}
									$noAvatar={littleResults}>
									{
										!littleResults &&
										<AvatarResult src={result.avatar} />
									}
									{
										type === "user" ?
										<>
											{(result as User).username}
										</>
										:
										<>
											{(result as ChannelData).name}
										</>
									}
								</Result>
							))
						}
						</ScrollBar>
					</ResultsWrapper>
					:
					<>
						{
							results.map((result, index) => (
								<Result
									key={`${type}_result` + index} // a definir
									onClick={() => {
										type === "user" ?
											addUserToFriendList(result as User)
											:
											addChannelToChannelList(result as ChannelData)
										}
									}
									$noAvatar={littleResults}>
									{
										!littleResults &&
										<AvatarResult src={result.avatar} />
									}
									{
										type === "user" ?
										<>
											{(result as User).username}
										</>
										:
										<>
											{(result as ChannelData).name}
										</>
									}
								</Result>
							))
						}
					</>
			}
			</Group>
		)
	}

	const [users, setUsers] = useState<User[]>([])
	const [usersFound, setUsersFound] = useState<User[]>([])
	const [channels, setChannels] = useState<ChannelData[]>([])
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

				const userResponse = await axios.get("http://localhost:3333/user", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUsers(userResponse.data.filter((user: User) => (
					user.username != userAuthenticate.username
				)).map((user: any) => ({
					// temporaire
					// En attendant de pouvoir tester avec plusieurs Users
					// Wins Draws et Looses en trop !
					...user ,
					status: getRandomStatus(),
					scoreResume: {
						wins: user.wins,
						draws: user.draws,
						losses: user.losses
					}
				})).sort(sortUserByName))

				const channelsResponse = await axios.get("http://localhost:3333/channel", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setChannels(channelsResponse.data.filter((channel: ChannelData) => (
					channel.type !== channelStatus.PRIVATE && channel.type !== channelStatus.MP
				)).sort(sortChannelByName))
			}
			catch (error) {
				setErrorRequest(true)
			}
		}
		fetchUsersAndChannels()
	}, [userAuthenticate])

	useEffect(() => {
		setUsersFound(users.filter((user: User) => user.username.startsWith(value)))
		setChannelsFound(channels.filter((channel: ChannelData) => channel.name.startsWith(value)))
	}, [value])

	useEffect(() => {
		setUsersFound(users)
		setChannelsFound(channels)
	}, [users, channels])

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
		}
	})

	return (
		<Style ref={resultsSearchBarRef}>
			{
				!errorRequest ?
				<>
				{
					usersFound.length > 0 &&
					<>
					{
						generateResults(usersFound, "user", littleResults)
					}
					</>
				}
				{
					channelsFound.length > 0 &&
					<>
					{
						generateResults(channelsFound, "channel", littleResults)
					}
					</>
				}
				{
					usersFound.length === 0 && channelsFound.length === 0 &&
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