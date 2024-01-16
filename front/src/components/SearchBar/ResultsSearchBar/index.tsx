import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState
} from "react"
import axios, { AxiosResponse } from "axios"

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

import { channelIncludeUser, sortChannelByName, sortUserByName } from "../../../utils/functions"

import { Channel, User, UserAuthenticate } from "../../../utils/types"
import { channelStatus } from "../../../utils/status"

import { getRandomStatus } from "../../../temp/temp"

type PropsSearchBar = {
	value: string,
	displayChat: Dispatch<SetStateAction<boolean>>
}

function ResultsSearchBar({ value, displayChat } : PropsSearchBar) {

	const { token } = useContext(AuthContext)!

	function generateResults(results: User[] | Channel[], type: string) {
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
											addChannelToChannelList(result.id)
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
											{(result as Channel).name}
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
											addChannelToChannelList(result.id)
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
											{(result as Channel).name}
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
	const [channels, setChannels] = useState<Channel[]>([])
	const [channelsFound, setChannelsFound] = useState<Channel[]>([])

	const { userAuthenticate, setUserAuthenticate, setChannelTarget } = useContext(InteractionContext)!
	const [errorRequest, setErrorRequest] = useState<boolean>(false)

	async function addUserToFriendList(user: User) {
		try {
			if (!userAuthenticate.friends.some((friend) => friend.id === user.id))
			{
				await axios.post(`http://localhost:3333/friends/${user.id}`, {}, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUserAuthenticate((prevState: UserAuthenticate) => ({
					...prevState,
					friends: [ ...prevState.friends, user]
				}))
			}
		}
		catch (error) {
			setErrorRequest(true)
		}
	}

	async function addChannelToChannelList(channelId: number) {
		try {
			const channelResponse: AxiosResponse<Channel> = await axios.get(`http://localhost:3333/channel/${channelId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			if (!channelIncludeUser(channelResponse.data, userAuthenticate))
			{
				if (channelResponse.data.type === channelStatus.PROTECTED)
					setChannelTarget(channelResponse.data)
				else
				{

					await axios.post(`http://localhost:3333/channel/join`, {
						id: channelResponse.data.id
					},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					})

					setUserAuthenticate((prevState: UserAuthenticate) => ({
						...prevState,
						channels: [ ...prevState.channels, channelResponse.data]
					}))

					setChannelTarget(() => ({
						...channelResponse.data,
						members: [...channelResponse.data.members, userAuthenticate]
					}))
				}
			}
			else
				setChannelTarget(channelResponse.data)
			displayChat(true)
		}
		catch (error) {
			console.log(error)
			setErrorRequest(true)
		}
	}

	useEffect(() => {
		async function fetchUsersAndChannels() {
			try {
				const usersResponse = await axios.get("http://localhost:3333/user", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUsers(usersResponse.data.filter((user: User) => (
					user.username != userAuthenticate.username
				)).map((user: any) => {

					const { wins, draws, losses, ...rest } = user

					return {
						...rest ,
						status: getRandomStatus(),
						scoreResume: {
							wins: wins,
							draws: draws,
							losses: losses
						}
					}
				}).sort(sortUserByName))

				const channelsResponse = await axios.get("http://localhost:3333/channel", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setChannels(channelsResponse.data.sort(sortChannelByName))
			}
			catch (error) {
				setErrorRequest(true)
			}
		}
		fetchUsersAndChannels()
	}, [userAuthenticate])

	useEffect(() => {
		setUsersFound(users.filter((user: User) => user.username.startsWith(value)))
		setChannelsFound(channels.filter((channel: Channel) => channel.name.startsWith(value)))
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
						generateResults(usersFound, "user")
					}
					</>
				}
				{
					channelsFound.length > 0 &&
					<>
					{
						generateResults(channelsFound, "channel")
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