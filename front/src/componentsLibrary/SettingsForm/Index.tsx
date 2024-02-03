import styled from 'styled-components'

import colors from '../../utils/colors'

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

export const VerticalSetting = styled.div<{ fontSize?: number, $alignItems?: string }>`

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: ${(props) => props.$alignItems ? props.$alignItems : "center" };

	width: 90%;

	text-align: center;
	font-size: ${(props) => props.fontSize && props.fontSize }px;

`

export const VerticalSettingWrapper = styled.div<{ $alignItems?: string }>`

	display: flex;
	flex-direction: column;
	align-items: ${(props) => props.$alignItems ? props.$alignItems : "center" };

	width: 100%;
	/* height: 100%; */

`

export const HorizontalSettingsForm = styled.form`

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	width: 100%;
	height: 100%;

	margin-top: 1%;
	margin-bottom: 2%;

`

export const HorizontalSetting = styled.div<{ $disable?: boolean }>`

	display: flex;
	justify-content: space-between;

	width: 96%;

`

export const HorizontalSettingWrapper = styled.div<{ width?: number }>`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: ${(props) => props.width && props.width}px;

`

export const ErrorMessage = styled.p<{ width?: number, fontSize?: number }>`

	width: ${(props) => props.width ? props.width + "px" : "100%" };
	height: 15px;
	min-height: 15px;

	font-size: ${(props) => props.fontSize ? props.fontSize : 12 }px;
	text-align: center;

	color: ${colors.textError};

`
