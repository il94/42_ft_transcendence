import styled from 'styled-components'
import colors from '../../utils/colors'

const ErrorMessage = styled.p`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 15px;
	min-height: 15px;

	font-size: 12px;
	text-align: center;

	color: ${colors.textError};

`

export default ErrorMessage