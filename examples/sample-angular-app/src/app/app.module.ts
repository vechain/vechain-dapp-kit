// Angular modules
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// External modules
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSvgIconModule } from 'angular-svg-icon';
// Internal modules
import { AppRoutingModule } from './app-routing.module';
// Components
import { AppComponent } from './app.component';

// Factories

@NgModule({
    imports: [
        // Angular modules
        HttpClientModule,
        BrowserAnimationsModule,
        BrowserModule,

        // External modules
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        AngularSvgIconModule.forRoot(),

        AppRoutingModule,
    ],
    providers: [
        // Pipes
        DatePipe,

        // Guards

        // Interceptors
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

export const createTranslateLoader = (http: HttpClient) => {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};
