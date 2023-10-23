import { NgForm } from "@angular/forms";

export function validateRequiredFields(form: NgForm){
    Object.keys(form.controls).forEach((name) => {
        const control = form.controls[name];
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
    });
}