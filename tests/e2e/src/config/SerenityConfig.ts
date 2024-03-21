import { ArtifactArchiver, configure } from '@serenity-js/core';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { ConsoleReporter } from '@serenity-js/console-reporter';

configure({
    crew: [
        SerenityBDDReporter.fromJSON({ specDirectory: '../..' }),
        ArtifactArchiver.storingArtifactsAt('../../.reports/serenity'),
        ConsoleReporter.withDefaultColourSupport(),
    ],
});
