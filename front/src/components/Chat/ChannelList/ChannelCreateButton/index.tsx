import styled from "styled-components"
import colors from "../../../../utils/colors"

const Style = styled.button`
	
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 30px;
	min-height: 30px;

	padding: 0;

	background-color: ${colors.channelCreateButton};

	&:hover {
		background-color: ${colors.sectionHover};
	}

`


function ChannelCreateButton() {
	return (
		<Style>
			Create
		</Style>
	)
}

export default ChannelCreateButton