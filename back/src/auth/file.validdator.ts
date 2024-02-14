import { FileValidator, PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Express } from 'express'
import * as fileType from 'file-type-mime';

export interface CustomUploadTypeValidatorOptions {
  fileType: string[];
}

export class CustomUploadFileTypeValidator extends FileValidator {
  private _allowedMimeTypes: string[];

  constructor(protected readonly validationOptions: CustomUploadTypeValidatorOptions) {
    super(validationOptions);
    this._allowedMimeTypes = this.validationOptions.fileType;
  }

  public isValid(file?: Express.Multer.File): boolean {
    if (!file)
      return false
    
    const response = fileType.parse(file.buffer);
    if (!response || !response.mime) 
      return false;
    
    return this._allowedMimeTypes.includes(response.mime);
  }

  public buildErrorMessage(): string {
    return `Upload not allowed. Upload only files of type: ${this._allowedMimeTypes.map((mime: string) => {
		return mime.replace("image/", '')
	}).join(
      ', ',
    )}`;
  }
}