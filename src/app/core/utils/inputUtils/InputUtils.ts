export class InputUtils {

    constructor() { }

    characterOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return true;
        }
        return false;
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    moreThanZero(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode == 48 || charCode == 46) {
            return false;
        }
        return true;
    }
}