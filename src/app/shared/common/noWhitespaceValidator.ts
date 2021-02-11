import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class noWhitespaceValidator {
    
    noWhitespaceValidator() {}

    noWhitespace(control: FormControl) {
        const isWhitespace = (control.value || "").trim().length === 0;
        const isValid = !isWhitespace;
        return of(isValid ? null : { "whitespace": true });
    }


}