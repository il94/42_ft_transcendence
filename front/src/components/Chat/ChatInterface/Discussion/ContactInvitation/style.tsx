import styled from "styled-components"
import colors from "../../../../../utils/colors"

export const Style = styled.div`

	display: flex;
	align-items: flex-end;

	width: 208px;
	min-width: 208px;
	max-height: 52.5px;
	min-height: 35px;

	margin-top: 5px;
	padding-left: 3px;

`

export const Avatar = styled.img`
	
	width: 20px;
	height: 20px;
	min-width: 20px;
	min-height: 20px;

	border-radius: 50%;

`

export const InvitationContent = styled.div`

	width: 180px;
	height: 100%;
	min-width: 180px;

	margin-left: 3px;

`

export const Text = styled.div`

	width: 100%;
	height: 50%;

	padding-left: 3px;
	padding-right: 2px;
	padding-top: 2px;
	padding-bottom: 1px;

	text-align: center;
	font-size: 10px;

	color: ${colors.textAlt};
	background-color: ${colors.messageUser};

`

export const ButtonsWrapper = styled.div`

	display: flex;

	width: 185px;
	height: 50%;

`

export const Button = styled.button`

	width: 100%;
	height: 100%;

	border: 0;

	font-size: 10px;
	
	background-color: ${(props) => props.color};

`