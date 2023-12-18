// Angular modules
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { DAppKitUI } from '@vechain/dapp-kit-ui';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
    // -------------------------------------------------------------------------------
    // NOTE Init ---------------------------------------------------------------------
    // -------------------------------------------------------------------------------

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public ngOnInit(): void {}

    public openModal(): void {
        DAppKitUI.modal.open();
    }
}
