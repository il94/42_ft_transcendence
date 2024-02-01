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

export function IsEmail(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: 'IsEmail',
			validator: {
				validate(value: string) {
					return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
				},
				defaultMessage: buildMessage(
					eachPrefix =>
						`${eachPrefix}$property must be a valid email`,
						validationOptions,
				),
			},
		},
		validationOptions,
	);
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: 'IsPhoneNumber',
			validator: {
				validate(value: string) {
					return (/^(?:\+(?:[0-9] ?){6,14}[0-9]|[0-9]{10})$/.test(value));
				},
				defaultMessage: buildMessage(
					eachPrefix =>
						`${eachPrefix}$property must be a valid phone number`,
						validationOptions,
				),
			},
		},
		validationOptions,
	);
}