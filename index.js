/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { registerTranslation } from 'react-native-paper-dates';
registerTranslation('es', {
    save: 'Guardar',
    selectSingle: 'Fecha',
    selectMultiple: 'Fechas',
    selectRange: 'Periodo',
    notAccordingToDateFormat: (inputFormat) =>
        `Date format must be ${inputFormat}`,
    mustBeHigherThan: (date) => `Must be later then ${date}`,
    mustBeLowerThan: (date) => `Must be earlier then ${date}`,
    mustBeBetween: (startDate, endDate) =>
        `Must be between ${startDate} - ${endDate}`,
    dateIsDisabled: 'Day is not allowed',
    previous: 'Previo',
    next: 'Siguiente',
    typeInDate: 'Type in date',
    pickDateFromCalendar: 'Pick date from calendar',
    close: 'Cerrar',
});

AppRegistry.registerComponent(appName, () => App);
