// Angular modules
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
    // -------------------------------------------------------------------------------
    // NOTE Init ---------------------------------------------------------------------
    // -------------------------------------------------------------------------------

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public ngOnInit(): void {}

    // -------------------------------------------------------------------------------
    // NOTE Actions ------------------------------------------------------------------
    // -------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------
    // NOTE Computed props -----------------------------------------------------------
    // -------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------
    // NOTE Helpers ------------------------------------------------------------------
    // -------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------
    // NOTE Requests -----------------------------------------------------------------
    // -------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------
    // NOTE Subscriptions ------------------------------------------------------------
    // -------------------------------------------------------------------------------
}
