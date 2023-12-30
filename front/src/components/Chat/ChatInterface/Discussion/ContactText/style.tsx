import styled from "styled-components"
import colors from "../../../../../utils/colors"

export const Style = styled.div<{ $masked: boolean }>`

	display: flex;
	align-items: flex-end;

	min-width: 31px;
	max-width: 182px;

	margin-top: 5px;

	cursor: ${(props) => props.$masked && "pointer"};

	opacity: ${(props) => props.$masked && 0.5};

	user-select: ${(props) => props.$masked ? "none" : "text"};

	&:hover {
		opacity: ${(props) => props.$masked && 0.7};
	}

`

export const Avatar = styled.img`
	
	width: 20px;
	height: 20px;
	min-width: 20px;
	min-height: 20px;

	margin-left: 3px;
	
	border-radius: 50%;

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

export const Text = styled.p<{ $masked: boolean }>`

	min-height: 15px;

	padding-left: 3px;
	padding-right: 2px;
	padding-top: 2px;
	padding-bottom: 1px;

	font-size: 10px;
	user-select: ${(props) => !props.$masked && "text"};
	word-break: break-all;

	color: ${colors.textAlt};
	background-color: ${colors.messageFriend};

`

export const MaskedMessage = styled.p`

	min-width: 105px;
	min-height: 15px;

	margin-left: auto;

	padding-left: 3px;
	padding-right: 2px;
	padding-top: 2px;
	padding-bottom: 1px;

	font-size: 10px;

	color: ${colors.textAlt};
	background-color: ${colors.messageFriend};

`