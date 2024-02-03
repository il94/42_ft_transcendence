import {
	ValidationOptions,
	ValidateBy,
	buildMessage
  } from 'class-validator';
  
export function ContainsUppercase(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: 'ContainsUppercase',
			validator: {
				validate(value: string) {
					return (/[A-Z]/.test(value));
				},
				defaultMessage: buildMessage(
					eachPrefix =>
						`${eachPrefix}$property must contain one uppercase`,
						validationOptions,
				),
			},
		},
		validationOptions,
	);
}

export function ContainsLowercase(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: 'ContainsLowercase',
			validator: {
				validate(value: string) {
					return (/[a-z]/.test(value));
				},
				defaultMessage: buildMessage(
					eachPrefix =>
						`${eachPrefix}$property must contain one lowercase`,
						validationOptions,
				),
			},
		},
		validationOptions,
	);
}

export function ContainsNumber(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: 'ContainsNumber',
			validator: {
				validate(value: string) {
					return (/\d/.test(value));
				},
				defaultMessage: buildMessage(
					eachPrefix =>
						`${eachPrefix}$property must contain one number`,
						validationOptions,
				),
			},
		},
		validationOptions,
	);
}

export function ContainsSpecialCharacter(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: 'ContainsSpecialCharacter',
			validator: {
				validate(value: string) {
					return (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value));
				},
				defaultMessage: buildMessage(
					eachPrefix =>
						`${eachPrefix}$property must contain one special character`,
						validationOptions,
				),
			},
		},
		validationOptions,
	);
}