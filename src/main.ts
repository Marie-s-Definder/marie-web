import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RootComponent, routes } from './app/root';

bootstrapApplication(RootComponent, {
    providers: [
        importProvidersFrom(
            BrowserAnimationsModule,
        ),
        provideRouter(
            routes,
            withComponentInputBinding(),
        ),
        provideHttpClient(),
    ],
}).catch(err => console.error(err));
