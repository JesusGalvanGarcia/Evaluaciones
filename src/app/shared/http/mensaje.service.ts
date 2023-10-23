import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';


@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor() {
    alertify.set('notifier', 'position', 'top-right');
  }

  public messages: any = [];
  public sucessMessages: any = [];
  public maxMessages = 2;
  public maxSuccessMessages = 2;

  public confirm(message: string, okCallback: () => any): void {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      }
    });
  }

  public success(message: string): void {
    this.sucessMessages.length < this.maxSuccessMessages
      ? this.sucessMessages.push(alertify.success(message))
      : this.sucessMessages.push(
          this.sucessMessages.shift().dismiss().setContent(message).push()
        );
  }

  public error(message: string): void {
    this.messages.length < this.maxMessages
      ? this.messages.push(alertify.error(message))
      : this.messages.push(
          this.messages.shift().dismiss().setContent(message).push()
        );
  }

  public warning(message: string): void {
    alertify.warning(message);
  }

  public message(message: string): void {
    alertify.message(message);
  }
}
