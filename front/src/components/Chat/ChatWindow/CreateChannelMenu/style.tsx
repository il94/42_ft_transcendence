import styled from "styled-components"
import colors from "../../../../utils/colors"
import effects from "../../../../utils/effects"

export const Style = styled.div`

	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;

`

export const CreateChannelForm = styled.form`

	display: flex;
	flex-direction: column;

`

export const Setting = styled.div`

	display: flex;
	justify-content: space-evenly;
	align-items: center;
	
	height: 30px;

	margin-bottom: 12.2px;

`

export const SettingTtile = styled.p<{ $disable?: boolean }>`

	margin-left: 5px;
	margin-right: auto;

	text-align: center;
	font-weight: bold;
	font-size: 15px;

	color: ${(props) => props.$disable && colors.textBlocked};

`

export const ChannelName = styled.input<{ $disable?: boolean }>`

	align-self: center;

	max-width: 120px;

	margin-left: auto;
	margin-right: 10px;

	border: none;
	border-bottom: 1px solid ${(props) => props.$disable && colors.textBlocked};

	cursor: ${(props) => props.$disable && "default"};

	font-size: 16px;
	text-align: center;

	color: ${(props) => props.$disable && colors.textBlocked};
	background-color: transparent;

	&:focus {
		outline: none;
		border-color: ${(props) => props.$disable ? colors.textBlocked : colors.focusBorderText};
	}

`

export const AvatarWrapper = styled.div`
	
	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 155px;
	/* height: 30px; */

	margin-left: auto;
	margin-right: auto;

`

export const Avatar = styled.label<{src: string}>`

	position: relative;

	width: 40px;
	height: 40px;
	min-width: 40px;
	min-height: 40px;

	border: none;
	border-radius: 50%;

	background-image: url(${(props) => props.src});
	background-size: cover;

	&:hover {
		cursor: pointer;
		filter: brightness(70%);
		background-color: rgba(0, 0, 0, 0.5);

		&::after {
			content: 'Upload';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			font-size: 9px;
      		font-weight: bold;

		}
	}

`

export const ButtonsWrapper = styled.div`

	display: flex;
	justify-content: space-evenly;

	height: 32px;
	margin-bottom: 12.2px;

`
