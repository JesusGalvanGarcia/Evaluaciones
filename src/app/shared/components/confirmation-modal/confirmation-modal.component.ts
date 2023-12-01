import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class ConfirmationModalComponent implements OnInit {
    public active: boolean = false;
    public body: string;
    public title: string;
    public onClose: Subject<boolean> = new Subject();

    public constructor(
        public _bsModalRef: BsModalRef
    ) { }

    public ngOnInit(): void {
        console.log("confirma")
    }

    public showConfirmationModal(title: string, body: string): void {
        this.title = title;
        this.body =  body;
        this.active = true;
    }

    public onConfirm(): void {
        this.active = false;
        this.onClose.next(true);
        this._bsModalRef.hide();
    }

    public onCancel(): void {
        this.active = false;
        this.onClose.next(false);
        this._bsModalRef.hide();
    }

    public hideConfirmationModal(): void {
        this.active = false;
        this.onClose.next(false);
        this._bsModalRef.hide();
    }
}