 
import styled from 'styled-components';


const Style = styled.div`
	position: absolute;
	
	width: 30px;
	height: 30px;
	
	top: 50%;
	left: 50%;

	transform: translate(-50%, -50%);


	background-color: white

`

function Ball() {

	return (
		<Style />
	);
}

export default Ball