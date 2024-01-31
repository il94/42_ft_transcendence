import styled from 'styled-components'
import colors from '../../utils/colors'

export const HorizontalSettingsForm = styled.form`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 100%;

	margin-top: 10px;
	margin-bottom: 20px;

`


export const HorizontalSetting = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 100%;

	text-align: center;
	font-size: 20px;

`

export const HorizontalSettingWrapper = styled.div<{ $width?: number }>`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: ${(props) => props.$width && props.$width}px;

`

export const VerticalSettingsForm = styled.form`

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	width: 100%;
	height: 100%;

	margin-top: 1%;
	margin-bottom: 2%;

`

export const VerticalSetting = styled.div<{ $disable?: boolean }>`

	display: flex;
	justify-content: space-between;

	width: 96%;

`

export const VerticalSettingWrapper = styled.div`

	display: flex;
	flex-direction: column;
	align-items: end;
`

export const ErrorMessage = styled.p<{ width?: number, fontSize?: number }>`

	width: ${(props) => props.width ? props.width + "px" : "100%" };
	height: 15px;
	min-height: 15px;

	font-size: ${(props) => props.fontSize ? props.fontSize : 12 }px;
	text-align: center;

	color: ${colors.textError};

`
