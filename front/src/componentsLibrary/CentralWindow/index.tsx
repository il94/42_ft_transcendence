import styled from 'styled-components'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

const CentralWindow = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	width: 420px;

	padding-left: 5px;
	padding-right: 5px;

	clip-path: ${effects.pixelateWindow};

	background-color: ${colors.popup};

`

export default CentralWindow