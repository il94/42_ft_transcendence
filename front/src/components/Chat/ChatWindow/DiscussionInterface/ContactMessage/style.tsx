import styled from "styled-components"
import colors from "../../../../../utils/colors"

export const Style = styled.div`

	display: flex;
	align-items: flex-end;

	min-width: 31px;
	max-width: 182px;
	min-height: 29px;

	margin-top: 5px;
`

export const ProfilePicture = styled.div`
	
	width: 20px;
	height: 20px;
	min-width: 20px;
	min-height: 20px;

	margin-left: 3px;
	
	border-radius: 50%;

	background-color: ${colors.profilePicture};

`

export const MessageContent = styled.div`

	display: flex;
	flex-direction: column;

	min-width: 8px;
	max-width: 159px;

	margin-left: 3px;

`

export const UserName = styled.div`

	height: 14px;

	padding-left: 3px;
	padding-right: 2px;
	padding-top: 1px;
	padding-bottom: 2px;

	font-size: 9px;
	font-weight: bold;

	color: ${colors.textAlt};
	background-color: ${colors.messageBanner};

`

export const Text = styled.p`

	min-height: 15px;

	padding-left: 3px;
	padding-right: 2px;
	padding-top: 2px;
	padding-bottom: 1px;

	font-size: 10px;

	color: ${colors.textAlt};
	background-color: ${colors.messageFriend};

`