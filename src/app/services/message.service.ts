import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private _showAlert = false;
    private _alertMessage = "";

    constructor() {
    }

    public displayAlert(message: string, error: string): void {
        this._alertMessage = message;
        this._showAlert = true;
        console.log(error);
    }

    public closeAlert(): void {
        this._showAlert = false;
    }

    get showAlert(): boolean{
        return this._showAlert;
    }

    get alertMessage(): string{
        return this._alertMessage;
    }
}
